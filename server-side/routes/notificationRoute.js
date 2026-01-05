const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController.js');
const { authenticate } = require('../middleware/auth.js')

router.get('/notification/admin', authenticate, notificationController.getAdminNotifications);
router.get('/notification/rider', authenticate, notificationController.getRiderNotifications);
router.put('/notification/:notification_id/read', authenticate, notificationController.markAsRead);

module.exports = router;