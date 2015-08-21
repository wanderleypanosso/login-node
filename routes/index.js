var express = require('express');
var router = express.Router();
var auth = require('../passport-auth');

/* GET home page. */
router.get('/', auth.requireAuthenticated(), function(req, res, next) {
    res.render('index', { title: 'Área Restrita', menu: 0 });
});

module.exports = router;
