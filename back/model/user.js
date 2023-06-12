const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  rooms: {
    type: Array,
    required: true,
  },
});

userSchema.pre("save", function () {
  this.salt = crypto.randomBytes(16).toString("hex");
  console.log(this.password);
  this.hash = crypto
    .pbkdf2Sync(this.hash, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
});

const validPassword = async function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

module.exports = mongoose.model("User", userSchema);
