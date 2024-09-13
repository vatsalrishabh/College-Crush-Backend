const express = require('express');
const { jwtMiddleware } = require('../middleware/jwtmiddleware');
const multerConfig = require('../utils/multerConfig');
const { getMessages, sendMessages } = require('../controllers/messageController');

const router = express.Router();

// Define patient routes
router.get('/', getMessages); // get all mesages of a specific user  http://localhost:3000/api/messages
// router.post('/', jwtMiddleware, sendMessages);  send message to the selected user  http://localhost:3000/api/messages
router.post('/', sendMessages);

// router.post('/register',registerStudent);  //  http://localhost:3000/api/students/register


module.exports = router;