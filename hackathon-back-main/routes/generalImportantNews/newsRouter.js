const express = require('express');
const router = express.Router();
const newsController = require('../../controllers/generalImportantNews/newsController');

router.post('/api/seed-new', newsController.seedNew);


router.post('/api/news', newsController.createNews);
router.get('/api/news', newsController.getNews);
router.get('/api/news/:newsId', newsController.getNewsById);
router.delete('/api/news/:newsId', newsController.deleteNews);

module.exports = router;