
const { Feedback, Issue, User } = require('../models');

const createFeedback = async (req, res) => {
  try {
    const { issueId, description, rating } = req.body;

    // Check if issue exists
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const feedback = await Feedback.create({
      issueId,
      submittedByUserId: req.user.userId,
      description,
      rating
    });

    const createdFeedback = await Feedback.findByPk(feedback.feedbackId, {
      include: [
        { model: User, as: 'submittedBy', attributes: ['username'] },
        { model: Issue, as: 'issue', attributes: ['title'] }
      ]
    });

    res.status(201).json({
      message: 'Feedback created successfully',
      feedback: createdFeedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

const getFeedbackByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const feedback = await Feedback.findAll({
      where: { issueId },
      include: [
        { model: User, as: 'submittedBy', attributes: ['username'] }
      ],
      order: [['submissionDate', 'DESC']]
    });

    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, rating } = req.body;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check if user owns this feedback
    if (feedback.submittedByUserId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this feedback' });
    }

    await feedback.update({ description, rating });

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check if user owns this feedback or is admin
    if (feedback.submittedByUserId !== req.user.userId && req.user.userRole !== 'SystemAdministrator') {
      return res.status(403).json({ error: 'Not authorized to delete this feedback' });
    }

    await feedback.destroy();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByIssue,
  updateFeedback,
  deleteFeedback
};
