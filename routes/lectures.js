var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, lecture_keyword} = require('../models');

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
router.get('/delete/:id', isLoggedIn, function(req,res,next){
    try {
        lecture.findOne({
            where: {
                lectureID: req.params.id
            }
        }).then((thisLecture)=>{
            var thisSubjectId = thisLecture.subjectID;
            lecture_keyword.destroy({
                where:{
                    lectureID: req.params.id
                }
            }).then(()=>{
                lecture.destroy({
                    where: {
                        lectureID: req.params.id
                    }
            }).then(()=>{
            var link = '/subjects/'+ thisSubjectId;
            return res.redirect(link);
            })
        })
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
  

router.get('/:id', function(req, res, next) {
    // http://jeonghwan-kim.github.io/express-js-2-%EB%9D%BC%EC%9A%B0%ED%8C%85/
    lecture.findOne({
        where: {
          lectureID: req.params.id
        }
      }).then((lecture)=> {
          res.render('lecture', { title: 'LMS DB PJ', user: req.user, lecture: lecture, id: req.params.id });
      })
});

module.exports = router;
