const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favoriteController');

router.post('/topics/:topicId/posts/:id/favorites/create', favoriteController.create);
router.post('/topics/:topicId/posts/:id/favorites/:favoriteId/destroy', favoriteController.destroy);

module.exports = router;