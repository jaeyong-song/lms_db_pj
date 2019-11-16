var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/make', function(req, res, next) {
    res.render('question_make', {title: 'LMS DB PJ'});
});

module.exports = router;
