// controllers/productController.js
const productModel = require('../models/productModel');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const totalProducts = await productModel.getAll();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.noOfRecords);
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await productModel.getProductsPaginated(limit, offset);
  
    res.json({
      products:products,
      currentPage: page,
      totalPages:totalPages,
      totalProducts:totalProducts
  });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  // console.log('Request Body:', req.body.name);
  const { name, description, price } = req.body;
  try {
    const productId = await productModel.create(name, description, price);
    res.status(201).json({ id: productId, name, description, price });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const updated = await productModel.update(req.params.id, name, description, price);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
