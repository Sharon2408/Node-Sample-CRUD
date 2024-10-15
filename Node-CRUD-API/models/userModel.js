const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

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
    const [rows] = await pool.query('SELECT id,name,email,profile_image,isAdmin FROM users WHERE id = ?', [id]);
    return rows[0];
  };

  exports.update = async (id, name, email) => {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return result.affectedRows > 0;
  };

  exports.updateUserProfileImage = async (userId, newProfileImagePath) => {
    try {
      const [rows] = await pool.query('SELECT profile_image FROM users WHERE id = ?', [userId]);
      const oldProfileImagePath = rows[0]?.profile_image;
  
      if (oldProfileImagePath) {
        const oldImageFullPath = path.join(__dirname, '../uploads/profiles', path.basename(oldProfileImagePath));
  
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlink(oldImageFullPath, (err) => {
            if (err) {
             // console.error('Error deleting old profile image:', err);
            } else {
             // console.log('Old profile image deleted successfully:', oldProfileImagePath);
            }
          });
        } else {
         // console.log('Old profile image file does not exist:', oldProfileImagePath);
        }
      }
  
      const [result] = await pool.query(
        'UPDATE users SET profile_image = ? WHERE id = ?',
        [newProfileImagePath, userId]
      );
  
      return result;
  
    } catch (error) {
    //  console.error('Error updating user profile image:', error);
      throw error;
    }
  };