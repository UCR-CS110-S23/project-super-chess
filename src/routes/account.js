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

// Login with account (why isn't account here?? And where is logout??)
router.get('/', accountController.user);

module.exports = router;