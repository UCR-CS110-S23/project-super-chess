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

    // Consideration: Maybe store comments as part of session data instead? I don't think it makes sense to show the comments after the game is over
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

// If new game, update winner and loser in user table with game id as ref.

module.exports = mongoose.model('Game', gameSchema);