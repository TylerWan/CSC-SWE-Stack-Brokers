const si = require('stock-info');
const db = require('./database');

const DBName = 'stackbrokersdb';
const stocktableName = 'growthtable';

const models = ["pureStockHistory", "pureSentiment"];
exports.updateGrowths = function(){

    console.log("Updating projections...");
    db.c.query("USE " + DBName + ";");

    //Create Tables
    db.c.query("DROP TABLE IF EXISTS "+stocktableName);
    let stocktableFormat = '(ticker varchar(8) PRIMARY KEY, currentprice float, latestavgsentiment float, FOREIGN KEY (ticker) REFERENCES stocktable (ticker));';
    db.c.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

    for(let m in models){
        db.c.query("ALTER TABLE "+stocktableName+" ADD "+models[m]+" float");
    }

};

function computeProjection(model, ticker) {
    let sentimentScore = 0;
    let shortTermGrowth = 0;
    let longTermGrowth = 0;

    //STAGE 1 - Gather stock history
    si.getSingleStockInfo(ticker).then(
        stock => {
            shortTermGrowth = stock.fiftyDayAverageChangePercent;
            longTermGrowth = stock.twoHundredDayAverageChangePercent;

            //STAGE 2 - Gather stock articles
            db.c.query("SELECT * FROM articletable WHERE ticker = '" + ticker + "'", function (error, result, field) {
                if (error) throw error;
                let totalscore = 0;
                for (let a in result) {
                    totalscore += result[a].sentiment;
                }
                sentimentScore = totalscore / 5;
                //STAGE 3 - Return model projection







            });
        })
        .catch(error => {
            console.log(error)
        });



}
