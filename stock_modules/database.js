const fs = require('fs');
const JSON5 = require('../dependency_modules/json5');
const mysql = require('../dependency_modules/mysql');
const info = require('../stockconfig/info.json');
const tools = require('./stocktools');
const si = require('stock-info');
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const dbhost = configinfo.dbhost.toString(), dbuser=configinfo.dbuser.toString(), dbpass=configinfo.dbpass.toString(), dbport=configinfo.dbport.toString();

const con = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpass,
    port: dbport
});

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
function updateDB(){

    //Create DB / Use DB space
    con.query("CREATE DATABASE IF NOT EXISTS "+DBName+";");
    con.query("USE "+DBName+";");

    //Create Tables
    let stocktableFormat = ' (ticker varchar(8), fullName varchar(40), industry varchar(20), currentprice float, projected float);';
    con.query("CREATE TABLE IF NOT EXISTS "+stocktableName+" "+stocktableFormat+";");

    //Add current day column
    let dailycolumncheck = "SHOW COLUMNS from `stocktable` LIKE 'ticker';";
    con.query(dailycolumncheck, function(error, result, field) {
        if(error) throw error;
        if(result.toString().length===0){
            console.log("Today's column not found. Initializing...");
            con.query("ALTER TABLE "+stocktableName+" ADD "+tools.daycolumnname()+" float");
        }
        console.log("Updating today's stock prices...");
        let stocksinConfig = info.TechStocks;
        let stocksinTable =[];
        con.query("SELECT DISTINCT ticker FROM "+stocktableName, function(error, result, field) {
            if (error) throw error;
            for(x=0;x<result.length;x++)
            {
                stocksinTable.push(result[x].ticker);
            }
            for(x in stocksinConfig){
                if(stocksinTable.indexOf(stocksinConfig[x])==-1){
                    console.log(stocksinConfig[x]+" not found, creating entry...");
                    addStockToTable(stocksinConfig[x], 'TECH');
                }


            }

/*
            si.getStocksInfo(stocks).then(
                stocks =>{
                    for(x in stocks)

                        con.query("UPDATE "+stocktableName+" SET "+tools.daycolumnname()+"= "+stocks[x].regularMarketPrice+" WHERE 'ticker' = "+stocks[x].symbol);
                        console.log(stocks[x].shortName);
                })
                .catch(error => {console.log(error)});*/

        });

    });
}

function addStockToTable(ticker, industryName){
    let stocks=[];
    stocks.push(ticker);
    si.getStocksInfo(stocks).then(
        stocks => {
            for (x in stocks) {
                con.query("INSERT INTO "+stocktableName+" (ticker, fullName, industry, currentprice, projected) VALUES ('"+stocks[x].symbol+"', '"+stocks[x].shortName+
                    "', '"+industryName+"', "+stocks[x].regularMarketPrice+", 1);");
            }
        })
        .catch(error => {console.log(error)});
}

exports.updateDB = function(){
    updateDB();
};

exports.showTop = function(res){
    con.query("SELECT * FROM "+stocktableName +" ORDER BY currentprice DESC limit 5", function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};

exports.showBottom = function(res){
    con.query("SELECT * FROM "+stocktableName +" ORDER BY currentprice ASC limit 5", function(error, result, field) {
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

