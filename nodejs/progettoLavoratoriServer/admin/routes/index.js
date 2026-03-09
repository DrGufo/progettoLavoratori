var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/interventi', function(req, res, next) {
  res.render('interventi', { title: 'Express' });
});

module.exports = router;
