const mongoose = require("mongoose");

const interestZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  geometry: {
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
});

interestZoneSchema.index({ geometry: "2dsphere" });

const InterestZone = mongoose.model("InterestZone", interestZoneSchema);
module.exports = InterestZone;