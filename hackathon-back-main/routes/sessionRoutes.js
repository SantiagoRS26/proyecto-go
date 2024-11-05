const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/api/sign-up', sessionController.signup);
router.post('/api/sign-in', sessionController.signin);
router.post('/api/update-telephone', sessionController.updateTelephone)
router.post('/api/seed/super-admins', sessionController.seedSuperAdmins);
router.put('/api/update-user', sessionController.updateUser);
router.patch('/api/update-notify-traffic-decree', sessionController.seedNotifyTrafficDecrees);
module.exports = router;
