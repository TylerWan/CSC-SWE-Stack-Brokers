const Gnews = require('node-gnews').Gnews;
const instance = new Gnews();
const db = require('./database');

const DBName = 'stackbrokersdb';
const stocktableName = 'articletable';
const info = require('../stockconfig/info.json');
const Sentiment = require('sentiment');


exports.updateArticles = function(){
    let time = new Date();
    time = time.getFullYear().toString + time.getMonth()<10 ? '0'+time.getMonth().toString : time.getMonth().toString + time.getDate()<10 ? '0'+time.getDate().toString : time.getDate().toString;
    console.log("Updating articles...");
    //Create DB / Use DB space
    db.q("CREATE DATABASE IF NOT EXISTS " + DBName + ";");
    db.q("USE " + DBName + ";");

    //Create Tables
    db.q("DROP TABLE IF EXISTS "+stocktableName);
    let stocktableFormat = ' (id int AUTO_INCREMENT, ticker varchar(8) NOT NULL, date varchar(25), title varchar(150), url varchar(170), sentiment float,  PRIMARY KEY (id));';
    db.q("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

    //Add current day column
    let stocksinConfig = info;
    for (let Category in stocksinConfig) {
        for (let x in stocksinConfig[Category]) {
            console.log("Fetching articles for "+stocksinConfig[Category][x]);
            instance.search(stocksinConfig[Category][x]).then(articles => {
                for (let x = 0; x < 5; x++) {
                    let d = new Date(articles[x].pubDate);
                    console.log(articles[x].title + " : " + d.toDateString() + " by " + articles[x].publisher);
                    db.q("INSERT INTO "+stocktableName+" (ticker, date, title, url, sentiment) VALUES ('"+stocksinConfig[Category][x]+"', \""+'today'+
                        "\", '"+articles[x].title.replace("'", " ")+"', \""+articles[x].link+"\", "+1+");");
                }
            });
        }

        }

};
