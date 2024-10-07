const pool = require('../config/db');


exports.createUser = async (name, email, password) => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  };

  exports.getUser = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  };

  exports.getUserDetail = async (id) => {
    const [rows] = await pool.query('SELECT id,name,email FROM users WHERE id = ?', [id]);
    return rows[0];
  };

  exports.update = async (id, name, email) => {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return result.affectedRows > 0;
  };