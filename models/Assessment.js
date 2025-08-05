const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: String,
  dueDate: Date,
  description: String
});

module.exports = mongoose.model('Assessment', assessmentSchema);