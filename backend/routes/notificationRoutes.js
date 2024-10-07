const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Mark a notification as read
router.get('/user/:id', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markNotificationAsRead);
router.put('/mark-all-read/:userId', notificationController.markAllAsRead);

module.exports = router;
