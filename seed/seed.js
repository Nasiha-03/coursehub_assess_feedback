const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('../models/Notification');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  await Notification.deleteMany();
  await Notification.insertMany([
    { message: "Welcome to Student Hub", active: true },
    { message: "Your course deadline is tomorrow!", active: true }
  ]);
  console.log("Seeded notifications!");
  process.exit();
};

seedData();