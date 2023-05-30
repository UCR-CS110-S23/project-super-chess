const express = require('express');
const passport = require('passport');
const github = require('./../utils/github'); //Github strategy
const local = require('./../utils/local');
const authController = require('./../controller/auth'); //User Auth Ctrl

// Make passport use github
passport.use(github);
passport.use(local);

// Create route handler
const router = express.Router();

// Start route handler with a passport with a session
router.use(passport.initialize());
router.use(passport.session());

// Set session data to req.session.passport.user = {}. Default store entire user object.
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Ok not sure what this is doing
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Render login page
router.get('/', function(req, res){
    res.render('index', { user: req.user });
});

// Go to github for authentication
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// Return from github after attempted authentication
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) =>  res.redirect('/account'));

// Handle local authentication
router.post('/local', passport.authenticate('local', {
    successRedirect: '/account', // Redirect to account page on success
    failureRedirect: '/', // Redirect back to the login page on failure
  }));

// Log out
router.get('/logout', authController.logout);

module.exports = router;