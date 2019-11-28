var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, lecture_keyword, question, question_keyword, student, studentSubject} = require('../models');

/* GET users listing. */

router.get('/', isLoggedIn, async(req, res, next) => {
  try {
    const sub = await subject.findAll();
    return res.render('subject', { title: 'LMS DB PJ', user: req.user, subjects: sub });
  } catch(err) {
    console.log(err);
    return next(err);
  }
});

// 시간 나면 async로 바꾸어야 새로고침 문제 없음
router.get('/my', isLoggedIn, function(req, res, next) {
  if(req.user.type == 1) {
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
        res.render('my_subject', { title: 'LMS DB PJ', user: req.user, subjects: subjects });
      })
    })
  } else {
    student.findOne({
      where: {
        userID: req.user.userID
      }
    }).then((student) => {
      student.getSubjects().then((subjects) => {
        res.render('my_subject', { title: 'LMS DB PJ', user: req.user, subjects: subjects });
      })
    });
  }
});

router.get('/make', isLoggedIn, function(req, res, next) {
  res.render('subject_make', { title: 'LMS DB PJ', user: req.user });
});

// 얘도 시간 나면 async로 바꿀 것
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
        return res.redirect('../subjects');
      })
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//과목 subjectID를 :id로 받음, 데이터베이스에서 해당 과목, 강의, 강의키워드 삭제
router.post('/delete/', isLoggedIn, async(req,res,next)=>{
  try {
    const subID = req.body.delete;
    const lectures = await lecture.findAll({
          where: { subjectID: subID }});
    for (var i=0; i<lectures.length; i++){
    let lecID = lectures[i].dataValues.lectureID;
      await question_keyword.destroy({ where:{lectureID: lecID}})
      await question.destroy({where:{lectureID: lecID}})
      await lecture_keyword.destroy({where:{lectureID: lecID}})
    }
    await lecture.destroy({where: {subjectID: subID }})
    await subject.destroy({where:{subjectID:subID}})
    return res.redirect('/subjects');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/:id', function(req, res, next) {
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

// 과목 신청
router.get("/join/:id", isLoggedIn, async(req, res, next) => {
  try {
    const stu = await student.findOne({where: {userID: req.user.userID}});
    const sub = await subject.findOne({where: {subjectID: req.params.id}});
    const arr = await sub.getStudents();
    // 수강인원 조건
    if(arr.length >= sub.limit) {
      return res.status(403).send('수강인원을 초과하였습니다');
    }
    await sub.addStudents(stu.stuID);
    return res.redirect('../my');
  } catch(err) {
    console.log(err);
    return next(err);
  }
})

// 과목 취소
router.get("/unjoin/:id", isLoggedIn, async(req, res, next) => {
  try {
    const stu = await student.findOne({where: {userID: req.user.userID}});
    const sub = await subject.findOne({where: {subjectID: req.params.id}});
    await sub.removeStudents(stu.stuID);
    return res.redirect('../my');
  } catch(err) {
    console.log(err);
    return next(err);
  }
})

module.exports = router;
