const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require('../middlewares/authMiddleware');


router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.post('/refresh-token', authenticateToken.authenticateRefreshToken, authController.refreshToken);
router.post('/logout', authController.logoutUser);
router.get('/user-detail/:id', authenticateToken.authenticateToken, authController.userDetail);
router.put('/update-user-detail/:id', authenticateToken.authenticateToken, authController.updateUser);
router.post('/upload-profile/:id', authenticateToken.authenticateToken, authController.uploadProfileImage);
module.exports = router;