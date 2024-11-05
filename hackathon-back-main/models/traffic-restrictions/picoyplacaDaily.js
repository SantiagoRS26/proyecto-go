const mongoose = require('mongoose');
const moment = require('moment-timezone');
const picoPlacaDailySchema = new mongoose.Schema({
    decree: { type: mongoose.Schema.Types.ObjectId, ref: 'Decree', required: true },
    vehicleType: { type: String, required: true, enum:["publicVehicle","privateVehicle","heavyVehicle","motorcycle"] },
    restrictions: {
        days: [{
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
            plates: [String], // 0,1,2,3,4,5,6,7,8,9
            hours: [[[String]]],//[[hora_inicio, hora_fin]]
        }],
        exemption: { type: Boolean, default: false },
        additionalInfo: { type: String }, // Información adicional para vehículos de carga y taxis
    },
    createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
});

const PicoPlacaDailySchema = mongoose.model('PicoPlacaDaily', picoPlacaDailySchema);
module.exports = PicoPlacaDailySchema;
