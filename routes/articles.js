var express = require('express');
var router = express.Router();
const stockdatabase = require('../stock_modules/stockdb');

router.get('/', function(req, res, next) {
    stockdatabase.grabtable('articletable', res);
});
router.get('/stock/:stockid', function(req, res) {
    stockdatabase.grabStockInfo('articletable', req.params.stockid, res);
});

module.exports = router;
