const Assessment = require('../models/Assessment');

const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAssessments };
