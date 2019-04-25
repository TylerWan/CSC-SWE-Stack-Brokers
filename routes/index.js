var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});



router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
router.get('/industries', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/Industry.html'));
});
router.get('/register', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/register.html'));
});
router.get('/fantasy', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/register.html'));
});
router.get('/worst', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/worstStock.html'));
});
router.get('/best', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/GoodStocks.html'));
});
router.get('/user/:id', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/userpage.html'));
});
router.get('/processed', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/processed.html'));
});
router.get('/buy/:ticker', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/buy.html'));
});
router.get('/sell/:ticker', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/sell.html'));
});
router.get('/stock/:ticker', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../pages/stock.html'));
});
module.exports = router;
