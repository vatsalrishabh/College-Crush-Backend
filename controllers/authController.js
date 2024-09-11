const { sendOtpEmail } = require('../utils/mailer');
const { sendOtpEmailForgot } = require('../utils/forgotOtpmail');
const Student = require('../models/Student');  // Updated to Student
const Otp = require('../models/Otp');
const { makeJwtToken, verifyJwtToken } = require('../service/auth');

const message = "To ensure the security of your account and to complete your registration, please verify your email with the One-Time Password (OTP) provided below.";
const subject = "Your OTP for PulseCare.";

// Function to generate a 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Register Student
const registerStudent = async (req, res) => {
    const { name, email, mobile, password, age, sex } = req.body;

    try {
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            console.log("User is already registered.");
            return res.status(400).json({ message: 'User already registered. Please try logging in.' });
        }

        let otpDoc = await Otp.findOne({ email });
        const otp = otpDoc ? otpDoc.otp : generateOtp();

        if (!otpDoc) {
            otpDoc = new Otp({ email, otp });
            await otpDoc.save(); // Save the OTP to the database
            console.log("New OTP generated and sent.");
        } else {
            console.log("OTP from Otp collection: " + otpDoc.otp);
        }

        await sendOtpEmail(email, otp, message, subject);

        return res.status(200).json({ message: 'Registration successful, OTP sent to email.' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const existingOtp = await Otp.findOne({ email, otp });
        if (existingOtp) {
            const {email,name,contact,college,gender, password } = req.body;
                // Construct the full URL for the profile picture
    const dpPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            const newStudent = new Student({ email,name,contact,college,gender, dp:dpPath, });  // Updated to Student
            await newStudent.save();

            // Optionally, delete the OTP after successful verification
            await Otp.deleteOne({ email });

            return res.status(200).json({ message: 'You have been successfully registered.' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login Student
const loginStudent = async (req, res) => {
    const { studentEmail, studentPassword } = req.body;
  
    try {
        const email = studentEmail;
        const student = await Student.findOne({ email });  // Updated to Student
        if (!student) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (student.password !== studentPassword) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        const { mobile } = student;
        const studentData = makeJwtToken({ email, mobile });
        
        return res.status(200).json({ message: 'User Logged In Successfully.', studentDetails: studentData });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Update Password
const updatePassword = async (req, res) => {
    const { emailUpdatePassword } = req.body;
    const email = emailUpdatePassword;

    try {
        const studentDetails = await Student.findOne({ email });  // Updated to Student
        if (!studentDetails) {
            return res.status(400).json({ message: "Email not found, Please go to Registration Page!" });
        }

        const otpDoc = await Otp.findOne({ email });
        const otp = otpDoc ? otpDoc.otp : generateOtp();

        if (!otpDoc) {
            const newOtp = new Otp({ email, otp });
            await newOtp.save();
            await sendOtpEmailForgot(email, otp, "OTP to reset your password.", subject);
            console.log("New OTP generated and sent for password reset.");
        } else {
            await sendOtpEmailForgot(email, otp, "OTP to reset your password.", subject);
            console.log("Existing OTP sent for password reset.");
        }

        return res.status(200).json({ message: "OTP to change password has been sent." });
    } catch (error) {
        console.error('Error during password update request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Verify OTP and Update Password
const updatePasswordOtp = async (req, res) => {
    const { email, password, otp } = req.body;

    try {
        const otpMatched = await Otp.findOne({ email, otp });
        if (!otpMatched) {
            return res.status(400).json({ message: "OTP did not match. Please try again." });
        }

        const student = await Student.findOne({ email });  // Updated to Student
        if (!student) {
            return res.status(400).json({ message: "Student not found. Please register first." });
        }

        // Update the student's password
        student.password = password;
        await student.save();

        // Delete the used OTP
        await Otp.deleteOne({ email });

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error('Error during OTP verification for password update:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    registerStudent,
    verifyOtp,
    loginStudent,
    updatePassword,
    updatePasswordOtp
};
