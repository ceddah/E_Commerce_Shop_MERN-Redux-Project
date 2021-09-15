const express = require('express');
const cors = require('cors');
const app = express();
const errorMiddleware = require('./middlewares/errors');
//Routes
const products = require('./routes/product');
const auth = require('./routes/auth');

app.use(express.json());
app.use(cors());

app.use('/api/v1', products);
app.use('/api/v1', auth);

app.use(errorMiddleware);

module.exports = app;