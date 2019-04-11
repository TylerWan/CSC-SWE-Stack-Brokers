const Gnews = require('node-gnews').Gnews;
const instance = new Gnews();
const db = require('./database');
const projection = require('./projections');
const history = require('./stockhistory');

const DBName = 'stackbrokersdb';
const stocktableName = 'articletable';
const info = require('../stockconfig/info.json');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const publisherBlacklist = ["MONReport"];
const options = {
    extras: {
        'down': -1,
        'up': 1,
        'dives': -2
    }
};


exports.updateArticles = function(){
    let time = new Date();
    time = time.getFullYear().toString + time.getMonth()<10 ? '0'+time.getMonth().toString : time.getMonth().toString + time.getDate()<10 ? '0'+time.getDate().toString : time.getDate().toString;

    //Create DB / Use DB space
    db.c.query("USE " + DBName + ";");

    //Create Tables
    db.c.query("DROP TABLE IF EXISTS "+stocktableName);
    let stocktableFormat = '(id int AUTO_INCREMENT, ticker varchar(8), date varchar(25), title varchar(250), url varchar(250), sentiment float,  PRIMARY KEY (id), FOREIGN KEY (ticker) REFERENCES stocktable (ticker));';
    db.c.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

    //Add current day column
    let stocksinConfig = info;
    for (let Category in stocksinConfig) {
        for (let x in stocksinConfig[Category]) {

            db.c.query("SELECT fullName FROM stocktable WHERE ticker = '"+stocksinConfig[Category][x]+"'", function (err, result, fields) {
                if (err) throw err;
                instance.search(result[0].fullName).then(articles => {
                    let maxcount = 5;
                    for (let a = 0; a < maxcount; a++) {
                        if(publisherBlacklist.includes(articles[a].publisher)){
                            maxcount=6;
                        }else{
                            let artdate = new Date(articles[a].pubDate);
                            time = artdate.getFullYear().toString() + (artdate.getMonth()<10 ? '0'+artdate.getMonth().toString() : artdate.getMonth().toString()) + (artdate.getDate()<10 ? '0'+artdate.getDate().toString() : artdate.getDate().toString());
                            db.c.query('INSERT INTO '+stocktableName+' (ticker, date, title, url, sentiment) VALUES (\"'+stocksinConfig[Category][x]+'\", \"'+time+
                                '\", \"'+articles[a].title+'\", \"'+articles[a].link+'\", '+sentiment.analyze(articles[a].title, options).score+');');

                        }

                    }
                });
            });
        }

    }
    console.log("Articles updated.");

    //history.updateStockHistory();
    setTimeout(updateg, 5000);

};

function updateg(){
    projection.updateGrowths();
}
exports.getAllArticles = function(res){
    db.c.query("SELECT * FROM "+stocktableName +" ORDER BY date", function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });

};
exports.getStockArticles = function(res, ticker){
    db.c.query("SELECT * FROM "+stocktableName +" WHERE ticker = '"+ticker+"'", function(error, result, field) {
        if (error) throw error;
        res.send(result);

    });

};
