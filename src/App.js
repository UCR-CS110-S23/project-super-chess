const express = require('express');
const session = require('express-session');
const authRouter = require('./routes/auth');
const accountRouter = require('./routes/account');

const app = express();

// For views. Consider using a different engine.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Startup up app with session info
app.use(
    session(
      { 
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        saveUninitialized: false 
      }));

// Redirect from home if not logged in
app.get('/', function(req, res){
    res.redirect('/auth');
});

// set Routes
app.use('/auth', authRouter);
app.use('/account', accountRouter);

module.exports = app;