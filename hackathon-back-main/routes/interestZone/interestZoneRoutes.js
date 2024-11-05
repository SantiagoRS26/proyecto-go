const express = require('express');
const router = express.Router();
const interestZoneController = require('../../controllers/interestZone/interestZoneController');

router.post('/api/interest-zones', interestZoneController.createInterestZone);
router.get('/api/interest-zones/:userId', interestZoneController.getInterestZonesByUser);
router.delete('/api/interest-zones/:interestZoneId', interestZoneController.deleteInterestZone);

module.exports = router;