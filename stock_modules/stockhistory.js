const fs = require('fs');
const stockdata = require('stock-data.js');
const db = require('./database');
const JSON5 = require('../dependency_modules/json5');
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const DBName = 'stackbrokersdb';
const stocktableName = 'historytable';
const mykey = configinfo.historykey.toString();

exports.updateStockHistory = function(){
    console.log("Updating stock history...")
    let time = new Date();
    const today = time.getFullYear().toString() +'-'+ (time.getMonth()+1<10 ? '0'+(time.getMonth()+1).toString() : (time.getMonth()+1).toString())+'-' + (time.getDate()+1<10 ? '0'+(time.getDate()+1).toString() : (time.getDate()+1).toString());

    //Check for table
    db.c.query("SELECT 1 FROM "+stocktableName+" LIMIT 1;", function (error, result, field) {
        if(result===undefined){
            createTable();
        }else{
            //Check for last day's column
            db.c.query("SHOW COLUMNS FROM "+stocktableName+" LIKE '"+today+"';", function (error, result, field) {
                if(result===undefined){
                    console.log("Today's column not found...")
                }else{
                    db.c.query("SELECT ticker FROM stocktable", function (error, result, field) {
                        for(let t in result){
                            let ticker = result[t].ticker;
                            //Search for ticker row in history table
                            db.c.query("SELECT * FROM "+stocktableName+" WHERE ticker = '"+ticker+"'", function (error, result, field) {
                                if(result.length===0){
                                    console.log(ticker+" not found in history table, adding...");
                                    stockdata.historical({
                                        symbol: ticker,
                                        API_TOKEN: mykey,
                                        options: {
                                            date_from: '2019-01-01',
                                            date_to: today
                                        }
                                    })
                                        .then(response => {
                                            db.c.query("INSERT INTO "+stocktableName+" (ticker) VALUES ('"+ticker+"')");
                                            for(let date in response.history){
                                                db.c.query("UPDATE "+stocktableName+" SET d"+date.toString().replace(/[\-]/g,'')+" = "+response.history[date].close+" WHERE ticker = '"+ticker+"';")
                                            }

                                        })
                                        .catch(error => {
                                            throw error;
                                        });
                                }else{
                                    console.log(ticker+" found in history table")
                                }

                            });


                        }

                    });
                }
            });
        }
    });

};
function createTable(){
    let time = new Date();
    const today = time.getFullYear().toString() +'-'+ (time.getMonth()+1<10 ? '0'+(time.getMonth()+1).toString() : (time.getMonth()+1).toString())+'-' + (time.getDate()+1<10 ? '0'+(time.getDate()+1).toString() : (time.getDate()+1).toString());
    console.log("Initializing Stock History...");
    db.c.query("USE " + DBName + ";");

    //Create Tables
    db.c.query("DROP TABLE IF EXISTS "+stocktableName);
    let stocktableFormat = '(ticker varchar(8) PRIMARY KEY, FOREIGN KEY (ticker) REFERENCES stocktable (ticker));';
    db.c.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");
    //Add day columns
    stockdata.historical({
        symbol: 'AMZN',
        API_TOKEN: mykey,
        options: {
            date_from: '2019-01-01',
            date_to: today
        }
    })
        .then(response => {

            for(let date in response.history){
                db.c.query("ALTER TABLE "+stocktableName+" ADD d"+date.toString().replace(/[\-]/g,'')+" float");
            }

            db.c.query("SELECT ticker FROM stocktable", function (error, result, field) {
                for(let t in result){
                    let ticker = result[t].ticker;
                    stockdata.historical({
                        symbol: ticker,
                        API_TOKEN: mykey,
                        options: {
                            date_from: '2019-01-01',
                            date_to: today
                        }
                    })
                        .then(response => {
                            db.c.query("INSERT INTO "+stocktableName+" (ticker) VALUES ('"+ticker+"')");
                            for(let date in response.history){
                                db.c.query("UPDATE "+stocktableName+" SET d"+date.toString().replace(/[\-]/g,'')+" = "+response.history[date].close+" WHERE ticker = '"+ticker+"';")
                            }

                        })
                        .catch(error => {
                            throw error;
                        });

                }

            });
        console.log("History retrieved.")
        })
        .catch(error => {
            throw error;
        });



}


exports.getStockHistory = function(res, ticker){
    db.c.query("SELECT * FROM historytable")
};

