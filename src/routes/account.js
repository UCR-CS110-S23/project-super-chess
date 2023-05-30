const express = require('express');
const passport = require('passport');
const accountController = require('./../controller/account');

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

// Login with account on account page
router.get('/', accountController.user);

// Todo: Handle username change (auth first)
// Todo: login with username and password

module.exports = router;