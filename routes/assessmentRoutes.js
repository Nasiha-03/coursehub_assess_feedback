const express = require('express');
const { getAssessments } = require('../controllers/assessmentController');
const router = express.Router();

router.get('/', getAssessments);

module.exports = router;
