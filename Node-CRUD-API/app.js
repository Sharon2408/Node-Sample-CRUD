require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const multer = require('multer');
const path = require('path');
const port = process.env.PORT;
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require("./routes/authRoutes");
const airoutes = require("./routes/airoutes");
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:4200','http://localhost:3000','https://xdv9fcrt-4200.inc1.devtunnels.ms'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true  
};

app.use('*',cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/auth',authRoutes);
app.use('/api/chat', airoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });