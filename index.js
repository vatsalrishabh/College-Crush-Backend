const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path'); // to serve the image file to frontend
const app = express();
const port = process.env.PORT || 3000 ;

// Connect to MongoDB database
require('./db');

// Middleware to parse JSON bodies
app.use(express.json()); // Handles JSON parsing
// app.use(express.urlencoded({extended:false}));
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // to serve the image file to fornend
// Patient routes


app.use('/api/students', require('./routes/student'));
app.use('/api/messages', require('./routes/message'));

// Doctor routes
// app.use('/api/doctors', require('./routes/doctor'));



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});