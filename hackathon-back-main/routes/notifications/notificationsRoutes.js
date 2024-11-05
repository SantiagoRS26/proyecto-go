const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications/notificationsController');

router.post('/api/sendMail', notificationsController.sendMail);
router.post('/api/notifyAllWithTrafficRestrictionActive', notificationsController.notifyAllWithTrafficRestrictionActive);

router.get('/api/notificationPermissions/:userId', notificationsController.getNotifyPermissions);
router.put('/api/notificationPermissions/:userId', notificationsController.modifyNotifyPermissions);
module.exports = router;