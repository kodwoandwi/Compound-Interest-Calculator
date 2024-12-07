const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
    res.render('index', {result: null});
});

app.post('/', (req, res) => {
    const { principal, interestRate, numDays, startDate } = req.body;

    const principalAmount = parseFloat(principal);
    const dailyRate = parseFloat(interestRate) / 100;  // Converting interest rate from percentage to decimal
    const start = new Date(startDate);

    let currentAmount = principalAmount;
    let result = [];
    let totalWithdrawals = 0; // Ensure this is initialized to 0
    let netProfit = 0;

    // Loop through each day and calculate the interest and principal
    for (let day = 1; day <= numDays; day++) {
        const dailyInterest = currentAmount * dailyRate;
        currentAmount += dailyInterest; // Add interest to principal

        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + day);

        result.push({
            day,
            date: currentDate.toLocaleDateString(),
            dailyInterest: dailyInterest.toFixed(2),
            totalAmount: currentAmount.toFixed(2),
            totalWithdrawals: totalWithdrawals.toFixed(2), // Still 0 if no withdrawals
            netProfit: (currentAmount - principalAmount).toFixed(2),
        });
    }

    netProfit = currentAmount - principalAmount; // Calculate net profit

    // Render the result page with calculations
    res.render('index', {
        principal: principalAmount.toFixed(2),
        totalAmount: currentAmount.toFixed(2),
        netProfit: netProfit.toFixed(2),
        totalWithdrawals: totalWithdrawals.toFixed(2),
        interestRate: (dailyRate * 100).toFixed(2),
        startDate: startDate,
        result: result,
    });
});


app.listen(3000, function () {
    console.log('Express server listening on port 3000');
});