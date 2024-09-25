const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Mark a notification as read
router.put('/:id/read', notificationController.markNotificationAsRead);

module.exports = router;
