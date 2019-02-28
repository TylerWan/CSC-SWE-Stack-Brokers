var express = require('express');
var router = express.Router();
const stockdatabase = require('../stock_modules/stockdb');
const tools = require('../stock_modules/stocktools');

router.get('/', function(req, res, next) {
    stockdatabase.grabtable('stocktable', res);
});
router.get('/:stockid', function(req, res) {
    stockdatabase.grabStockInfo('stocktable', req.params.stockid, res);
});
router.get('/:stockid/realtime', function(req, res) {
    tools.showraw(res, req.params.stockid);
});

module.exports = router;
