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
// router.post('/make/:id1/:id2', isLoggedIn, function(req, res, next){
//   //id1 은 lectureID, id2는 단답(0), 객관(1)을 의미함
//   const {title, question, difficulty, timelimit} = req.body;
//   const b = req.body;
//     try {
//       let now = Date.now();
//       if (b.req.params.id2 == 0) { //단답
//         var answer1 = toString(b.gridCheck1);
//         var answer2 = toString(b.gridCheck2);
//         var answer3 = toString(b.gridCheck3);
//         var answer4 = toString(b.gridCheck4);
//         var answer5 = toString(b.gridCheck5);
//         console.log(answer1);
//         questions.create({
//           userID: req.user.userID,
//           lectureID: req.params.id1,
//           type: 0,
//           title: title,
//           question: question,
//           answer: String.concat(answer1, answer2, answer3, answer4, answer5),
//           difficulty: difficulty,
//           realDifficulty: null,
//           timeLimit: timelimit,
//           bogi1: null,
//           bogi2: null,
//           bogi3: null,
//           bogi4: null,
//           bogi5: null,
//           createdAt: now,
//           updatedAt: now
//         }).then((question)=>{
//           b.contents.forEach(function(item){
//           question_keywords.create({
//           questionID: question.lectureID,
//           question_keyword: item.keyword,
//           score: item.score
//           });
//         })
//       })
//       } else { //객관
//         questions.create({
//           userID: req.user.userID,
//           lectureID: req.params.id1,
//           type: 1,
//           title: title,
//           question: question,
//           answer: b.answer,
//           difficulty: difficulty,
//           realDifficulty: null,
//           timeLimit: timelimit,
//           bogi1: b.bogi1,
//           bogi2: b.bogi2,
//           bogi3: b.bogi3,
//           bogi4: b.bogi4,
//           bogi5: b.bogi5,
//           createdAt: now,
//           updatedAt: now
//         }).then((question)=>{
//           b.contents.forEach(function(item){
//           question_keywords.create({
//           questionID: question.lectureID,
//           question_keyword: item.keyword,
//           score: item.score
//           });
//         })
//       })
//       }
//       var link = '/lectures/'+ req.params.id;
//       return res.redirect(link);
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
// });


module.exports = router;
