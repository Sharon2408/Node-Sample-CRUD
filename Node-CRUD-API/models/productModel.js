// models/productModel.js
const pool = require('../config/db');

// Get all products
exports.getAll = async () => {
  const [rows] = await pool.query(`SELECT p.id, p.name, p.description, p.price, 
    GROUP_CONCAT(pi.image_path) AS images 
    FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id GROUP BY p.id`);
  return rows;
};

// Get product by ID
exports.getById = async (id) => {
  const [rows] = await pool.query(`SELECT p.id, p.name, p.description, p.price, 
    GROUP_CONCAT(pi.image_path) AS images 
    FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id 
    WHERE p.id = ?
    GROUP BY p.id`, [id]);
  return rows[0];
};

// Create a new product
// exports.create = async (name, description, price) => {
//   const [result] = await pool.query(
//     'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
//     [name, description, price]
//   );
//   return result.insertId;
// };





exports.create = async (name, description, price, imagePaths) => {
  const conn = await pool.getConnection();  // Get a connection from the pool
  try {
    // Start a transaction
    await conn.beginTransaction();

    // Insert the product details into the `products` table
    const [productResult] = await conn.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );

    const productId = productResult.insertId;  // Get the newly inserted product's ID
    console.log('Inserted Product ID:', productId);

    // Insert the image paths into the `product_images` table
    for (const imagePath of imagePaths) {
      console.log('Inserting Image Path:', imagePath);
      await conn.query(
        'INSERT INTO product_images (product_id, image_path) VALUES (?, ?)',
        [productId, imagePath]
      );
    }

    // Commit the transaction
    await conn.commit();
    return productId;  // Return the inserted product's ID

  } catch (error) {
    // If an error occurs, rollback the transaction
    await conn.rollback();
    console.error('Error in creating product:', error);
    throw error;
  } finally {
    // Release the connection back to the pool
    conn.release();
  }
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


exports.getProductsPaginated = async (limit, offset) => {
  // console.log(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`);

  const [products] = await pool.query('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset]);
  return products;
};


exports.getProductById = async (productId) => {
  try {
    const [product] = await pool.query(
      `SELECT p.id, p.name, p.description, p.price, 
        GROUP_CONCAT(pi.image_path) AS images 
        FROM products p 
        LEFT JOIN product_images pi ON p.id = pi.product_id 
        WHERE p.id = ?
        GROUP BY p.id`,
      [productId]
    );

    return product[0]; // Return the first result (should be a single product)
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
