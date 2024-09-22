const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    dislikedby: String,
    dislikedto: String,
    likedby: String,
    likedto: String,
    crushby: String,
    crushto: String,
    dateTime: {
        type: Date,
        default: Date.now // Automatically sets the current date and time if not provided
    }
});

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
