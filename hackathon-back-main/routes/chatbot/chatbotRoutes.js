const express = require('express');
const router = express.Router();
const chatbotController = require('../../controllers/chatBot/chatBotController');

router.post('/api/chatbot-movilidad', chatbotController.handleChatbotRequest);
router.post('/api/chatbot-admin', chatbotController.AdminHelperBot);

module.exports = router;