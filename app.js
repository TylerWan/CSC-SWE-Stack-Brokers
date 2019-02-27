const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const stockRouter = require('./routes/stocks');
const articleRouter = require('./routes/articles');
const app = express();
const stockdatabase = require('./stock_modules/stockdb');

stockdatabase.connectdb();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/stocks', stockRouter);
app.use('/api/articles', articleRouter);

module.exports = app;
