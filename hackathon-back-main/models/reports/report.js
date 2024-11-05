const mongoose = require('mongoose');
const moment = require('moment-timezone');


const reportSchema = new mongoose.Schema({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ReportType', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
    coordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false } 
});


const Report = mongoose.model('Report', reportSchema);
module.exports = Report;