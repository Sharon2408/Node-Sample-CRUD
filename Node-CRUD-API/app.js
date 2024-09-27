require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
app.use(express.json());
const productRoutes = require('./routes/productRoutes');
const authRoutes = require("./routes/authRoutes");


app.use('/api/products', productRoutes);
app.use('/auth',authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });