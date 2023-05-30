const mongoose = require('mongoose');
const User = require('./user');

// Assume only complete games are stored
const gameSchema = new mongoose.Schema({
    winner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    loser: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    date: {
        required: true,
        type: Date
    },

    board: {
        type: [[String]]
    },

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        body: String
    }],
}
);

module.exports = mongoose.model('Game', gameSchema);