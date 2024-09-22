const Student = require('../models/Student');
const Message = require('../models/Message');

// Fetch all students and the last message exchanged between them
const fetchAllStudents = async (req, res) => {
    const { sentFrom } = req.query;  // Extract sentFrom from the query parameters

    try {
        // Fetch all students
        const students = await Student.find();

        // Create a list to store students along with their latest messages
        const studentMessages = await Promise.all(
            students.map(async (student) => {
                // Check if the current user has any messages with this student
                const sentMessage = await Message.findOne({
                    sentFrom: sentFrom,
                    sentTo: student.email
                });

                const receivedMessage = await Message.findOne({
                    sentFrom: student.email,
                    sentTo: sentFrom
                });

                // If no messages exist, skip this student
                if (!sentMessage && !receivedMessage) return null;

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

        // Filter out any null results (students who have no messages)
        const filteredStudentMessages = studentMessages.filter(studentMsg => studentMsg !== null);

        // Send the list of students with at least one message as the response
        res.json(filteredStudentMessages);
       
    } catch (error) {
        res.status(500).json({ message: 'Failed to get students and messages', error });
    }
};

// Fetch a specific student by email
const fetchOneStudent = async (req, res) => {
    const email = req.params.id;  // actual it's not id it's email, remember that
    try {
        const student = await Student.findOne({ email });  // Fetch student by email
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);  // Send the student as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Failed to get student', error });
    }
};

// Fetch a specific student by sequence ID
const fetchStudentBySequence = async (req, res) => {
    try {
        const { studentId } = req.params;
        const firstStudent = await Student.findOne({ studentId: `${studentId}` });

        if (firstStudent) {
            res.status(200).json(firstStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to get student', error });
    }
};

// Count total number of students
const numberOfStudents = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.status(200).json({ total: count });
    } catch (error) {
        console.error("Error fetching total students:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    fetchAllStudents,
    fetchOneStudent,
    fetchStudentBySequence,
    numberOfStudents
};
