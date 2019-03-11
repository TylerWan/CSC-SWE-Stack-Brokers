const fs = require('fs');
const JSON5 = require('../dependency_modules/json5');
const mysql = require('../dependency_modules/mysql');
const info = require('../stockconfig/info.json');
const si = require('stock-info');
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const dbhost = configinfo.dbhost.toString(), dbuser=configinfo.dbuser.toString(), dbpass=configinfo.dbpass.toString(), dbport=configinfo.dbport.toString();

const con = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpass,
    port: dbport
});
function daycolumnname(){
    let date = new Date();
    let month = date.getMonth()+1;
    if(month<10)
        month = '0' + month;
    let day = date.getDate();
    if(day<10)
        day = '0' + day;
    return 'd' + date.getFullYear()+month+day;


};

const DBName = 'stackbrokersdb';
const stocktableName = 'stocktable';
exports.connecttoDB = function(){
    console.log("Connecting to database...");
    con.connect(function(err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }

        console.log('Connected to database.');
    updateDB();
    });

    //con.end();

};
function updateDB() {

    //Create DB / Use DB space
    con.query("CREATE DATABASE IF NOT EXISTS " + DBName + ";");
    con.query("USE " + DBName + ";");

    //Create Tables
    let stocktableFormat = ' (ticker varchar(8), fullName varchar(40), industry varchar(20), currentprice float, projected float);';
    con.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

        //Add current day column
        let dailycolumncheck = "SHOW COLUMNS from stocktable LIKE '"+daycolumnname()+"';";
        con.query(dailycolumncheck, function(error, result, field) {
            if(error) throw error;
            if(result.length==0){
                console.log("Today's column not found. Initializing...");
                con.query("ALTER TABLE "+stocktableName+" ADD "+daycolumnname()+" float");
                console.log(daycolumnname());
            }



            let stocksinConfig = info;
            let stocksinTable =[];


           con.query("SELECT DISTINCT ticker FROM "+stocktableName, function(error, result, field) {
               if (error) throw error;
               for (x = 0; x < result.length; x++) {
                   stocksinTable.push(result[x].ticker);
               }
               for (Category in stocksinConfig) {
                   for (x in stocksinConfig[Category]) {
                       if (stocksinTable.indexOf(stocksinConfig[Category][x]) === -1) {
                           console.log(stocksinConfig[Category][x] + " not found, creating entry...");
                           addStockToTable(stocksinConfig[Category][x], Category);
                       }
                           let stocks = stocksinConfig[Category];
                           si.getStocksInfo(stocks).then(
                               stocks =>{

                                   for(let c=0;c<stocks.length;c++) {
                                       con.query("UPDATE " + stocktableName + " SET currentprice = " + stocks[c].regularMarketPrice + ", projected = "+stocks[c].fiftyDayAverageChangePercent+" WHERE ticker = '" + stocks[c].symbol + "'");
                                       con.query("UPDATE " + stocktableName + " SET " + daycolumnname() + "= " + stocks[c].regularMarketPrice + " WHERE ticker = '" + stocks[c].symbol + "'");
                                   }
                               })
                               .catch(error => {console.log(error)});

                   }


               }
               console.log("Stocks Updated");
           });
    });

}

function addStockToTable(ticker, industryName){
    let stocks=[];
    stocks.push(ticker);
    si.getStocksInfo(stocks).then(
        stocks => {
            for (x in stocks) {
                con.query("INSERT INTO "+stocktableName+" (ticker, fullName, industry, currentprice, projected) VALUES ('"+stocks[x].symbol+"', \""+stocks[x].shortName+
                    "\", '"+industryName+"', "+stocks[x].regularMarketPrice+", "+stocks[x].fiftyDayAverageChangePercent+");");
            }
        })
        .catch(error => {console.log(error)});
}

exports.updateDB = function(){
    updateDB();
};
const bestworstcount = 15;
exports.showTop = function(res){
    con.query("SELECT * FROM "+stocktableName +" ORDER BY projected DESC limit "+bestworstcount, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};

exports.showBottom = function(res){
    con.query("SELECT * FROM "+stocktableName +" ORDER BY projected ASC limit "+bestworstcount, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};

exports.showCurrentStockTable = function(res){
    con.query("SELECT * FROM "+stocktableName, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};
exports.showIndustry = function(res, industry){
    con.query("SELECT * FROM "+stocktableName+" WHERE industry = '"+industry+"'", function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};
exports.showStock = function(ticker, res){
    con.query("SELECT * FROM "+stocktableName+" WHERE ticker = '"+ticker+"'", function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};

