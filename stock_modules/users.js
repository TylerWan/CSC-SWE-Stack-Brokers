const db = require('./database');
const fs = require('fs');
const path = require('path');
const JSON5 = require('../dependency_modules/json5');
const DBName = 'stackbrokersdb';
const stocktableName = 'userstable';
const configinfo = JSON5.parse(fs.readFileSync('./stockconfig/config', 'utf8'));
const twiliokey = configinfo.twiliokey.toString();
const twiliosid = configinfo.twiliosid.toString();
const client = require('twilio')(twiliosid, twiliokey);
const http = require('http');

exports.updateUsers = function() {
    db.c.query("SELECT 1 FROM " + stocktableName + " LIMIT 1;", function (error, result, field) {
        if (result === undefined) {
            createTable();
        } else {

        }
    });
};

function createTable(){
    console.log("Initializing Users...");
    db.c.query("USE " + DBName + ";");

    //Create Tables
    db.c.query("DROP TABLE IF EXISTS "+stocktableName);
    let stocktableFormat = '(id int PRIMARY KEY AUTO_INCREMENT, phone varchar(10) NOT NULL UNIQUE, name varchar(20), wallet float, stocks varchar(100), passcode int);';
    db.c.query("CREATE TABLE IF NOT EXISTS " + stocktableName + " " + stocktableFormat + ";");

}

exports.addUser = function(name, phone, passcode, request, response){
    db.c.query("SELECT * FROM userstable WHERE phone = \""+phone+"\"", function (error, result, field) {
        console.log(result)
        if(result.length===0){
            db.c.query("INSERT INTO "+stocktableName+"(phone, name, wallet, passcode) VALUES ("+phone+", \""+name+"\", 2000, "+passcode+")");
            client.messages
                .create({
                    body: 'Welcome to Stack Brokers, '+request.body.name.toString()+'! Your code is '+passcode,
                    from: '+18508054889',
                    to: '+1'+request.body.phone.toString()
                })
                .then(message => console.log(message.sid))
                .done();
            response.writeHead(302, {
                'Location': '/fantasy/?success=true'
            });
            response.end();
        }else{
            response.writeHead(302, {
                'Location': '/'
            });
            response.end();
        }
    });

};

exports.verify = function(phone, passcode){
    db.c.query("SELECT * FROM " + stocktableName + " WHERE phone = \""+phone+"\" AND passcode = \""+passcode+"\";", function (error, result, field) {

        return (result!==undefined);
    });
};
const bestworstcount = 20;
exports.getTopUsers = function(res){
    db.c.query("SELECT * FROM "+stocktableName +" ORDER BY wallet DESC limit "+bestworstcount, function(error, result, field) {
        if (error) throw error;
        let userlist = [];
        for(let user in result){
            userlist.push({"id":result[user].id, "name": result[user].name, "wallet": result[user].wallet})
        }
        res.send(userlist);
    });
};

exports.getUserPageInfo = function(res, id){
    db.c.query("SELECT * FROM "+stocktableName+" WHERE id=\""+id+"\"", function(error, result, field) {
        if (error) throw error;
        let userstocks = {};
        let ussql = result[0].stocks;
        let thisstock = '';
        let stcount = 0;
        let isrstock = true;
        let nstockentry={};
        for(let c in ussql) {
            if (parseInt(c) === ussql.length - 1) {
                nstockentry = {};
                if (stcount !== 0) {
                    stcount = parseInt(stcount) * 10 + parseInt(ussql[c]);
                    userstocks[thisstock.toString()] = stcount;
                } else {
                    userstocks[thisstock.toString()] = parseInt(ussql[c]);
                }
                stcount = 0;
                isrstock = true;
                break;
            }
            if (isrstock) {
                if (ussql[c].match(/[A-Z]/i)) {
                    thisstock += ussql[c]
                } else {
                    isrstock = false;
                    stcount = ussql[c];
                }
            } else {
                if (ussql[c].match(/[A-Z]/i)) {
                    nstockentry = {};
                    userstocks[thisstock.toString()] = parseInt(stcount);
                    thisstock = '';
                    thisstock += ussql[c];
                    stcount = 0;
                    isrstock = true;
                } else {
                    stcount *= 10 + parseInt(ussql[c]);
                }
            }
        }
        console.log(userstocks);
        let myuser = {"id":result[0].id, "name": result[0].name, "wallet": result[0].wallet, "stocks": userstocks};
        res.send(myuser);
    });
};

exports.submitBuySell = function(phone, passcode, ticker, isBuying, response){
    //console.log(ticker)
    db.c.query("SELECT * FROM " + stocktableName + " WHERE phone = \""+phone+"\" AND passcode = \""+passcode+"\";", function (error, result, field) {
        if(result.length!==0){
            let userstocks = [];
            let ussql = result[0].stocks;
            let thisstock = '';
            let stcount = 0;
            let isrstock = true;
            let nstockentry={};
            for(let c in ussql){
                if(parseInt(c)===ussql.length-1){
                    nstockentry = {};
                    if(stcount!==0){
                        stcount=parseInt(stcount)*10+parseInt(ussql[c]);
                        userstocks[thisstock.toString()] = stcount;
                    }
                    else{
                        userstocks[thisstock.toString()] = parseInt(ussql[c]);
                    }
                    stcount = 0;
                    isrstock = true;
                    break;
                }
                if(isrstock){
                    if(ussql[c].match(/[A-Z]/i)){
                        thisstock+=ussql[c]
                    }else{
                        isrstock = false;
                        stcount=ussql[c];
                    }
                }else{
                    if(ussql[c].match(/[A-Z]/i)){
                        nstockentry = {};
                        userstocks[thisstock.toString()] = parseInt(stcount);
                        thisstock = '';
                        thisstock+=ussql[c];
                        stcount = 0;
                        isrstock = true;
                    }else{
                        stcount*=10+parseInt(ussql[c]);
                    }
                }
            }
            http.get('http://thestackbrokers.com/api/stocks/'+ticker+'/projection', (resp) => {

                let stockprice = 0;
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {

                    stockprice = JSON.parse(data)[0].currentprice;

                    //Is buying-----
                    if(isBuying){
                        if(result[0].wallet>=stockprice){

                            if(userstocks[ticker]===undefined){
                                //user doesnt have stock
                                userstocks[ticker] = 1;
                            }else{
                                //user has stock
                                userstocks[ticker]++;
                            }
                            let parsestocks = '';
                            for(let stock in userstocks){
                                parsestocks+=stock;
                                parsestocks+=userstocks[stock];
                            }
                            db.c.query("UPDATE "+stocktableName+" SET wallet =\""+parseInt(result[0].wallet-stockprice)+"\", stocks =\""+parsestocks+"\" WHERE phone = \""+phone+"\"");
                            response.redirect('/user/'+result[0].id);
                        }else{
                            //Cant afford
                            response.redirect('/user/'+result[0].id+'/?success=false&reason=nofunds');
                        }
                    }else{

                        //Is selling-----

                        if(userstocks[ticker]===undefined){
                            //user doesnt have stock
                            response.redirect('/user/'+result[0].id+'/?success=false&reason=nostockfound');


                        }else{
                            //user has stock
                            userstocks[ticker]--;
                            if(userstocks[ticker]===0){
                                delete userstocks[ticker];
                            }
                            let parsestocks = '';
                            for(let stock in userstocks){
                                parsestocks+=stock;
                                parsestocks+=userstocks[stock];
                            }
                            db.c.query("UPDATE "+stocktableName+" SET wallet =\""+parseInt(result[0].wallet+stockprice)+"\", stocks =\""+parsestocks+"\" WHERE phone = \""+phone+"\"");
                            response.redirect('user/'+result[0].id+'?success=true');
                        }
                    }



                });
            });

        }else{
            response.redirect('/fantasy/?success=false&reason=nouserfound');
        }
    });
};