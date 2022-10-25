const express = require('express');
const metadata = require('gcp-metadata');
const cors = require('cors');
const bodyParser = require('body-parser');
const expenseRouter = require('./expenses');
const incomeRouter = require('./income');
const {OAuth2Client} = require('google-auth-library');
const passport = require('passport');
const session = require('express-session');
// After you declare "app"
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://andrewchatch.github.io',
    credentials: true
}));

app.use('/expenses', expenseRouter);

app.use('/income', incomeRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
