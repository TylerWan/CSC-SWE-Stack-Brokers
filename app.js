const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const JSON5 = require('./dependency_modules/json5');
const user = require('./stock_modules/users');
const indexRouter = require('./routes/index');
const stockRouter = require('./routes/stocks');
const articleRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const schedule = require('node-schedule');
const history = require('./stock_modules/stockhistory');
const db = require('./stock_modules/database');


const app = express();
app.use(express.static('pages'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/stocks', stockRouter);
app.use('/api/articles', articleRouter);
app.use('/api/users', usersRouter);
module.exports = app;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/register', function(request, response){
    let code = Math.floor(Math.random()*89999+10000);
        user.addUser(request.body.name.toString(), request.body.phone.toString(), code, request, response);

});

app.post('/buy', function(request, response){
    user.submitBuySell(request.body.phone.toString(), request.body.passcode.toString(), request.body.ticker.toString(), true, response);
});
app.post('/sell', function(request, response){
    console.log(request.body)
    user.submitBuySell(request.body.phone.toString(), request.body.passcode.toString(), request.body.ticker.toString(), false, response);
});

//Update projections, etc.
schedule.scheduleJob('*/15 3-22 * * *', function(){
    console.log("Running Updates...");
    db.updateDB();
});

//Update History
schedule.scheduleJob('30 2 * * *', function(){
    console.log("Updating stock histories...");
    history.updateStockHistory();
});