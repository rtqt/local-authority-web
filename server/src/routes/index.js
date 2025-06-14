
const express = require('express');
const authRoutes = require('./auth');
const issueRoutes = require('./issues');
const categoryRoutes = require('./categories');
const feedbackRoutes = require('./feedback');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/issues', issueRoutes);
router.use('/categories', categoryRoutes);
router.use('/feedback', feedbackRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
