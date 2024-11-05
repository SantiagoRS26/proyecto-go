const express = require('express');
const router = express.Router();
const trafficRestrictionsController = require('../../controllers/traffic-restrictions/trafficRestrictionsController');
router.post('/api/seed-decree', trafficRestrictionsController.seedDecree);
router.post('/api/seed-geofences', trafficRestrictionsController.seedPicoyPlacaGeofences);
router.post('/api/seed-special-days', trafficRestrictionsController.seedPicoyPlacaSpecialDays);
router.post('/api/seed-daily', trafficRestrictionsController.seedPicoyPlacaDaily);



router.get('/api/pico-y-placa/:vehicleType', trafficRestrictionsController.getDailiesByVehicleType);
router.get('/api/pico-y-placa', trafficRestrictionsController.getAllPicoyPlacaDailyByLastDecree);
router.get('/api/special-days', trafficRestrictionsController.getSpecialDays);
router.get('/api/special-days/:vehicleType', trafficRestrictionsController.getSpecialDaysByVehicleType);
router.post('/api/special-days', trafficRestrictionsController.AddSpecialDay);
router.delete('/api/special-days/:specialDayId', trafficRestrictionsController.deleteSpecialDay);
router.get('/api/pico-y-placa-geofences', trafficRestrictionsController.getGeofencesByLastDecree);
router.get('/api/pico-y-placa-geofences/:vehicleType', trafficRestrictionsController.getGeofencesByVehicleType);
router.post('/api/traffic-restrictions', trafficRestrictionsController.AddTrafficRestriction);

module.exports = router;