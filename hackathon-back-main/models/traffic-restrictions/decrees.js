const mongoose = require('mongoose');
const moment = require('moment-timezone');
const decreeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
});

const decree = mongoose.model('Decree', decreeSchema);
module.exports = decree;