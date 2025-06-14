
const express = require('express');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getMyIssues
} = require('../controllers/issueController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateIssue, validateUUID } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticate, getIssues);
router.post('/', authenticate, authorize('CommunityMember', 'LocalAuthority'), validateIssue, createIssue);
router.get('/my-issues', authenticate, getMyIssues);
router.get('/:id', authenticate, validateUUID, getIssueById);
router.put('/:id', authenticate, validateUUID, updateIssue);
router.delete('/:id', authenticate, validateUUID, deleteIssue);

module.exports = router;
