const pool = require('../config/db'); 


exports.saveMessage = async (userId, role, message) => {
  await pool.query(
    'INSERT INTO chat_history (user_id, role, message, timestamp) VALUES (?, ?, ?, NOW())',
    [userId, role, message]
  );
};


exports.getChatHistory = async (userId) => {
    try {
      const [rows] = await pool.query(
        'SELECT role, message FROM chat_history WHERE user_id = ? ORDER BY timestamp',
        [userId]
      );
      console.log('Raw rows:', rows); // Debugging log
      return rows; // Return all rows
    } catch (error) {
      console.error('Error querying chat history:', error);
      throw new Error('Database query failed');
    }
  };
  


