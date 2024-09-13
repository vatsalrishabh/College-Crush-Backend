const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sentFrom: {
        type: String,
        required: true,  // Field is mandatory
    },
    sentTo: {
        type: String,
        required: true,  // Field is mandatory
    },
    message: {
        type: String,
        required: true,  // Field is mandatory
    },
    timeDate: {
        type: Date,
        default: Date.now,  // Sets the default value to the current date and time
    },
    senderIp: {
        type: String,  // Stores the IP address as a string
    },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
