const si = require('stock-info');
const database = require('./database');



exports.showraw = function(res, stockid) {
    let stocks = [stockid];
    si.getStocksInfo(stocks).then(
        stocks =>{
            res.send(stocks);
            for(x in stocks)
                console.log(stocks[x].shortName);
        })
        .catch(error => {res.send("Stock not found")});

};

exports.showstock = function(ticker, res){
    database.showStock(ticker, res);
};

exports.showstocks = function(res){
    database.showCurrentStockTable(res);
};

exports.showstock = function(ticker, res){
    database.showStock(ticker, res);
};
exports.showtop = function(res){
    database.showTop(res);
};
exports.showindustry = function(industry, res){
    database.showIndustry(res,industry);
};
exports.showbottom=function(res){
    database.showBottom(res);
};
