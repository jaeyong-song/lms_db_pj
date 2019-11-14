var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/question/:id', function(req, res, next) {
  res.render('signin', { title: 'LMS DB PJ' });
});
router.post('/in', function(req, res, next) {
  
})

module.exports = router;
