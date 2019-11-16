var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('subject', { title: 'LMS DB PJ', user: req.user });
});
router.get('/make', function(req, res, next) {
    res.render('subject_make', {title: 'LMS DB PJ'});
})

module.exports = router;
