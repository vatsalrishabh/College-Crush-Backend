const Student = require('../models/Student');
const Message = require('../models/Message');

// Fetch all students and last message exchanged between tehm
const fetchAllStudents = async (req, res) => {
    const { sentFrom } = req.query;  // Extract sentFrom from the query parameters

    try {
        // Fetch all students
        const students = await Student.find(); 

        // Create a list to store students along with their latest messages
        const studentMessages = await Promise.all(
            students.map(async (student) => {
                // Fetch the latest message sent by sentFrom to the student
                const sentMessage = await Message.findOne({
                    sentFrom: sentFrom, 
                    sentTo: student.email
                }).sort({ createdAt: -1 });  // Sort by most recent

                // Fetch the latest message sent by the student to sentFrom
                const receivedMessage = await Message.findOne({
                    sentFrom: student.email, 
                    sentTo: sentFrom
                }).sort({ createdAt: -1 });  // Sort by most recent

                // Compare both messages and pick the latest one
                let latestMessage = null;
                if (sentMessage && receivedMessage) {
                    latestMessage = sentMessage.createdAt > receivedMessage.createdAt 
                        ? sentMessage 
                        : receivedMessage;
                } else {
                    latestMessage = sentMessage || receivedMessage;  // If only one exists
                }

                // Return student data along with the latest message (if found)
                return {
                    student: student.toObject(),  // Convert mongoose document to plain object
                    latestMessage: latestMessage ? latestMessage.message : null  // Include message or null if no messages exist
                };
            })
        );

        // Send the list of students with the latest message as the response
        res.json(studentMessages);
// console.log(studentMessages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get students and messages', error });
    }
};







// Fetch a specific student by ID
const fetchOneStudent = async (req, res) => {
   const email = req.params.id; // actual it's not id it's email remember that vatsal
    try {
        const student = await Student.findOne({email}); // Fetch student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student); // Send the student as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Failed to get student', error });
    }
};

module.exports = {
    fetchAllStudents,
    fetchOneStudent
};
