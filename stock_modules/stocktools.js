const si = require('stock-info');

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

exports.parseDate = function(date){
    let day = date.getDate(),month = (date.getMonth()+1),year = date.getFullYear();
    if(month<10)
        month = '0'+month;
    if(day<10)
        day = '0'+day;

    let result = year.toString()+month.toString()+day.toString();
    return result;
};