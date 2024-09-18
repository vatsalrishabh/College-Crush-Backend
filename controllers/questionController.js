const Games = require('../models/Games');
const Question = require('../models/Questions');
const Student = require('../models/Student');

// Function to get questions based on user-specific responses
const getQuestions = async (req, res) => {
 
    try {
        const { questionBy } = req.body; // Assuming you're querying by user who posted the question
        
        // Find all questions posted by the specific user
        const userQuestions = await Question.find({ questionBy });

        // If no questions are found, return a 404 response
        if (userQuestions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the user' });
        }

        // Return the found questions
        res.status(200).json(userQuestions);
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Function to axios.post a new question
// http://localhost:3000/api/questions
const getAllAnswers = async (req, res) => {
    try {
        // Destructure fields from query parameters
        const { questionNumber } = req.query;

        // Validate that questionNumber is provided
        if (!questionNumber) {
            return res.status(400).json({ message: 'Question number is required' });
        }

        // Convert questionNumber to number (if necessary)
        const questionId = parseInt(questionNumber, 10);

        // Find all answers for the given questionId
        const answers = await Games.find({ questionId });

        // Check if answers are found
        if (answers.length === 0) {
            return res.status(404).json({ message: 'No answers found for this question' });
        }

        // Fetch additional details for each answer
        const detailedAnswers = await Promise.all(answers.map(async (answer) => {
            let student = null;
            if (!answer.anonymous) {
                student = await Student.findOne({ email: answer.answerBy });
            }
            return {
                ...answer.toObject(), // Convert mongoose document to plain object
                studentName: student ? student.name : null,
                studentDp: student ? student.dp : null,
            };
        }));

        // Respond with the answers including additional details
        res.status(200).json({
            message: 'Answers retrieved successfully',
            data: detailedAnswers
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// Function to axios.get a new question
// http://localhost:3000/api/questions
const getAllQuestions = async (req, res) => {
    try {
        // Retrieve the query parameter for the document index
        const { index } = req.query;
        const questionIndex = parseInt(index, 10) || 1;

        // Find the question by questionNumber
        const question = await Question.findOne({ questionNumber: questionIndex }).exec();

        // If no question is found, return a 404 response
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Return the found question
        res.status(200).json(question);
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};







// Function to axios.post a new answe to the  question
// http://localhost:3000/api/questions
const postAnswerToQuestion = async (req, res) => {

    try {
  
      // Destructure incoming data from the request body
      const { questionId, answer, answerBy, answerTime, answerIP, anonymous } = req.body;
  
      // Create a new answer using the Games model
      const newAnswer = new Games({
        questionId,        // Directly use the questionId coming from the request
        question: answer,  // Storing the answer as the 'question' field in the schema
        answerBy,          // User who answered
        answerTime,        // Time of the answer (default is set to Date.now() if missing)
        answerIP:req.ip,          // IP address
        anonymous,         // Whether the answer is anonymous or not
      });
  
      // Save the new answer in the database
      await newAnswer.save();
  
      // Return success response
      res.status(200).json({ message: 'Answer submitted successfully', newAnswer });
  
    } catch (error) {
      // Handle server errors
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };





  const postQuestion = async (req, res) => {

    try {
      const { question, questionBy, timeDate, anonymous } = req.body;

      // Find the last question ID to determine the new question ID
      const lastQuestion = await Question.findOne().sort({ questionNumber: -1 });
      const newQuestionId = lastQuestion ? lastQuestion.questionNumber + 1 : 1;
    
      const newQuestion = new Question({
        questionNumber: newQuestionId,
        question,
        questionBy,
        ipAddress:req.ip,
        timeDate,
        anonymous,
      });
  
      // Save the new question to the database
      await newQuestion.save();
  
      // Send success response
      res.status(201).json({ message: 'Question posted successfully', question: newQuestion });
  
    } catch (error) {
      // Handle and respond to errors
      console.error('Error posting question:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  







module.exports = {
    getQuestions,
    getAllAnswers,
    getAllQuestions,
    postAnswerToQuestion,
    postQuestion,
};
