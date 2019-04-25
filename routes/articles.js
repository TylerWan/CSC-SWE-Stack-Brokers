const express = require('express');
const router = express.Router();
const tools = require('../stock_modules/stocktools');
const articles = require('../stock_modules/articles');

router.get('/', function(req, res, next) {
    articles.getAllArticles(res);
});
router.get('/:ticker', function(req, res, next) {
    articles.getStockArticles(res, req.params.ticker);
});



module.exports = router;