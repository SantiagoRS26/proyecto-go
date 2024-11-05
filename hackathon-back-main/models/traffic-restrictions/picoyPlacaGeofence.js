const mongoose = require('mongoose');
const moment = require('moment-timezone');
const picoyPlacaGeofenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["Polygon"] },
    vehicleType: { type: String, required: true, enum:["publicVehicle","privateVehicle","heavyVehicle","motorcycle"] },
    createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
    modifiedAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
    decree: { type: mongoose.Schema.Types.ObjectId, ref: 'Decree', required: true },
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
const PicoyPlacaGeofenceSchema = mongoose.model('PicoyPlacaGeofence', picoyPlacaGeofenceSchema);
module.exports = PicoyPlacaGeofenceSchema;