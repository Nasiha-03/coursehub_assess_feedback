const Feedback = require('../models/Feedback');

const postFeedback = async (req, res) => {
  const { userId, rating, comment } = req.body;

  if (!userId || !rating || !comment) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const feedback = new Feedback({ userId, rating, comment });
    await feedback.save();
    res.status(201).json({ success: true, data: feedback, message: "Feedback saved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { postFeedback };