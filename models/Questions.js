const mongoose = require('mongoose');


const questionSchema = mongoose.Schema({
    questionNumber: { type: Number, unique: true }, // Auto-incremented number, will be unique
    question: String,
    questionBy: String,
    ipAddress: String,
    anonymous:Boolean,
    timeDate: { type: Date, default: Date.now } // Define the type as Date, with a default value of the current date and time
});

// Apply auto-increment to questionNumber


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
