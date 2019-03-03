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

exports.showstocks = function(res){
    database.showCurrentStockTable(res);
};

exports.showtop = function(res){
    database.showTop(res);
};

exports.showbottom=function(res){
  database.showBottom(res);
};
exports.daycolumnname= function(){
    let date = new Date();
    let month = date.getMonth()+1;
    if(month<10)
        month = '0' + month;
    let day = date.getDate();
    if(day<10)
        day = '0' + day;
    return 'd' + date.getFullYear()+month+day;


};
