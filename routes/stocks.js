const express = require('express');
const router = express.Router();
const tools = require('../stock_modules/stocktools');

router.get('/', function(req, res, next) {
    tools.showstocks(res);
});

router.get('/:stockid/realtime', function(req, res) {
    tools.showraw(res, req.params.stockid);
});

router.get('/top', function(req, res, next) {
    tools.showtop(res);
});

router.get('/bottom', function(req, res, next) {
    tools.showbottom(res);
});
module.exports = router;