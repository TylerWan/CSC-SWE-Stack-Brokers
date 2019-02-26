var express = require('express');
var router = express.Router();
const stockdatabase = require('../stock_modules/stockdb');

router.get('/', function(req, res, next) {
    stockdatabase.grabtable('stocktable', res);
});
router.get('/:stockid', function(req, res) {
    res.send("requested: " + req.params.stockid);
});


module.exports = router;
