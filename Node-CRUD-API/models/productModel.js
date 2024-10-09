// models/productModel.js
const pool = require('../config/db');

// Get all products
exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
};

// Get product by ID
exports.getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ? ', [id]);
  return rows[0];
};

// Create a new product
exports.create = async (name, description, price) => {
  const [result] = await pool.query(
    'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
    [name, description, price]
  );
  return result.insertId;
};

// Update a product
exports.update = async (id, name, description, price) => {
  const [result] = await pool.query(
    'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
    [name, description, price, id]
  );
  return result.affectedRows > 0;
};

// Delete a product
exports.delete = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
