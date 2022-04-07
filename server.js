const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expenseRouter = require('./expenses');
const incomeRouter = require('./income');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const app = express();

const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) {
        return console.log('Error loading client secret file:', err);
    }

    authorize(JSON.parse(content));
});

const authorize = (credentials, callback) => {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if(err) {
            return getNewToken(oAuth2Client, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client)
    });
}

const getNewToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return console.error('Error retrieving access token:', err);
            }

            oAuth2Client.setCredentials(token);

            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if(err) return console.error(err);
                console.log('Token stored to ', TOKEN_PATH);
            });

            callback(oAuth2Client);
        });
    });
}


app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 8000;

app.use('/expenses', expenseRouter);

app.use('/income', incomeRouter);

app.get('/', (req, res) => {
    res.json({"message": "Connection successful"});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})