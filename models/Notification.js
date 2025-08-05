const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  active: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);