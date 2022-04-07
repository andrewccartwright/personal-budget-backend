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

app.use(session({ secret: this.process.GOOGLE_CLIENT_SECRET }));

const oAuth2Client = new OAuth2Client();

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://andrewchatch.github.io/personal-budget"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      console.log(userProfile);
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });


app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 8000;

app.use('/expenses', expenseRouter);

app.use('/income', incomeRouter);

app.use('/', express.static('public'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})