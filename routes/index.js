var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/best', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/GoodStocks.html'));
});

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;
