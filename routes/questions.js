var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, question} = require('../models');

// /* GET users listing. */
// router.get('/make', function(req, res, next) {
//     res.render('question_make', {title: 'LMS DB PJ', user:req.user});
// });

// /* GET users listing. */
// router.get('/make/:id', isLoggedIn, function(req, res, next) {
//     res.render('question_make', {title: 'LMS DB PJ', user:req.user, id:req.params.id});
// });

/* GET users listing. */
router.get('/make/:id1/:id2', isLoggedIn, function(req, res, next) {
  res.render('question_make', {title: 'LMS DB PJ', user:req.user, id1:req.params.id1, id2:req.params.id2});
});

router.get('/list/:id', isLoggedIn, function(req, res, next) {
    lecture.findOne({
        where: {
          lectureID: req.params.id,
        }
      }).then((lecture)=> {
        question.findAll({
          where: {
            lectureID: lecture.dataValues.lectureID,
          }
        }).then((questions) => {
          res.render('question_list', { title: 'LMS DB PJ', user:req.user, subject: subject, lecture:lecture, questions: questions});
        })
      })
    //res.render('question_list', {title: 'LMS DB PJ'});
});

//문제 만들기 아직 진행중입니다!
router.post('/make/:id1/:id2', isLoggedIn, function(req, res, next){
  //id1 은 lectureID, id2는 단답(0), 객관(1)을 의미함
  const {title, question, difficulty, timelimit} = req.body;
  const b = req.body;
    try {
      let now = Date.now();
      if (b.req.params.id2 == 0) { //단답
        questions.create({
          userID: req.user.userID,
          lectureID: req.params.id1,
          type: 0,
          title: title,
          question: question,
          answer: b.answer,
          difficulty: difficulty,
          realDifficulty: null,
          timeLimit: timelimit,
          bogi1: null,
          bogi2: null,
          bogi3: null,
          bogi4: null,
          bogi5: null,
          createdAt: now,
          updatedAt: now
        }).then((question)=>{
          b.contents.forEach(function(item){
          question_keywords.create({
          questionID: question.lectureID,
          question_keyword: item.keyword,
          score: item.score
          });
        })
      })
      } else { //객관
        var answer = "";
        if (b.gridCheck1 == 1){
          if (answer != ""){
            answer = answer.concat(",");
            answer = answer.concat("1");
          }
        }
        if (b.gridCheck2 == 2){
          if (answer != ""){
            answer = answer.concat(",");
            answer = answer.concat("2");
          }
        }
        if (b.gridCheck3 == 3){
          if (answer != ""){
            answer = answer.concat(",");
            answer = answer.concat("3");
          }
        }
        if (b.gridCheck4 == 4){
          if (answer != ""){
            answer = answer.concat(",");
            answer = answer.concat("4");
          }
        }
        if (b.gridCheck5 == 5){
          if (answer != ""){
            answer = answer.concat(",");
            answer = answer.concat("5");
          }
        }
        console.log(answer);
        questions.create({
          userID: req.user.userID,
          lectureID: req.params.id1,
          type: 1,
          title: title,
          question: question,
          answer: answer,
          difficulty: difficulty,
          realDifficulty: null,
          timeLimit: timelimit,
          bogi1: b.bogi1,
          bogi2: b.bogi2,
          bogi3: b.bogi3,
          bogi4: b.bogi4,
          bogi5: b.bogi5,
          createdAt: now,
          updatedAt: now
        }).then((question)=>{
          b.contents.forEach(function(item){
          question_keywords.create({
          questionID: question.lectureID,
          question_keyword: item.keyword,
          score: item.score
          });
        })
      })
      }
      var link = '/lectures/'+ req.params.id;
      return res.redirect(link);
    } catch (error) {
      console.error(error);
      return next(error);
    }
});


module.exports = router;
