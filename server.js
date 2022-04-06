const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expenseRouter = require('./expenses');
const incomeRouter = require('./income');
const app = express();


app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const PORT = process.env.PORT || 8000;

app.use('/expenses', expenseRouter);

app.use('/income', incomeRouter);

app.get('/', (req, res) => {
    res.json({"message": "Connection successful"});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})