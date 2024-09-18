const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    likedby: {
        type: String,
        required: true
    },
    likedto: {
        type: String,
        required: true
    },
    crushby: {
        type: String,
       
    },
    crushto: {
        type: String,
        // Not required
    },
    dateTime: {
        type: Date,
        default: Date.now // Automatically sets the current date and time if not provided
    }
});

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
