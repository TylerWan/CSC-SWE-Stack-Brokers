const si = require('stock-info');
const db = require('./database');

const DBName = 'stackbrokersdb';
const stocktableName = 'growthtable';

const model1 = {
    name: "PureSentiment",
    sentiment: 1,
    shortterm: 0,
    longterm: 0
};
const model2 = {
    name: "PureHistory",
    sentiment: 0,
    shortterm: 0.5,
    longterm: 0.5,
};
const model3 = {
    name: "Hybrid",
    sentiment: 0.3,
    shortterm: 0.4,
    longterm: 0.3,
};
const models = [model1, model2, model3];
exports.updateGrowths = function(){

    console.log("Updating stock projections...")
    //Check for table
    db.c.query("SELECT 1 FROM "+stocktableName+" LIMIT 1;", function (error, result, field) {
        if(result===undefined){
            createTable();
        }
            db.c.query("SELECT ticker FROM stocktable", function (error, result, field) {
                //Cycle through tickers
                for(let t in result){
                    db.c.query("SELECT ticker FROM "+stocktableName+" WHERE ticker = '"+result[t].ticker+"';", function (error, result1, field) {
                        //Check if ticker is in projection table
                        if(result1.length===0){
                            db.c.query("INSERT INTO "+stocktableName+" (ticker) VALUES ('"+result[t].ticker+"');")
                        }
                        //Update ticker projections


                        si.getSingleStockInfo(result[t].ticker).then(
                            stock => {
                                let shortTermGrowth = (stock.regularMarketDayHigh-stock.fiftyDayAverage)/stock.regularMarketPrice;
                                let longTermGrowth = stock.fiftyTwoWeekHighChangePercent;
                                let sentimentScore = 0;
                                let totalscore = 0;
                                let currentprice = stock.regularMarketPrice;
                                let avgreturn = 0.02;
                                //STAGE 2 - Gather stock articles

                                db.c.query("SELECT * FROM articletable WHERE ticker='"+result[t].ticker+"';", function (error, result2, field) {
                                    if (error) throw error;

                                    for (let a in result2) {
                                        totalscore += result2[a].sentiment;
                                    }
                                    if(totalscore>20)
                                        totalscore=20;
                                    if(totalscore<-20)
                                        totalscore=-20;
                                    sentimentScore = totalscore / 5;

                                    //Set model projections
                                    db.c.query("UPDATE "+stocktableName+" SET latestavgsentiment ="+sentimentScore+", currentprice = '"+currentprice+"', shorttermgrowth = '"+shortTermGrowth+"'," +
                                        " longtermgrowth= '"+longTermGrowth+"'WHERE ticker ='"+result[t].ticker+"';")
                                    for(let m in models){
                                        let modelscore = avgreturn;
                                        //Sentiment Factor
                                        modelscore+=(sentimentScore*0.01)*models[m].sentiment;
                                        //Short-term factor
                                        modelscore+=(shortTermGrowth-avgreturn)*models[m].shortterm;
                                        //Long-term factor
                                        modelscore+=(longTermGrowth-avgreturn)*models[m].longterm;
                                        db.c.query("UPDATE "+stocktableName+" SET "+models[m].name+" = "+modelscore+" WHERE ticker='"+result[t].ticker+"';")
                                    }





                                });
                            })
                            .catch(error => {
                                console.log(error)
                            });


                    });
                }



            });

        console.log("Stock projections updated.")
    });
}





function createTable(){
    console.log("Creating projection table...");
    db.c.query("USE " + DBName + ";");

    //Create Tables
    let stocktableFormat = '(ticker varchar(8) PRIMARY KEY, currentprice float, latestavgsentiment float, shorttermgrowth float, longtermgrowth float, FOREIGN KEY (ticker) REFERENCES stocktable (ticker));';
    db.c.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

    for(let m in models) {
        db.c.query("ALTER TABLE " + stocktableName + " ADD " + models[m].name + " float;");
    }


}
let bestworstcount = 20;
let gauge = 'Hybrid';
exports.getTop = function(res){

    db.c.query("SELECT * FROM "+stocktableName +" ORDER BY "+gauge+" DESC limit "+bestworstcount, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};
exports.getBottom = function(res){

    db.c.query("SELECT * FROM "+stocktableName +" ORDER BY "+gauge+" ASC limit "+bestworstcount, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};

exports.getstockgrowth = function(res, ticker){
    console.log(ticker+" spec")
    db.c.query("SELECT * FROM "+stocktableName +" WHERE ticker = '"+ticker+"'", function (error, result, field) {
        res.send(result);
    });
};

exports.getAllGrowths = function(res){
    db.c.query("SELECT * FROM "+stocktableName, function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });
};