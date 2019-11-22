var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture} = require('../models');

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
  // lecture.findAll({
  //   where: {
  //     subjectID: req.params.id,
  //   }
  // }).then((lectures)=> {
  //   res.render('lecture_list', { title: 'LMS DB PJ', user: req.user, lectures: lectures});
  // })
  subject.findOne({
    where: {
      subjectID: req.params.id,
    }
  }).then((subject)=> {
    lecture.findAll({
      where: {
        subjectID: subject.dataValues.subjectID,
      }
    }).then((lectures) => {
      res.render('lecture_list', { title: 'LMS DB PJ', user: req.user, subject: subject, lectures:lectures });
    })
  })
});



module.exports = router;
