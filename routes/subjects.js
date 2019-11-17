var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, subject} = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('subject', { title: 'LMS DB PJ', user: req.user });
});

router.get('/make', function(req, res, next) {
    res.render('subject_make', { title: 'LMS DB PJ', user: req.user });
});

/*
router.post('/make', isLoggedIn, async(req, res, next) => {
    const {name, startDate, endDate, limit, tchID} = req.body;
    try {
      const userType = await user.findOne({where: {emailID: req.session.email}, attributes:['user_id']});
      let now = Date.now();
      await subject.create({
        name: name,
        startDate: startDate,
        endDate: endDate,
        limit: limit,
        tchID: userType,
        createdAt: now 
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  */

module.exports = router;
