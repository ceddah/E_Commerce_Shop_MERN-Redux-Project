const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors');
//Routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);

app.use(errorMiddleware);

module.exports = app;