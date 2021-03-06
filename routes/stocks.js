const express = require('express');
const router = express.Router();
const tools = require('../stock_modules/stocktools');
const projection = require('../stock_modules/projections');
const history = require('../stock_modules/stockhistory');

router.get('/', function(req, res, next) {
    tools.showstocks(res);
});
router.get('/top', function(req, res, next) {
    projection.getTop(res);
});
router.get('/bottom', function(req, res, next) {
    projection.getBottom(res);
});
router.get('/projections', function(req, res) {
    projection.getAllGrowths(res);
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
router.get('/:stockid/history', function(req, res) {
    history.getStockHistory(res, req.params.stockid);
});
router.get('/:stockid/projection', function(req, res) {
    projection.getstockgrowth(res, req.params.stockid);
});
router.get('/test', function(req, res, next) {
    console.log("text");
});

module.exports = router;