const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController.js');
const validation = require('./validation');

router.post('/topics/:topicId/posts/:id/comments/create', 
  validation.validateComments,
  commentController.create);

router.post('/topics/:topicId/posts/:id/comments/:commentId/destroy',
  commentController.destroy);

module.exports = router;