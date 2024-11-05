const InterestZone = require("../../models/interestZone/interestZone");

exports.createInterestZone = async (req, res) => {
    const { name, user, geometry } = req.body;
    try {
        const previousInterestZone = await InterestZone.findOne({ name, user });
        if(previousInterestZone) {
            return res.status(400).json({ error: "Interest zone already exists" });
        }
        const interestZone = new InterestZone({ name, user, geometry });
        await interestZone.save();
        res.status(201).json({ interestZone });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getInterestZonesByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const interestZones = await InterestZone.find({ user: userId });
        res.status(200).json({ interestZones });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.deleteInterestZone = async (req, res) => {
    const { interestZoneId } = req.params;
    try {
        await InterestZone.findByIdAndDelete(interestZoneId);
        res.status(200).json({ message: "Interest zone deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}