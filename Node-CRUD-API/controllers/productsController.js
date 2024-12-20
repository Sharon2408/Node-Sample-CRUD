// controllers/productController.js
const productModel = require('../models/productModel');
const multer = require('multer');
const path = require('path');


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const totalProducts = await productModel.getAll();
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.noOfRecords) || 12;
    //const offset = (page - 1) * limit;
    // const totalPages = Math.ceil(totalProducts / limit);
    // const products = await productModel.getProductsPaginated(limit, offset);
  
    res.json({
      // products:products,
      // currentPage: page,
      // totalPages:totalPages,
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

// // Create a new product
// exports.createProduct = async (req, res) => {

//   // console.log('Request Body:', req.body.name);
//   const { name, description, price } = req.body;
//   try {
//     const productId = await productModel.create(name, description, price);
//     res.status(201).json({ id: productId, name, description, price });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the destination folder exists
    cb(null, './uploads/products'); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Create a unique filename for each uploaded file
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with storage settings and file size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set file size limit (5MB)
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true); // Accept file
    }
    cb(new Error('Only images are allowed!')); // Reject file
  }
}).array('images', 5); // Allow up to 5 images

// Create product controller
exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
   

   if (err instanceof multer.MulterError) {
      // Handle Multer errors
      return res.status(500).json({ message: err.message });
    } else if (err) {
      // Handle general errors
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, description, price } = req.body;

      // Check for missing fields
      if (!name || !description || !price || !req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'All fields are required, including images.' });
      }

      // Map file names to image paths
      const imagePaths = req.files.map((file) => `/uploads/products/${file.filename}`); // Use file.filename for unique names

      // Call the model function to insert the product and images into the database
      const productId = await productModel.create(name, description, price, imagePaths);

      return res.status(201).json({
        message: 'Product created successfully',
        productId: productId,
      });

    } catch (dbErr) {
      console.error('Error creating product:', dbErr);
      return res.status(500).json({ message: 'Database error', error: dbErr });
    }
  });
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




