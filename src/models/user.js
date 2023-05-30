// models/user.js
const mongoose = require('../config/database');

// User Schema
const userSchema = new mongoose.Schema(
  {
    // fullname: { type: String },
    username: { type: String },
    githubId: { type: String, unique: true },
    // location: { type: String },
    // phone: { type: String },
    email: { type: String, lowercase: true },
    // profilePhoto: { type: String, default: '' }
  },
  { timestamps: true } // Not sure what this is for
);

// Create model from schema (kind of like tables)
const User = mongoose.model('User', userSchema);

module.exports = User;