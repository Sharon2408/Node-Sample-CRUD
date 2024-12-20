const pool = require('../config/db');



exports.create = async (userId, productId, quantity) => {
    try {
        const [existingItem] = await pool.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );
        if (existingItem.length > 0) {
            return await pool.query(
                "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
                [quantity, userId, productId]
            );
        } else {
            return await pool.query(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                [userId, productId, quantity]
            );
        }
    } catch (error) {
        console.error("Error in create function:", error);
        throw error;
    }
};



exports.getCart = async (user_id) => {

    try {
        const [response] = await pool.query(
            `SELECT cart.id, cart.quantity, products.name, products.price
             FROM cart
             JOIN products ON cart.product_id = products.id
             WHERE cart.user_id = ?`,
            [user_id]
        );
        
        return response;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}


exports.removeFromCart = async (userId, productId)=> {
    return pool.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [userId, productId]);
  }