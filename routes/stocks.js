const express = require('express');
const router = express.Router();
const tools = require('../stock_modules/stocktools');

router.get('/', function(req, res, next) {
    tools.showstocks(res);
});
router.get('/top', function(req, res, next) {
    tools.showtop(res);
});
router.get('/bottom', function(req, res, next) {
    tools.showbottom(res);
});
router.get('/:stockid', function(req, res) {
    tools.showstock(req.params.stockid, res);
});
router.get('/industry/:industry', function(req, res) {
    tools.showindustry(req.params.industry, res);
});
router.get('/:stockid/realtime', function(req, res) {
    tools.showraw(res, req.params.stockid);
});

module.exports = router;