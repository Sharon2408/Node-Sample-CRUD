const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aichatbotController");
const authenticateToken = require('../middlewares/authMiddleware');
router.use(authenticateToken.authenticateToken);

router.route("/").post(aiController.aichat);
router.route("/:id").get(aiController.getChatHistory);

module.exports = router;