const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  contact: String,
  college: String,
  gender: String,
  dp:String,
  password:String,
  dp1:String,
  dp2:String,
  dp3:String,
  dp4:String,
  dp5:String,
  lastSeen: { type: Date, default: Date.now },
  onlineStatus:String,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;