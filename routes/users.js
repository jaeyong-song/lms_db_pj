var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/sign_in', function(req, res, next) {
  res.render('signin', { title: 'LMS DB PJ' });
})

module.exports = router;
