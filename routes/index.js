var express = require('express');
var router = express.Router();
const {subject} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(isLoggedIn) {
    subject.findAll().then((subjects)=> {
      res.render('index', {title: 'LMS DB PJ', user: req.user, subjects: subjects});
    })
  } else {
    res.render('index', {title: 'LMS DB PJ', user: req.user});
  }
});

module.exports = router;
