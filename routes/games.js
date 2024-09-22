const express = require('express');
const multer = require('multer');
const { getQuestions, getAllAnswers, getAllQuestions, postAnswerToQuestion,postQuestion } = require('../controllers/questionController');
const {findTopSix} = require('../controllers/rankController');
const router = express.Router();

// Multer configuration (for handling form-data)
// We are storing the files in memory (but can also store on disk)
const upload = multer({ storage: multer.memoryStorage() });

// Base URL: /api/questions
router.get('/', getAllQuestions);  // Get all questions one by one

// Get all answers from different users on a specific question
// Base URL: /api/questions/getAllAns
router.get('/getAllAns', getAllAnswers);

// Post an answer to a specific question (use multer middleware to handle form-data)
// Base URL: /api/questions/postAnsToQue
router.post('/postAnsToQue', upload.none(), postAnswerToQuestion);  // '.none()' means no file, but still form-data



//Post  a new question
// Base URL: /api/questions/postNewQue
router.post('/postNewQue', upload.none(), postQuestion);



// ranking boys and girls route
// Base URL: /api/questions/topSix
router.get('/topSix',findTopSix);


// ranking boys and girls route
// Base URL: /api/questions/topSix
router.get('/topSix',findTopSix);


module.exports = router;
