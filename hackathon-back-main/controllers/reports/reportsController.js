const User = require("../../models/user");
const Report = require("../../models/reports/report");
const ReportType = require("../../models/reports/reportTypes");
const InterestZone = require("../../models/interestZone/interestZone");
const { sendEmailBack } = require("../notifications/notificationsController");
const { sendEmailToOneDest } = require("../../commons/email/emailSender");
const { generateEmailContent } = require("../../commons/email/emailTemplate");
const moment = require('moment-timezone');

exports.createReport = async (req, res) => {
  const { userId, type, longitude, latitude } = req.body;
  try {
    const reportType = await ReportType.findOne({ type });
    if (!reportType) {
      return res.status(400).json({ error: "Invalid report type" });
    }
    const report = new Report({
      type: reportType._id,
      createdBy: userId,
      coordinates: { longitude, latitude },
    });

    //Buscar sobre que zonas de interés se encuentra el reporte
    const interestZones = await InterestZone.find({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    }).populate("user");
    await report.save();
    interestZones.forEach(async (zone) => {
      if (zone?.user?.notifyReportsOnInterestZones && zone?.user?._id != userId) {
        const { subject, textContent, htmlContent } = generateEmailContent(
          zone,
          reportType,
          longitude,
          latitude
        );
        await sendEmailToOneDest(zone.user.email, subject, textContent, htmlContent);
      }
    });
    res.status(201).json({ report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (pageNumber - 1) * pageSize;

    const startOfDay = moment().tz('America/Bogota').toDate();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = moment().tz('America/Bogota').toDate();
    endOfDay.setHours(23, 59, 59, 999);

    const totalRecords = await Report.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const reports = await Report.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("type")
      .populate("createdBy")
      .sort({ createdAt: -1, likes: -1, isVerified: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      items: reports,
      totalRecords: totalRecords,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReportsByType = async (req, res) => {
  const { idType } = req.params;
  try {
    const reports = await Report.find({ type: idType })
      .populate("type")
      .populate("createdBy");

    res.status(200).json({ reports });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllReportTypes = async (req, res) => {
  try {
    const reportTypes = await ReportType.find();
    res.status(200).json({ reportTypes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateReportLikes = async (req, res) => {
  const { reportId, action, userId } = req.body;
  try {
    const report = await Report.findById(reportId);
    const user = await User.findById(userId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (action === "increment") {
      report.likedBy.push(userId);
    } else if (action === "decrement") {
      report.likedBy = report.likedBy.filter((id) => id.toString() !== userId);
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await report.save();
    res.status(200).json({ report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateVerifyReport = async (req, res) => {
  const { reportId, isVerified } = req.body;
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.isVerified = isVerified;

    await report.save();
    res.status(200).json({ report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.seedReports = async (req, res) => {
  try {
    await Report.insertMany([
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7b", // "Vehículo averiado"
        coordinates: {
          longitude: -73.6319,
          latitude: 4.1498,
        },
      },
      // Entry 12
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7d", // "Manifestación o protesta"
        coordinates: {
          longitude: -73.6367,
          latitude: 4.1395,
        },
      },
      // Entry 13
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7c", // "Obras en la vía"
        coordinates: {
          longitude: -73.6302,
          latitude: 4.1461,
        },
      },
      // Entry 14
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7f", // "Vehículo mal estacionado"
        coordinates: {
          longitude: -73.6349,
          latitude: 4.1412,
        },
      },
      // Entry 15
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f80", // "Inundación"
        coordinates: {
          longitude: -73.6285,
          latitude: 4.1483,
        },
      },
      // Entry 16
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7e", // "Congestión vehicular"
        coordinates: {
          longitude: -73.6323,
          latitude: 4.1364,
        },
      },
      // Entry 17
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f75", // "Accidente de tránsito"
        coordinates: {
          longitude: -73.6268,
          latitude: 4.1439,
        },
      },
      // Entry 18
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f76", // "Derrumbe o deslizamiento"
        coordinates: {
          longitude: -73.6316,
          latitude: 4.1506,
        },
      },
      // Entry 19
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f77", // "Cierre vial programado"
        coordinates: {
          longitude: -73.6259,
          latitude: 4.1371,
        },
      },
      // Entry 20
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f78", // "Animal en la vía"
        coordinates: {
          longitude: -73.6306,
          latitude: 4.1448,
        },
      },
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7e", // "Congestión vehicular"
        coordinates: {
          longitude: -73.63,
          latitude: 4.147,
        },
      },
      // Entry 2
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7c", // "Obras en la vía"
        coordinates: {
          longitude: -73.6315,
          latitude: 4.1495,
        },
      },
      // Entry 3
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7f", // "Vehículo mal estacionado"
        coordinates: {
          longitude: -73.6344,
          latitude: 4.1409,
        },
      },
      // Entry 4
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f80", // "Inundación"
        coordinates: {
          longitude: -73.6272,
          latitude: 4.1457,
        },
      },
      // Entry 5
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f75", // "Accidente de tránsito"
        coordinates: {
          longitude: -73.6326,
          latitude: 4.1385,
        },
      },
      // Entry 6
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f76", // "Derrumbe o deslizamiento"
        coordinates: {
          longitude: -73.6268,
          latitude: 4.1478,
        },
      },
      // Entry 7
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f77", // "Cierre vial programado"
        coordinates: {
          longitude: -73.6312,
          latitude: 4.1412,
        },
      },
      // Entry 8
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f78", // "Animal en la vía"
        coordinates: {
          longitude: -73.6359,
          latitude: 4.1443,
        },
      },
      // Entry 9
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f79", // "Semáforo dañado o apagado"
        coordinates: {
          longitude: -73.6295,
          latitude: 4.149,
        },
      },
      // Entry 10
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7a", // "Control policial o militar"
        coordinates: {
          longitude: -73.6333,
          latitude: 4.1368,
        },
      },
      // Entry 11
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7b", // "Vehículo averiado"
        coordinates: {
          longitude: -73.627,
          latitude: 4.1435,
        },
      },
      // Entry 12
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7d", // "Manifestación o protesta"
        coordinates: {
          longitude: -73.6317,
          latitude: 4.1501,
        },
      },
      // Entry 13
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7e", // "Congestión vehicular"
        coordinates: {
          longitude: -73.6355,
          latitude: 4.1376,
        },
      },
      // Entry 14
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7c", // "Obras en la vía"
        coordinates: {
          longitude: -73.6291,
          latitude: 4.1469,
        },
      },
      // Entry 15
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7f", // "Vehículo mal estacionado"
        coordinates: {
          longitude: -73.6348,
          latitude: 4.1394,
        },
      },
      // Entry 16
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f80", // "Inundación"
        coordinates: {
          longitude: -73.6284,
          latitude: 4.1461,
        },
      },
      // Entry 17
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f75", // "Accidente de tránsito"
        coordinates: {
          longitude: -73.6322,
          latitude: 4.1388,
        },
      },
      // Entry 18
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f76", // "Derrumbe o deslizamiento"
        coordinates: {
          longitude: -73.6266,
          latitude: 4.145,
        },
      },
      // Entry 19
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f77", // "Cierre vial programado"
        coordinates: {
          longitude: -73.6314,
          latitude: 4.1415,
        },
      },
      // Entry 20
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f78", // "Animal en la vía"
        coordinates: {
          longitude: -73.6361,
          latitude: 4.1446,
        },
      },
      // Entry 21
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f79", // "Semáforo dañado o apagado"
        coordinates: {
          longitude: -73.6297,
          latitude: 4.1485,
        },
      },
      // Entry 22
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7a", // "Control policial o militar"
        coordinates: {
          longitude: -73.6335,
          latitude: 4.1362,
        },
      },
      // Entry 23
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7b", // "Vehículo averiado"
        coordinates: {
          longitude: -73.6273,
          latitude: 4.1438,
        },
      },
      // Entry 24
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7d", // "Manifestación o protesta"
        coordinates: {
          longitude: -73.632,
          latitude: 4.1504,
        },
      },
      // Entry 25
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7e", // "Congestión vehicular"
        coordinates: {
          longitude: -73.6358,
          latitude: 4.1379,
        },
      },
      // Entry 26
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7c", // "Obras en la vía"
        coordinates: {
          longitude: -73.6294,
          latitude: 4.1472,
        },
      },
      // Entry 27
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f7f", // "Vehículo mal estacionado"
        coordinates: {
          longitude: -73.6341,
          latitude: 4.1397,
        },
      },
      // Entry 28
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f80", // "Inundación"
        coordinates: {
          longitude: -73.6287,
          latitude: 4.1454,
        },
      },
      // Entry 29
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f75", // "Accidente de tránsito"
        coordinates: {
          longitude: -73.6325,
          latitude: 4.1381,
        },
      },
      // Entry 30
      {
        createdBy: "670ef0a28e75a612a52cae95",
        type: "670c118a937774438d8e0f76", // "Derrumbe o deslizamiento"
        coordinates: {
          longitude: -73.6269,
          latitude: 4.1453,
        },
      },
    ]);
    res.status(201).json({ message: "Reports seeded successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.seedReportTypes = async (req, res) => {
  try {
    await ReportType.deleteMany({});
    await Report.deleteMany({});
    await ReportType.insertMany([
      {
        type: "Accidente de tránsito",
        description:
          "Colisión entre vehículos o vehículos y peatones, causando interrupción del tráfico.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/car_crash-0DljA0kGd4sx7WcSSWouHTQunuRDH5.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/car_crash-xAZ6xHyumjAdUavU06rxleNpB8JXS3.png",
        },
      },
      {
        type: "Derrumbe o deslizamiento",
        description:
          "Caída de tierra, rocas o escombros que bloquean parcial o totalmente la carretera.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/landslide-6azHR9BATP93xfsbnFg4t57YaNxNop.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/landslide-4XtJRSzeZkRbY6EQ7FpQcYEJoplewp.png",
        },
      },
      {
        type: "Cierre vial programado",
        description:
          "Cierre temporal de vías por eventos planificados como desfiles o carreras.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/road_work-nQTtfwbBx8BTeCLvesDMJI22avwmgK.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/road_work-Ilth3P5gcyClGSH59pR986uilh5BeS.png",
        },
      },
      {
        type: "Animal en la vía",
        description:
          "Presencia de animales en la vía que afecta la circulación vehicular.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/animal_crossing_road-zGEQ8Zjo41Dv6sVku7DZeVfO8sLJFc.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/animal_crossing_road-FzDUeJOliJEqEOYPLDw3l6606mkuET.png",
        },
      },
      {
        type: "Semáforo dañado o apagado",
        description:
          "Problemas con la señalización de semáforos que dificultan la regulación del tránsito.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/traffic_light-26gPeYmNKKTBeaiTvms3OJaw9lCmjP.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/traffic_light-i47MBfMfcUuIzGTg2lCUpS43GmcPKq.png",
        },
      },
      {
        type: "Control policial o militar",
        description:
          "Retenes o controles en la vía que ralentizan la circulación de vehículos.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/police_checkpoint-GvYC3MRvUsFPBGIAgEgjiObYBAKpmE.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/police_checkpoint-lHzbe7t61Fx9gAILcDwyoZFGeihFKg.png",
        },
      },
      {
        type: "Vehículo averiado",
        description:
          "Vehículo detenido por fallas mecánicas que obstaculiza el flujo vehicular.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/broken_down_car-EpT2Dr6iZjukZUObUEDlxcxQemVS5j.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/broken_down_car-oAlZbVPZtBwSFMfMWV1zTayKIP6cZ9.png",
        },
      },
      {
        type: "Obras en la vía",
        description:
          "Trabajos de construcción, reparación o mantenimiento de carreteras que afectan la movilidad.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/road_work-nQTtfwbBx8BTeCLvesDMJI22avwmgK.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/road_work-Ilth3P5gcyClGSH59pR986uilh5BeS.png",
        },
      },
      {
        type: "Manifestación o protesta",
        description:
          "Agrupaciones de personas bloqueando o ralentizando el tráfico en la vía pública.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/protest-41vpUUMo0DAKQePBPpFcmnoDZZ6GMO.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/protest-tl3pKJclnKIg6eesQsGHKKiz34nouL.png",
        },
      },
      {
        type: "Congestión vehicular",
        description: "Tráfico pesado sin una causa aparente específica.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/traffic_jam-QC6CSAEgfVEdEu4Y9gCbRFUUUdlHj1.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/traffic_jam-RlHnYzlxvgaqiKt7FayUHS4qHlEfAI.png",
        },
      },
      {
        type: "Vehículo mal estacionado",
        description:
          "Vehículo estacionado en lugares inapropiados que bloquea parcial o totalmente la vía.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/illegal_parking-zelox3Hmlz40n5hqgYNbUquxtIWehz.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/illegal_parking-bZQva0RCVtGf8eVdEtdAvRC5cuBLos.png",
        },
      },
      {
        type: "Inundación",
        description:
          "Zonas anegadas por lluvias intensas, dificultando o impidiendo el tránsito vehicular.",
        icons: {
          icon_normal:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icons/flood_road-7a9zAkubzo8e5W8wru1U1m2QqeoJ4A.png",
          icon_small:
            "https://nnh1j9jnucf99zxs.public.blob.vercel-storage.com/icon_small/flood_road-iCdJxJjZHcGQG84wLt5j329nEuaIFK.png",
        },
      },
    ]);
    res.status(201).json({ message: "Report types seeded successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
