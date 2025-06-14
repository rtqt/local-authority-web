
const express = require('express');
const {
  createFeedback,
  getFeedbackByIssue,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { authenticate } = require('../middleware/auth');
const { validateUUID } = require('../middleware/validation');

const router = express.Router();

router.post('/', authenticate, createFeedback);
router.get('/issue/:issueId', authenticate, validateUUID, getFeedbackByIssue);
router.put('/:id', authenticate, validateUUID, updateFeedback);
router.delete('/:id', authenticate, validateUUID, deleteFeedback);

module.exports = router;
