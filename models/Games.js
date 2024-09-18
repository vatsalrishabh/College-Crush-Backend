const mongoose = require('mongoose');

// Define the GamesSchema
const GamesSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true, // Ensure questionId is provided
    },
    question: {
        type: String,
        required: true, // The question text is required (the answer text will be stored here)
    },
    answerBy: {
        type: String,
        required: true, // User or identifier who answered the question
    },
    answerTime: {
        type: Date,
        default: Date.now, // Automatically sets the time when the answer is submitted
    },
    answerIP: {
        type: String, // Store the IP address from where the answer was submitted
        required: true
    },
    anonymous: {
        type: Boolean, // Boolean to check if the answer was submitted anonymously
        default: false
    },
});

// Create the Games model from the schema
const Games = mongoose.model('Games', GamesSchema);

module.exports = Games;
