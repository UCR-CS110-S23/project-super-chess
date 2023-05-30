const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');

module.exports = new LocalStrategy(User.authenticate());