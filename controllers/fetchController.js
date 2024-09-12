const Student = require('../models/Student');

// Fetch all students
const fetchAllStudents = async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all students
        res.json(students); // Send the students as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Failed to get students', error });
    }
};

// Fetch a specific student by ID
const fetchOneStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id); // Fetch student by ID
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
