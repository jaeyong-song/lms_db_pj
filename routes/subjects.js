var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject} = require('../models');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    teacher.findOne({
      where: {
        userID: req.user.userID
      }
    }).then((teacher)=> {
      subject.findAll({
        where: {
          tchID: teacher.dataValues.tchID,
        }
      }).then((subjects) => {
        res.render('subject', { title: 'LMS DB PJ', user: req.user, subjects: subjects });
      })
    })
});

router.get('/make', isLoggedIn, function(req, res, next) {
  res.render('subject_make', { title: 'LMS DB PJ', user: req.user });
});


router.post('/make', isLoggedIn, function(req, res, next) {
  const {name, limit} = req.body;
  try {
    teacher.findOne({
      where: {
        userID: req.user.userID
      }
    }).then((teacher)=> {
      let now = Date.now();
      subject.create({
        name: name,
        limit: limit,
        tchID: teacher.dataValues.tchID,
        createdAt: now,
        updatedAt: now
        });
        return res.redirect('/subjects');
      })
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.get('/:id', function(req, res, next) {
  res.render('lecture_list', {title: 'LMS DB PJ'});
  // http://jeonghwan-kim.github.io/express-js-2-%EB%9D%BC%EC%9A%B0%ED%8C%85/
    // 여기 참고해서 파라미터 받아서 DB에서 불러와서 넘겨주어야함.
})



module.exports = router;
