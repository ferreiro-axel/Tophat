var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome!',description:'Please chose any of our magic tricks' });
});

module.exports = router;
