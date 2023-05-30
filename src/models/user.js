const mongoose = require('mongoose');
//use password package to manage 3rd party authentication
const passportLocalMongoose = require('passport-local-mongoose');
const Game = require('./game');


const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },

    password: {
        required: true,
        type: String
    },

    plays: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

    // wins: {
    //     type: Int16Array,
    //     default: 0
    // },

    // losses: {
    //     type: Int16Array,
    //     default: 0
    // },
}
);

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)