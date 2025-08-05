const Course = require('../models/courseModel');

const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

const addCourse = async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({ title, description });
  res.status(201).json(course);
};

module.exports = { getCourses, addCourse };