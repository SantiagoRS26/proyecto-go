const mongoose = require('mongoose');

const usersGeofenceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["Polygon"] },
    coordinates: {
        type: [[Number]],
        required: true,
        validate: {
            validator: function(arr) {
                return arr.every(coord => coord.length === 2);
            },
            message: 'Each coordinate must be an array of two numbers (longitude and latitude).'
        }
    }
});

const UsersGeofence = mongoose.model('UsersGeofence', usersGeofenceSchema);
module.exports = UsersGeofence;
