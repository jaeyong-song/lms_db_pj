var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, teacher, subject, lecture, lecture_keyword, question, question_keyword, parameter} = require('../models');
const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({
  dest: 'uploads/'
});


// /* GET users listing. */
// router.get('/make', function(req, res, next) {
//     res.render('question_make', {title: 'LMS DB PJ', user:req.user});
// });

// /* GET users listing. */
// router.get('/make/:id', isLoggedIn, function(req, res, next) {
//     res.render('question_make', {title: 'LMS DB PJ', user:req.user, id:req.params.id});
// });

/* GET users listing. */
router.get('/make/:id1/:id2', isLoggedIn, async(req, res, next)=>{
  const lec_keywords = await lecture_keyword.findAll({
    where: {
      lectureID: req.params.id1
    }
  });
  res.render('question_make', {title: 'LMS DB PJ', user:req.user, id1:req.params.id1, id2:req.params.id2, lecture_keywords:lec_keywords});
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

// 파라미터 파일 저장
// router.post('/parameter/:id', upload.single('params'), function(req, res, next) {
//   // id 는 lectureID를 받아올 것
//   console.log(req.file);
//   res.send('uploaded: ' + req.params.id);
// });

//문제 만들기 아직 진행중입니다!
router.post('/make/:id1/:id2', upload.single('params'), isLoggedIn, function(req, res, next){
  //id1 은 lectureID, id2는 단답(0), 객관(1)을 의미함
  const {q_title, q_content, answer,difficulty, timelimit} = req.body;
  const b = req.body;
  console.log(req.body);
    try {
      let now = Date.now();
      if (req.params.id2 == 0) { //단답
        question.create({
          userID: req.user.userID,
          lectureID: req.params.id1,
          type: 0,
          title:  q_title,
          question: q_content,
          answer: answer,
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
          question_keyword.create({
          questionID: question.questionID,
          lectureID: question.lectureID,
          question_keyword: item.keyword,
          score: item.score
          });
        })
      })
      } else if(req.params.id2 == 1) { //객관
        var answerN = "";
        console.log(b.gridCheck1);
        if (b.gridCheck1){
          if (answerN != ""){
            answerN = answerN.concat(",");
          }
          answerN = answerN.concat("1");
        }
        if (b.gridCheck2){
          if (answerN != ""){
            answerN = answerN.concat(",");
          }
          answerN = answerN.concat("2");
        }
        if (b.gridCheck3){
          if (answerN != ""){
            answerN = answerN.concat(",");
          }
          answerN = answerN.concat("3");
        }
        if (b.gridCheck4){
          if (answerN != ""){
            answerN = answerN.concat(",");
            answerN = answerN.concat("4");
          }
        }
        if (b.gridCheck5){
          if (answerN != ""){
            answerN = answerN.concat(",");
          }
          answerN = answerN.concat("5");
        }
        question.create({
          userID: req.user.userID,
          lectureID: req.params.id1,
          type: 1,
          title: q_title,
          question: q_content,
          answer: answerN,
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
          question_keyword.create({
          questionID: question.questionID,
          lectureID: question.lectureID,
          question_keyword: item.keyword,
          score: item.score
          });
        })
      })
      } else if(req.params.id2 == 2) { // 파라미터있는 경우
        question.create({
          userID: req.user.userID,
          lectureID: req.params.id1,
          type: 2,
          title:  q_title,
          question: q_content,
          answer: answer,
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
          const qid = question.questionID;
          b.contents.forEach(function(item){
            question_keyword.create({
            questionID: qid,
            lectureID: question.lectureID,
            question_keyword: item.keyword,
            score: item.score
            });
          })
          let data = {};
          let paraXlsx = XLSX.readFile(__dirname + "\\..\\" + req.file.path);
          let sheetnames = Object.keys(paraXlsx.Sheets);
          let i = sheetnames.length;
          while (i--) {
            let sheetname = sheetnames[i];
            data[sheetname] = XLSX.utils.sheet_to_json(paraXlsx.Sheets[sheetname]);
          }
          let paraSheet = data["Sheet1"];
          for(let i = 0; i < paraSheet.length; i++) {
            let dataSet = paraSheet[i];
            parameter.create({
              questionID: qid,
              answer: dataSet["answer"],
              p1: dataSet["pr1"],
              p2: dataSet["pr2"],
              p3: dataSet["pr3"],
              p4: dataSet["pr4"],
              p5: dataSet["pr5"]
            })
          }
          console.log(data);
        })
      }
      var link = '/questions/list/'+ req.params.id1;
      return res.redirect(link);
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

//문항 삭제
//키워드 삭제 반영되지 않음
router.post('/delete', isLoggedIn, function(req, res, next){
  const id = req.body.delete;
  try{
    question_keyword.destroy({
      where: {
        questionID: id
      }
    }).then(()=>{
      question.destroy({
        where: {
          questionID: id
        }
      })
    })
    var link = '/questions/list/'+ req.body.backLectureID;
    return res.redirect(link);
  }catch (err){
    console.error(err);
    return next(err);
  }
});

module.exports = router;
