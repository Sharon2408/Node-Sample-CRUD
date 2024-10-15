require("dotenv").config();
const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');
const port = process.env.PORT;
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
const authRoutes = require("./routes/authRoutes");
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:4200','https://xdv9fcrt-4200.inc1.devtunnels.ms'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true  
};

app.use('*',cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);
app.use('/auth',authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });