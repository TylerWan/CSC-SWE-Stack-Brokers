const fs = require('fs');
const JSON5 = require('../dependency_modules/json5');
const mysql = require('../dependency_modules/mysql');
const info = require('../stockconfig/info.json');
const si = require('stock-info');
const articles = require('./articles');
const projection = require('./projections');
const history = require('./stockhistory');
const users = require('./users');
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
        con.query('DROP DATABASE IF EXISTS '+DBName);
        updateDB();
    });

    //con.end();

};

function updateDB() {
    //con.query("DROP DATABASE IF EXISTS stackbrokersdb;")
    console.log("Updating databases, this may take a few minutes...")
    //Create DB / Use DB space
    con.query("CREATE DATABASE IF NOT EXISTS " + DBName + ";");
    con.query("USE " + DBName + ";");

    //Create Tables
    let stocktableFormat = ' (ticker varchar(8) NOT NULL PRIMARY KEY, fullName varchar(40), industry varchar(20));';
    con.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");




    let stocksinConfig = info;
    let stocksinTable =[];

        con.query("SELECT DISTINCT ticker FROM "+stocktableName, function(error, result, field) {
            if (error) throw error;
            for (let x = 0; x < result.length; x++) {
                stocksinTable.push(result[x].ticker);
            }
            for (let Category in stocksinConfig) {
                for (let x in stocksinConfig[Category]) {
                    if (stocksinTable.indexOf(stocksinConfig[Category][x]) === -1) {
                        console.log(stocksinConfig[Category][x] + " not found, creating entry...");
                        addStockToTable(stocksinConfig[Category][x], Category);
                    }


                }


            }
            console.log("Stocks Updated");
            console.log("Updating articles...")
            history.updateStockHistory();
            setTimeout(updateart, 15000);
            setTimeout(updateart, 30000);
            setTimeout(updateg, 60000);
            users.updateUsers();
        });


}

function updateart(){
    articles.updateArticles()
}
function updateg(){
    projection.updateGrowths();
}
function addStockToTable(ticker, industryName){
    let stocks=[];
    stocks.push(ticker);
    si.getStocksInfo(stocks).then(
        stocks => {
            for (x in stocks) {
                con.query("INSERT INTO "+stocktableName+" (ticker, fullName, industry) VALUES ('"+stocks[x].symbol+"', \""+stocks[x].shortName+
                    "\", '"+industryName+"');");
            }
        })
        .catch(error => {console.log(error)});
}

exports.updateDB = function(){
    updateDB();
};
exports.c = con;






exports.showStock = function(ticker, res){
    con.query("SELECT * FROM "+stocktableName+" WHERE ticker = '"+ticker+"'", function(error, result, field) {
        if (error)
            throw error;
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
