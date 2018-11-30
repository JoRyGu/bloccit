const express = require('express');
const router = express.Router();

const voteController = require('../controllers/voteController');

router.get('/topics/:topicId/posts/:id/votes/upvote', voteController.upvote);
router.get('/topics/:topicId/posts/:id/votes/downvote', voteController.downvote);

module.exports = router;