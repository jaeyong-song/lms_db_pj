var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, question} = require('../models');

/* GET users listing. */
router.get('/make', function(req, res, next) {
    res.render('question_make', {title: 'LMS DB PJ', user:req.user});
});

/* GET users listing. */
router.get('/make/:id', function(req, res, next) {
    res.render('question_make', {title: 'LMS DB PJ', user:req.user, id:req.params.id});
});

router.get('/list/:id', function(req, res, next) {
    lecture.findOne({
        where: {
          lectureID: req.params.id,
        }
      }).then((lecture)=> {
        question.findAll({
          where: {
            questionID: lecture.dataValues.lectureID,
          }
        }).then((questions) => {
          res.render('question_list', { title: 'LMS DB PJ', user:req.user, subject: subject, lecture:lecture, questions: questions});
        })
      })
    //res.render('question_list', {title: 'LMS DB PJ'});
});


module.exports = router;
