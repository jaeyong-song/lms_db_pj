var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, lecture_keyword, question, question_keyword} = require('../models');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     // 이부분도 파라미터 받아오도록 수정 필요
//     res.render('lecture_list', { title: 'LMS DB PJ' });
// });
// subjects router에서 처리하도록 이동


router.get('/make', function(req, res, next) {
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user});
});

//과목 subjectID 를 :id로 받음
router.get('/make/:id', isLoggedIn, function(req,res,next){
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user, id:req.params.id});
});

//강의 lectureID를 :id로 받음, 강의와 키워드를 데이터베이스에서 삭제
//아직 문항 삭제기능은 없음
router.post('/delete/', isLoggedIn, function(req,res,next){
    try {
        const lecID = req.body.delete;
        const subID = req.body.backSubjectID;
        question_keyword.destroy({
          where:{
            lectureID: lecID
          }
        }).then(()=>{
          question.destroy({
            where:{
              lectureID: lecID
            }
          })
        }).then(()=>{
          lecture_keyword.destroy({
            where:{
              lectureID: lecID
            }
          })
        }).then(()=>{
          lecture.destroy({
            where: {
              lectureID: lecID
            }
          })
        }).then(()=>{
        var link = '/subjects/'+ subID;
        return res.redirect(link);
        })
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

//과목에 강의 추가
router.post('/make/:id', isLoggedIn, function(req, res, next) {
    const {name, start_date, end_date} = req.body;
    try {
      teacher.findOne({
        where: {
          userID: req.user.userID
        }
      }).then((teacher)=> {
        let now = Date.now();
        lecture.create({
          subjectID: req.params.id,
          name: name,
          startDate: start_date,
          endDate: end_date,
          tchID: teacher.dataValues.tchID,
          createdAt: now,
          updatedAt: now
        }).then((lecture)=>{
          req.body.contents.forEach(function(item){
            lecture_keyword.create({
            lectureID: lecture.lectureID,
            lecture_keyword: item.keyword,
            importance: item.importance
          });
        })
          var link = '/subjects/'+ req.params.id;
          return res.redirect(link);
       })
    })
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  

router.get('/:id', async(req, res, next) => {
    try {
      const lec = await lecture.findOne({
        where: {
          lectureID: req.params.id
        }
      });
      const que = await lec.getQuestions();
      return res.render('lecture', { title: 'LMS DB PJ', user: req.user, lecture: lec, id: req.params.id, questions: que });
    } catch(err) {
      console.log(err);
      return next(err);
    }
});

module.exports = router;
