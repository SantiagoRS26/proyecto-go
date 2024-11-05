const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reports/reportsController');

router.post('/api/reports', reportsController.createReport);
router.get('/api/reports', reportsController.getAllReports);
router.get('/api/reports/type/:idType', reportsController.getReportsByType);
router.post('/api/reports/seed', reportsController.seedReports);
router.post('/api/report-types/seed', reportsController.seedReportTypes);
router.get('/api/report-types', reportsController.getAllReportTypes);
router.put('/api/reaction-report', reportsController.updateReportLikes)
router.put('/api/verify-report', reportsController.updateVerifyReport)
module.exports = router;

