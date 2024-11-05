const express = require('express');
const router = express.Router();
const usersGeofencesController = require('../../controllers/usersGeofences/usersGeofencesController');

router.post('/api/users-geofences', usersGeofencesController.createUsersGeofence);
router.get('/api/users-geofences/:userId', usersGeofencesController.getAllUserGeofencesByUserId);
router.delete('/api/users-geofences', usersGeofencesController.deleteUsersGeofence);
router.get('/api/users-geofences/:id', usersGeofencesController.getUserGeofenceById);
router.post('/api/base-geofence', usersGeofencesController.createBaseGeofence);
module.exports = router;