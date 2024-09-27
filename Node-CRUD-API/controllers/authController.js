const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel");


exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    try {
        const userId = await UserModel.createUser(name, email, hashedPassword);
        res.status(201).json({ id: userId, name, email, hashedPassword })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.loginUser = async (req, res) => {


    const { email, password } = req.body;

    try {
        const user = await UserModel.getUser(email)
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // res.cookie('_ttf', token, { httpOnly: true, secure: true });
        // res.cookie('_ttg', refreshToken, { httpOnly: true, secure: true });
        
        res.json({ _t:token,_rt:refreshToken });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

} 


exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
  
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      res.json({ accessToken });
    });
  };    


  exports.logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  };