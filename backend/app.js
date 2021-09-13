const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

//Routes
const products = require('./routes/product');

app.use('/api/v1', products);

module.exports = app;