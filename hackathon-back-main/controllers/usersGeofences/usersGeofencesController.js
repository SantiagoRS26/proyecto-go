const UsersGeofence = require("../../models/usersGeofences/usersGeofence");

exports.createUsersGeofence = async (req, res) => {    
    const { userId, name, coordinates } = req.body;
    try {
        const usersGeofence = new UsersGeofence({
        user: userId,
        name,
        type: "Polygon",
        coordinates
        });
        await usersGeofence.save();
        res.status(201).json({ usersGeofence });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getAllUserGeofencesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const usersGeofences = await UsersGeofence.find({ user: userId });
        res.status(200).json({ usersGeofences });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getUserGeofenceById = async (req, res) => {
    const { id } = req.params;
    try {
        const usersGeofence = await UsersGeofence.findById(id);
        if (!usersGeofence) {
            return res.status(404).json({ error: "No se encontró la geocerca" });
        }
        res.status(200).json({ usersGeofence });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.deleteUsersGeofence = async (req, res) => {
    const { id } = req.body;
    try {
        const usersGeofence = await UsersGeofence.findById(id);
        if (!usersGeofence) {
            return res.status(404).json({ error: "No se encontró la geocerca" });
        }
        await usersGeofence.remove();
        res.status(200).json({ usersGeofence });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.createBaseGeofence = async (req, res) => {
    const { userId } = req.body; // Get userId from the request body
    const baseGeofenceData = {
        user: userId, // Use the userId from the request body
        name: "Base Geofence Villavicencio",
        type: "Polygon",
        coordinates: [
            [-73.600557,4.116250],
            [-73.600268,4.119633],
            [-73.596551,4.121541],
            [-73.592690,4.119705],
            [-73.593411,4.115602],
            [-73.600557,4.116250]
        ]
    };

    try {
        const baseGeofence = new UsersGeofence(baseGeofenceData);
        await baseGeofence.save();
        res.status(201).json({ baseGeofence });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}