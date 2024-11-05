const PicoyPlacaGeofences = require("../../models/traffic-restrictions/picoyPlacaGeofence");
const Decree = require("../../models/traffic-restrictions/decrees");
const PicoyPlacaSpecialDays = require("../../models/traffic-restrictions/PicoyPlacaSpecialDay");
const PicoyPlacaDaily = require("../../models/traffic-restrictions/picoyplacaDaily");
const notifyController = require('../notifications/notificationsController');
const {vehicleTypes} = require('../../commons/dicts/vehicleType');
const { generateEmailUpdatePicoyPlacaContent,generateEmailContentNewSpecialDay } = require("../../commons/email/emailTemplate");

exports.seedDecree = async (req, res) => {
    try {
      const decree = new Decree({
        name: "Decreto 123",
      });
      await decree.save();
      res.status(201).json({ decree });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  exports.seedPicoyPlacaGeofences = async (req, res) => {
    try {
      const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
      const picoyPlacaGeofences = [
        {
          name: "Restricción 1",
          type: "Polygon",
          vehicleType: "publicVehicle",
          decree: lastDecree._id,
          coordinates: [
            [-73.6298623488236, 4.158279124760568],
            [-73.63117492651331, 4.156553199236299],
            [-73.63136231773841, 4.155955840909272],
            [-73.63088912201619, 4.155485465765935],
            [-73.62978508584963, 4.1545533584670835],
            [-73.62861635016445, 4.153408459605743],
            [-73.62850845810064, 4.152268164806372],
            [-73.62868290933721, 4.14886579485686],
            [-73.62891409119649, 4.14799859271082],
            [-73.63398181119472, 4.144531349773658],
            [-73.63418249698974, 4.143955569302406],
            [-73.61681801563255, 4.121246143444694],
            [-73.60660127717072, 4.113208998108433],
            [-73.60653700083671, 4.113673701846693],
            [-73.61653285500064, 4.121379277824445],
            [-73.62394724258723, 4.131010898169706],
            [-73.63397287490679, 4.144113834616462],
            [-73.6285941419021, 4.147858566382752],
            [-73.62823452956471, 4.152976005329691],
            [-73.6285552834623, 4.153817718788687],
            [-73.63106040618476, 4.155981579441558],
            [-73.63102118885404, 4.156380561145966],
            [-73.62962302661565, 4.158178390420616],
            [-73.6298623488236, 4.158279124760568],
          ],
        },
        {
          name: "Restricción 2",
          type: "Polygon",
          vehicleType: "publicVehicle",
          decree: lastDecree._id,
          coordinates: [
            [-73.600557, 4.11625],
            [-73.600268, 4.119633],
            [-73.596551, 4.121541],
            [-73.59269, 4.119705],
            [-73.593411, 4.115602],
            [-73.600557, 4.11625],
          ],
        },
      ];
      await PicoyPlacaGeofences.insertMany(picoyPlacaGeofences);
      res.status(201).json({ picoyPlacaGeofences });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  exports.seedPicoyPlacaSpecialDays = async (req, res) => {
      try {
          const specialDays = [
              { date: new Date('2024-01-01'), reason: 'Año Nuevo', vehicleType: 'publicVehicle' },
              { date: new Date('2024-03-25'), reason: 'Día de San José',vehicleType: 'publicVehicle' },
              { date: new Date('2024-04-18'), reason: 'Jueves Santo',vehicleType: 'publicVehicle' },
              { date: new Date('2024-04-19'), reason: 'Viernes Santo',vehicleType: 'publicVehicle' },
              { date: new Date('2024-05-01'), reason: 'Día del Trabajo',vehicleType: 'publicVehicle' },
              { date: new Date('2024-06-24'), reason: 'Día de San Pedro y San Pablo',vehicleType: 'publicVehicle' },
              { date: new Date('2024-07-20'), reason: 'Día de la Independencia',vehicleType: 'publicVehicle' },
              { date: new Date('2024-08-07'), reason: 'Batalla de Boyacá',vehicleType: 'publicVehicle' },
              { date: new Date('2024-08-19'), reason: 'Asunción de la Virgen',vehicleType: 'publicVehicle' },
              { date: new Date('2024-10-14'), reason: 'Día de la Raza',vehicleType: 'publicVehicle' },
              { date: new Date('2024-11-04'), reason: 'Día de Todos los Santos',vehicleType: 'publicVehicle' },
              { date: new Date('2024-11-11'), reason: 'Independencia de Cartagena',vehicleType: 'publicVehicle' },
              { date: new Date('2024-12-08'), reason: 'Día de la Inmaculada Concepción',vehicleType: 'publicVehicle' },
              { date: new Date('2024-12-25'), reason: 'Navidad',vehicleType: 'publicVehicle' },
          ];
          await PicoyPlacaSpecialDays.insertMany(specialDays);
          res.status(201).json({ message: 'Dias festivos / especiales insertados' });
      } catch (error) {
          res.status(400).json({ error: err.message });
      }
  }
  exports.seedPicoyPlacaDaily = async (req, res) => {
      try {
          const decree = await Decree.findOne().sort({ createdAt: -1 });
          const particularPicoPlaca = new PicoyPlacaDaily({
              decree: decree._id,
              vehicleType: 'privateVehicle',
              restrictions: {
                  days: [
                      { day: 'Monday', plates: ['9', '0'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] },
                      { day: 'Tuesday', plates: ['1', '2'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] },
                      { day: 'Wednesday', plates: ['3', '4'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] },
                      { day: 'Thursday', plates: ['5', '6'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] },
                      { day: 'Friday', plates: ['7', '8'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] }
                  ],
                  exemption: false,
              },
          });
          const taxiPicoPlaca = new PicoyPlacaDaily({
              decree: decree._id,
              vehicleType: 'publicVehicle',
              restrictions: {
                  days: [
                      { day: 'Monday', plates: ['9'], hours: [['6:00am', '12:00am']] },
                      { day: 'Tuesday', plates: ['0'], hours: [['6:00am', '12:00am']] },
                      { day: 'Wednesday', plates: ['1'], hours: [['6:00am', '12:00am']] },
                      { day: 'Thursday', plates: ['2'], hours: [['6:00am', '12:00am']] },
                      { day: 'Friday', plates: ['3'], hours: [['6:00am', '12:00am']] },
                      { day: 'Saturday', plates: ['4'], hours: [['6:00am', '12:00am']] },
                      { day: 'Sunday', plates: ['5'], hours: [['6:00am', '12:00am']] }
                  ],
                  exemption: false,
                  additionalInfo: 'Solo pueden circular con letrero de “Fuera de servicio” durante el mantenimiento.'
              },
          });
          const camionPicoPlaca = new PicoyPlacaDaily({
              decree: decree._id,
              vehicleType: 'heavyVehicle',
              restrictions: {
                  days: [
                      { day: 'Monday', plates: ['9', '0'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] },
                      { day: 'Tuesday', plates: ['1', '2'], hours: [['6:30am', '8:30am'], ['5:00pm', '7:30pm']] }
                  ],
                  exemption: false,
                  additionalInfo: 'Restricción adicional en la vía a Bogotá y salida hacia Acacías durante las horas pico.'
              },
          });
          
          const motoPicoPlaca = new PicoyPlacaDaily({
              decree: decree._id,
              vehicleType: 'motorcycle',
              restrictions: {
                  days: [],
                  exemption: true // Las motos están exentas de la medida de pico y placa
              },
          });
          
          await motoPicoPlaca.save();
          await camionPicoPlaca.save();
          await taxiPicoPlaca.save();
          await particularPicoPlaca.save();
          return res.status(201).json({ message: 'Restricciones diarias de pico y placa insertadas' });
      } catch (err) {
          res.status(400).json({ error: err.message });
      }
  }
exports.getDailiesByVehicleType = async (req, res) => {
    const { vehicleType } = req.params;
    try {
        const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
        const picoyPlacaDaily = await PicoyPlacaDaily.find({
        vehicleType,
        decree: lastDecree._id,
        });
        res.status(200).json({ picoyPlacaDaily });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getAllPicoyPlacaDailyByLastDecree = async (req, res) => {
    try {
        const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
        const picoyPlacaDaily = await PicoyPlacaDaily.find({ decree: lastDecree._id });
        res.status(200).json({ picoyPlacaDaily });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getSpecialDays = async (req, res) => {
    try {
        const specialDays = await PicoyPlacaSpecialDays.find();
        res.status(200).json({ specialDays });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getSpecialDaysByVehicleType = async (req, res) => {
    const { vehicleType } = req.params;
    try {
        const specialDays = await PicoyPlacaSpecialDays.find({ vehicleType });
        res.status(200).json({ specialDays });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.AddSpecialDay = async (req, res) => {
    try {
        const { date, reason, vehicleType } = req.body;
        const specialDay = new PicoyPlacaSpecialDays({
            date,
            reason,
            vehicleType,
        });
        await specialDay.save();
        await notifyController.notifyAllWithTrafficRestrictionActiveService(generateEmailContentNewSpecialDay(reason, date, vehicleTypes.findType(vehicleType)));
        res.status(201).json({ specialDay });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.AddSpecialDayWithOutResponse = async (req) => {
    try {
        const { date, reason, vehicleType } = req.body;
        const specialDay = new PicoyPlacaSpecialDays({
            date,
            reason,
            vehicleType,
        });
        await specialDay.save();
        await notifyController.notifyAllWithTrafficRestrictionActiveService(generateEmailContentNewSpecialDay(reason, date, vehicleTypes.findType(vehicleType)));
        return true;
    } catch (err) {
        return false;
    }
}
exports.deleteSpecialDay = async (req, res) => {
    const { specialDayId } = req.params;
    try {
        await PicoyPlacaSpecialDays.findByIdAndDelete(specialDayId);
        res.status(200).json({ message: 'Día especial eliminado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getGeofencesByLastDecree = async (req, res) => {
    try {
        const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
        const picoyPlacaGeofences = await PicoyPlacaGeofences.find({ decree: lastDecree._id });
        res.status(200).json({ picoyPlacaGeofences });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getGeofencesByVehicleType = async (req, res) => {
    const { vehicleType } = req.params;
    try {
        const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
        const picoyPlacaGeofences = await PicoyPlacaGeofences.find({ decree: lastDecree._id, vehicleType });
        res.status(200).json({ picoyPlacaGeofences });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.AddTrafficRestriction = async (req, res) => {
    try {
        const { decreeName, daily, geofences } = req.body;

        // Crear y guardar el nuevo decreto
        const decree = new Decree({
            name: decreeName,
        });
        await decree.save();

        // Crear y guardar las restricciones diarias (Pico y Placa) para cada tipo de vehículo
        const dailyRestrictions = daily.map((restriction) => {
            return new PicoyPlacaDaily({
                decree: decree._id,
                vehicleType: restriction.vehicleType,
                restrictions: restriction.restrictions,
            });
        });
        await PicoyPlacaDaily.insertMany(dailyRestrictions);

        // Crear y guardar las restricciones de geocercas
        const geofenceRestrictions = geofences.map((geofence) => {
          return new PicoyPlacaGeofences({
            name: geofence.name,
            type: "Polygon",
            vehicleType: geofence.vehicleType,
            decree: decree._id,
            coordinates: geofence.coordinates,
          });
        });
        await PicoyPlacaGeofences.insertMany(geofenceRestrictions);
        const dynamicUrl =
          `${process.env.FRONTEND_URL}/restrictions`;

        await notifyController.notifyAllWithTrafficRestrictionActiveService(generateEmailUpdatePicoyPlacaContent(dynamicUrl));

        res.status(201).json({
          message: "Restricciones de tráfico agregadas exitosamente",
          decree,
          dailyRestrictions,
          geofenceRestrictions,
        });
    } catch (err) {
        // Manejo de errores
        res.status(400).json({ error: err.message });
    }
};
