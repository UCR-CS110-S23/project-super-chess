const mongoose = require('mongoose');
const User = require('./user');

const commentSchema = new mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    text: {
        required: true,
        type: String
    }
}
);

module.exports = mongoose.model('Comment', commentSchema);