const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");



router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logoutUser);


module.exports = router;