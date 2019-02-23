const fs = require('fs');
const JSON5 = require('json5');
const mysql = require('mysql');
//Read config file
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const dbhost = configinfo.dbhost.toString(), dbuser=configinfo.dbuser.toString(), dbpass=configinfo.dbpass.toString(), dbport=configinfo.dbport.toString();

const connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpass,
    port: dbport
});

//Connect to local database, initialize databases
exports.connectdb = function(){
    connection.connect(function(err) {
        if (err) {
            console.error('X Database connection failed: ' + err.stack);
            return;
        }else
        console.log('✓ Connected to MySQL.');

    });

    connection.query("CREATE DATABASE IF NOT EXISTS StackBrokersDB;", function (err, result){
       if (err) throw err;
       else
            console.log("✓ Database");
    });
    connection.query("USE StackBrokersDB;");
    connection.query("CREATE TABLE IF NOT EXISTS StockTable(ticker VARCHAR(10) PRIMARY KEY, name VARCHAR(24), industry VARCHAR(16), stockcurrent FLOAT, projected FLOAT);", function (err, result){
        if (err) throw err;
        else
            console.log("✓ Stock Table");
    });
    connection.query("CREATE TABLE IF NOT EXISTS ArticleTable(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ticker VARCHAR(10), time INT, title VARCHAR(100), URL VARCHAR(200), sentiment FLOAT, FOREIGN KEY (ticker) REFERENCES StockTable(ticker));", function (err, result){
        if (err) throw err;
        else
            console.log("✓ Article Table");
    });
    //connection.end();
};



