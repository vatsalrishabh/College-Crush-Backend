const express = require('express');
const { registerStudent , verifyOtp, loginStudent, updatePassword, updatePasswordOtp } = require('../controllers/authController');
const { jwtMiddleware } = require('../middleware/jwtmiddleware');
const multerConfig = require('../utils/multerConfig');
const { fetchAllStudents,fetchOneStudent,fetchStudentBySequence,numberOfStudents } = require('../controllers/fetchController');
const { postLike, postDislike, postCrush,getCrushLikes  } = require('../controllers/matchController');

const router = express.Router();

// Define patient routes
router.get('/', fetchAllStudents);  //  http://localhost:3000/api/students/       who are liked or crushed
router.get('/:id', fetchOneStudent );  //http://localhost:3000/api/students/id
router.get('/swipe/:studentId', fetchStudentBySequence); //http://localhost:3000/api/students/swipe/1
router.post('/totalStu', numberOfStudents); // Ensure this matches the URL you are trying to access // Ensure this is correctly defined
// router.get('/totalStu', numberOfStudents);



router.post('/register',registerStudent);  //  http://localhost:3000/api/students/register
router.post('/login',loginStudent);    //  http://localhost:3000/api/students/login
router.post('/verifyOTP',multerConfig.single('dp'),verifyOtp);    //  http://localhost:3000/api/students/verifyOtp
router.post('/updatePassword',updatePassword);   //  http://localhost:3000/api/students/updatePassword
router.post('/updatePasswordOtp',updatePasswordOtp);   //  http://localhost:3000/api/students/updatePasswordOtp


router.post('/match/like',postLike);  //  http://localhost:3000/api/students/match/like
router.post('/match/dislike',postDislike);  //  http://localhost:3000/api/students/match/dislike
router.post('/match/crush',postCrush);  //  http://localhost:3000/api/students/match/crush
router.post('/match/getCrushLikes',getCrushLikes);  //  http://localhost:3000/api/students/match/getCrushLikes


module.exports = router;