const mongoose = require('mongoose');
const moment = require('moment-timezone');
const picoyPlacaSpecialDaySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    vehicleType : { type: String, required: true, enum:["publicVehicle","privateVehicle","heavyVehicle","motorcycle"] },
    createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
});

const PicoyPlacaSpecialDaySchema = mongoose.model('PicoyPlacaSpecialDay', picoyPlacaSpecialDaySchema);
module.exports = PicoyPlacaSpecialDaySchema;
