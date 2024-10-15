const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const UserModel = require("../models/userModel");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/profiles'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  });

const upload = multer({ storage: storage });




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

        const token = jwt.sign({ id: user.id,isAdmin:user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // res.cookie('_ttf', token, { httpOnly: true, secure: true });
        // res.cookie('_ttg', refreshToken, { httpOnly: true, secure: true });

        res.json({ _t: token, _rt: refreshToken });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}




exports.refreshToken = (req, res) => {

    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.json({ accessToken });
    });
};

exports.userDetail = async (req, res) => {

    try {

        const userId = await UserModel.getUserDetail(req.params.id);
        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userId)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const updated = await UserModel.update(req.params.id, name, email);
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User data updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
};





exports.uploadProfileImage = async (req, res) => {
    const userId = req.params.id; 
    upload.single('profileImage')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload failed', error: err });
      }
      try {
        const profileImagePath = `/uploads/profiles/${req.file.filename}`;
        const result = await UserModel.updateUserProfileImage(userId, profileImagePath);
        res.status(200).json({ 
          message: 'Profile image uploaded successfully', 
          profileImagePath 
        });

      } catch (dbErr) {
        return res.status(500).json({ 
          message: 'Error saving profile image to database', 
          error: dbErr 
        });
      }
    });
};