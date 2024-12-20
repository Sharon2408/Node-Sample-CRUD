const cartModel = require('../models/cartModel');


exports.addToCart = async (req, res) => {
        const { user_id, product_id, quantity } = req.body;
        try {
          await cartModel.create(user_id, product_id, quantity);
          res.status(200).json({ message: "Product added to cart" });
        } catch (error) {
          res.status(500).json({ error: "Error adding product to cart" });
        }

}


exports.getCart = async (req,res)=>{
    
    const { user_id } = req.query;
    try {
      const cartItems = await cartModel.getCart(user_id);
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving cart" });
    }
}

exports.removeFromCart = async (req, res) => {
    
    const { user_id, product_id } = req.query;
    try {
      await cartModel.removeFromCart(user_id, product_id);
      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      res.status(500).json({ error: "Error removing product from cart" });
    }
  }