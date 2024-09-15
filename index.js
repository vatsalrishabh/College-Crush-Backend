const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const Student = require('./models/Student');

// Connect to MongoDB database
require('./db');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/students', require('./routes/student'));
app.use('/api/messages', require('./routes/message'));

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connections
let users = {}; // Object to keep track of users and their statuses

io.on('connection', (socket) => {
  // Handle 'loggedInUser' event to store user email with socket ID
  socket.on('loggedInUser', async (email) => {
    // console.log(email);
    try {
      // Update the user's status in the database
      await Student.findOneAndUpdate(
        { email },
        { $set: { onlineStatus: 'online', lastSeen: new Date() } },
        { new: true }
      );
      
      users[email] = { socketId: socket.id, status: 'online' };
      io.emit('userStatus', users); // Notify all clients of the updated user list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  // Listen for typing event
  socket.on('typing', ({ user, to }) => {
    // Broadcast the typing event to the recipient
    const recipientSocketId = users[to]?.socketId;
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing', { user });
    }
  });

  // Listen for stop typing event
  socket.on('stopTyping', ({ user, to }) => {
    // Broadcast the stop typing event to the recipient
    const recipientSocketId = users[to]?.socketId;
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('stopTyping', { user });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', async () => {
    try {
      // Find user by socket ID
      const userEmail = Object.keys(users).find(email => users[email].socketId === socket.id);
      if (userEmail) {
        // Update the user's status in the database
        await Student.findOneAndUpdate(
          { email: userEmail },
          { $set: { onlineStatus: 'offline', lastSeen: new Date() } },
          { new: true }
        );
        
        delete users[userEmail];
        io.emit('userStatus', users); // Notify all clients of the updated user list
      }
    } catch (error) {
      console.error('Error updating user status on disconnect:', error);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { io };
