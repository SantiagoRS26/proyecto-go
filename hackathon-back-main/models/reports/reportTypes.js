const mongoose = require("mongoose");
const moment = require('moment-timezone');


const reportTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: () => moment().tz('America/Bogota').toDate() },
  icons: {
    icon_normal: { type: String, required: false },
    icon_small: { type: String, required: false },
  },
});

const ReportType = mongoose.model("ReportType", reportTypeSchema);
module.exports = ReportType;
