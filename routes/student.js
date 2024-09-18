const express = require('express');
const { registerStudent , verifyOtp, loginStudent, updatePassword, updatePasswordOtp } = require('../controllers/authController');
const { jwtMiddleware } = require('../middleware/jwtmiddleware');
const multerConfig = require('../utils/multerConfig');
const { fetchAllStudents,fetchOneStudent } = require('../controllers/fetchController');

const router = express.Router();

// Define patient routes
router.get('/', fetchAllStudents);  //  http://localhost:3000/api/students/
router.get('/:id', fetchOneStudent );  //http://localhost:3000/api/students/id




router.post('/register',registerStudent);  //  http://localhost:3000/api/students/register
router.post('/login',loginStudent);    //  http://localhost:3000/api/students/login
router.post('/verifyOTP',multerConfig.single('dp'),verifyOtp);    //  http://localhost:3000/api/students/verifyOtp
router.post('/updatePassword',updatePassword);   //  http://localhost:3000/api/students/updatePassword
router.post('/updatePasswordOtp',updatePasswordOtp);   //  http://localhost:3000/api/students/updatePasswordOtp





module.exports = router;