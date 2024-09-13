const Message = require('../models/Message');
const Student = require('../models/Student');

// Fetching messages between two users
const getMessages = async (req, res) => {
  try {
    const { sentFrom, sentTo } = req.query; // Access query parameters
// console.log(sentFrom+" "+sentTo);
    // Fetch messages between sentFrom and sentTo
    const messages = await Message.find({
      $or: [
        { sentFrom, sentTo },
        { sentFrom: sentTo, sentTo: sentFrom }
      ]
    }).sort({ createdAt: 1 }); // Sorting by creation date

// console.log(messages);

    // Fetch recipient's name and dp
    const student = await Student.findOne({ email: sentTo }).select('name dp'); // Fetch name and dp

    if (!student) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Send both messages and recipient's name/dp in the response
    res.status(200).json({
      messages,
      recipient: {
        name: student.name,
        dp: student.dp
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};


// Sending a new message
const sendMessages = async (req, res) => {
  try {
    const { sentFrom, sentTo, message } = req.body;

    // Create new message
    const newMessage = new Message({
      sentFrom,
      sentTo,
      message,
      createdAt: new Date(), // Add timestamp if not automatically added by schema
      senderIp: req.ip, // Capturing IP address
    });

    // Save the new message to the database
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Exporting functions to be used in routes
module.exports = {
  getMessages,
  sendMessages,
};
