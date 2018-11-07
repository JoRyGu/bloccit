const express = require('express');
const router = express.Router();

const flairController = require('../controllers/flairController');

router.get('/topics/:topicId/posts/:id/flairs/new', flairController.new);
router.post('/topics/:topicId/posts/:id/flairs/create', flairController.create);
router.get('/topics/:topicId/posts/:id/flairs/:flairId', flairController.show);
router.post('/topics/:topicId/posts/:id/flairs/:flairId/destroy', flairController.destroy);
router.get('/topics/:topicId/posts/:id/flairs/:flairId/edit', flairController.edit);
router.post('/topics/:topicId/posts/:id/flairs/:flairId/update', flairController.update);

module.exports = router;