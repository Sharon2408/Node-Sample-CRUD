const express = require("express");
const app = express();
const router = express.Router();
app.use(express.json()); 
const productController = require("../controllers/products")

router.route("/")
.get(productController.getAllProducts)
.post(productController.createProduct);

router.route("/:id")
.get(productController.getProductById)
.put(productController.updateProduct)
.delete(productController.deleteProduct);



module.exports = router;