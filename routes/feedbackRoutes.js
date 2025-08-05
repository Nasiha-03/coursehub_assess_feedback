const express = require('express');
const router = express.Router();
const { postFeedback } = require('../controllers/feedbackController');

router.post('/', postFeedback);

module.exports = router;