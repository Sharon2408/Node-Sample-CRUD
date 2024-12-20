const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken.authenticateToken);


router.route("/").post(cartController.addToCart).get(cartController.getCart).delete(cartController.removeFromCart);




module.exports = router;