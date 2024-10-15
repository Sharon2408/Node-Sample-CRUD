const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken.authenticateToken);

router.route("/")
.get(productController.getAllProducts)
.post(productController.createProduct);

router.route("/:id")
.get(productController.getProductById)
.put(productController.updateProduct)
.delete(productController.deleteProduct);


module.exports = router;
