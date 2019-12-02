var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, lecture_keyword, question, question_keyword, student, studentSubject} = require('../models');

//전체 과목 페이지
router.get('/', isLoggedIn, async(req, res, next) => {
  try {
    const sub = await subject.findAll();
    return res.render('subject', { title: 'LMS DB PJ', user: req.user, subjects: sub });
  } catch(err) {
    console.log(err);
    return next(err);
  }
});

//내 과목 페이지
router.get('/my', isLoggedIn, async(req, res, next)=>{
  if(req.user.type == 1) {
    const tea = await teacher.findOne({where: {userID: req.user.userID}})
    const subs = await subject.findAll({where: {tchID: tea.dataValues.tchID}})
    res.render('my_subject', { title: 'LMS DB PJ', user: req.user, subjects: subs });
  } else {
    const stu = await student.findOne({where: {userID: req.user.userID}})
    const subs = await stu.getSubjects();
    res.render('my_subject', { title: 'LMS DB PJ', user: req.user, subjects: subs });
  }
});

//과목 만들기 페이지
router.get('/make', isLoggedIn, function(req, res, next) {
  res.render('subject_make', { title: 'LMS DB PJ', user: req.user });
});

//과목 만들기 페이지에서 생성 버튼 누르면 과목 생성 
router.post('/make', isLoggedIn, async(req, res, next)=>{
  const {name, limit} = req.body;
  try {
    const tea = await teacher.findOne({where: {userID: req.user.userID}})
    let now = Date.now();
    await subject.create({
        name: name,
        limit: limit,
        tchID: tea.dataValues.tchID,
        createdAt: now,
        updatedAt: now
        });
        return res.redirect('../subjects');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//과목 subjectID를 :id로 받음, 데이터베이스에서 해당 과목, 연결된 유저, 강의, 강의키워드 삭제
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
    await user.destroy({where:{subjectID:subID}})
    await subject.destroy({where:{subjectID:subID}})
    return res.redirect('/subjects');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//강의 선택시 강의 페이지로 연결
router.get('/:id', async(req, res, next)=>{
 try{
  const sub = await subject.findOne({where: {subjectID: req.params.id}});
  const lecs = await lecture.findAll({where: {subjectID: sub.dataValues.subjectID}})
  res.render('lecture_list', { title: 'LMS DB PJ', user: req.user, subject: sub, lectures:lecs });
 } catch(err) {
  console.log(err);
  return next(err);
}
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
