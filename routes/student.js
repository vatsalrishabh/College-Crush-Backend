const express = require('express');
const { registerStudent , verifyOtp, loginStudent, updatePassword, updatePasswordOtp } = require('../controllers/authController');
const { jwtMiddleware } = require('../middleware/jwtmiddleware');
const multerConfig= require('../utils/multerConfig');

const router = express.Router();

// Define patient routes
router.get('/', (req, res) => {
  res.send('List of patients');
});

router.post('/register',registerStudent);  //  http://localhost:3000/api/students/register
router.post('/login',loginStudent);    //  http://localhost:3000/api/students/login
router.post('/verifyOTP',multerConfig.single('dp'),verifyOtp);    //  http://localhost:3000/api/students/verifyOtp
router.post('/updatePassword',updatePassword);   //  http://localhost:3000/api/students/updatePassword
router.post('/updatePasswordOtp',updatePasswordOtp);   //  http://localhost:3000/api/students/updatePasswordOtp

router.get('/:id', jwtMiddleware,(req, res) => {
  res.send(`Patient details for ID (${req.params.id})`);
});

router.put('/:id', (req, res) => {
  res.send(`Update patient with ID ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`Delete patient with ID ${req.params.id}`);
});

module.exports = router;