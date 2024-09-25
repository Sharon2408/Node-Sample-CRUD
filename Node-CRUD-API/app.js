const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
const productRoutes = require('./routes/product');


app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });