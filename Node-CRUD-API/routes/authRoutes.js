const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require('../middlewares/authMiddleware');


router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.post('/refresh-token', authenticateToken, authController.refreshToken);
router.post('/logout', authController.logoutUser);
router.get('/user-detail/:id', authenticateToken, authController.userDetail);
router.put('/update-user-detail/:id', authenticateToken, authController.updateUser);
module.exports = router;