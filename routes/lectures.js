var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, student, subject, lecture, lecture_keyword, question, question_keyword} = require('../models');

//강의 만들기
router.get('/make', function(req, res, next) {
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user});
});

//과목 subjectID 를 :id로 받음
router.get('/make/:id', isLoggedIn, function(req,res,next){
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user, id:req.params.id});
});

//강의 삭제. 강의 lectureID를 :id로 받음, 강의와 키워드를 데이터베이스에서 삭제
router.post('/delete/', isLoggedIn, async(req,res,next)=>{
    try {
        const tch = await teacher.findOne({where: {userID: req.user.userID}});
        const lecID = req.body.delete;
        let lec = await lecture.findByPk(lecID);
        // 자신의 강의만 삭제 가능
        if(lec.dataValues.tchID == tch.dataValues.tchID) {
          const subID = req.body.backSubjectID;
          await question_keyword.destroy({ where:{lectureID: lecID}});
          await question.destroy({ where:{lectureID: lecID}})
          await lecture_keyword.destroy({where:{lectureID: lecID}})
          await lecture.destroy({where: {lectureID: lecID}})
          var link = '/subjects/'+ subID;
          return res.redirect(link);
        } else {
          return res.redirect('back');
        }

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
  
//학생의 경우 문제풀기
router.get('/:id', async(req, res, next) => {
    try {
      const lec = await lecture.findOne({
        where: {
          lectureID: req.params.id
        }
      });
      const que = await lec.getQuestions();
      if(req.user.type == 0) {
        const stu = await student.findOne({where:{userID: req.user.userID}});
        let isSolved = [];
        for(let i = 0; i < que.length; i++) {
          let result = await que[i].getSubmissions({where: {stuID: stu.stuID}});
          if(result.length >= 1) {
            isSolved.push(true);
          } else {
            isSolved.push(false);
          }
        }
        return res.render('lecture', { title: 'LMS DB PJ', user: req.user, lecture: lec, id: req.params.id, questions: que, isSolved: isSolved });
      } else {
        let isSolved = [];
        for(let i = 0; i <que.length; i++) {
          isSolved.push(false);
        }
        return res.render('lecture', { title: 'LMS DB PJ', user: req.user, lecture: lec, id: req.params.id, questions: que, isSolved: isSolved });
      }
    } catch(err) {
      console.log(err);
      return next(err);
    }
});

module.exports = router;
