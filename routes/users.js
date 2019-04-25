const express = require('express');
const router = express.Router();
const tools = require('../stock_modules/stocktools');
const users = require('../stock_modules/users');

router.get('/top', function(req, res, next) {
    users.getTopUsers(res);
});
router.get('/:id', function(req, res, next) {
    users.getUserPageInfo(res, req.params.id);
});



module.exports = router;