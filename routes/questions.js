var express = require('express');
const Sequelize = require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {user, student, bank_question, bank_question_keyword, lecture, lecture_keyword, question, question_keyword, parameter, submission} = require('../models');
const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({
  dest: 'uploads/'
});


//믄제은행에서 세트 추출하기 설정 페이지
router.get('/make/banks/:id', isLoggedIn, async(req, res, next) => {
  const lec_keywords = await bank_question_keyword.aggregate('bank_question_keyword', 'DISTINCT', {plain:false})
  console.log(lec_keywords);
  return res.render('question_make_bank', {title: 'LMS DB PJ', user:req.user, id:req.params.id, lecture_keywords:lec_keywords})
})

//문제은행 세트에서 선택한 문제들 새로 강의에 저장
router.post('/make/banks/add', isLoggedIn, async(req, res, next) => {
  const bankQuestionIDs = req.body.bankQuestionIDs.split(",");
  const lectureID = req.body.lectureID
  let spaceIdx = bankQuestionIDs.indexOf('');
  if(spaceIdx != -1) {
    bankQuestionIDs.splice(spaceIdx, 1);
  }
  for(let i = 0; i < bankQuestionIDs.length; i++) {
    let bankQ = await bank_question.findByPk(bankQuestionIDs[i]);
    let bankQKey = await bankQ.getBank_question_keywords();
    let now = Date.now();
    let newQ = await question.create({
      userID: req.user.userID,
      lectureID: lectureID,
      type: bankQ.dataValues.type,
      title: bankQ.dataValues.title,
      question: bankQ.dataValues.question,
      answer: bankQ.dataValues.answer,
      difficulty: bankQ.dataValues.difficulty,
      realDifficulty: null, //풀지 않은 새로운 문항으로 생성
      timeLimit: bankQ.dataValues.timeLimit,
      bogi1: bankQ.dataValues.bogi1,
      bogi2: bankQ.dataValues.bogi2,
      bogi3: bankQ.dataValues.bogi3,
      bogi4: bankQ.dataValues.bogi4,
      bogi5: bankQ.dataValues.bogi5,
      createdAt: now,
      updatedAt: now
    })
    let newQID = newQ.dataValues.questionID;
    for(let j = 0; j < bankQKey.length; j++) {
      await question_keyword.create({
        questionID: newQID,
        question_keyword: bankQKey[j].dataValues.bank_question_keyword,
        lectureID: lectureID,
        score: bankQKey[j].dataValues.score,
        updatedAt: now,
        createdAt: now
      })
    }
    if(bankQ.dataValues.type == 2) { // 파라미터형 문항
      let bankQPar = await bankQ.getBank_parameters();
      console.log(bankQPar);
      for(let j = 0; j < bankQPar.length; j++) {
        await parameter.create({
          questionID: newQID,
          answer: bankQPar[j].dataValues.answer,
          p1: bankQPar[j].dataValues.p1,
          p2: bankQPar[j].dataValues.p2,
          p3: bankQPar[j].dataValues.p3,
          p4: bankQPar[j].dataValues.p4,
          p5: bankQPar[j].dataValues.p5,
          createdAt: now,
          updatedAt: now
        })
      }
    }
  }
  return res.redirect('/questions/list/'+lectureID);
})

//문항 세트 설정 입력시 제작해 보여줌
router.post('/make/banks/:id', isLoggedIn, async(req, res, next) => {
  const {qnum, avgDiff, avgRealDiff, keywords, totScore} = req.body; // keywords는 배열
  let result1, result2, result3;
  let diff, diff1, diff2;
  let realDiff, realDiff1, realDiff2;
  let tot, tot1, tot2;
  let minDiff = parseInt(avgDiff) - 2;
  let maxDiff = parseInt(avgDiff) + 2;
  let minRealDiff = parseInt(avgRealDiff) - 2;
  let maxRealDiff = parseInt(avgRealDiff) + 2;
  let minScore = parseInt(totScore) - 10;
  let maxScore = parseInt(totScore) + 10;
  for(let i = 0; i < 30; i++) {
    let ex = await bank_question.findAll({
      attributes: ['bank_question_id', 'real_difficulty','difficulty', 'lecture_id', "type", "title", "question", "real_difficulty", "bogi1", "bogi2", "bogi3", "bogi4", "bogi5"],
      include: [{
        model: bank_question_keyword,
        where: {
          bank_question_keyword: keywords
        }
      }],
      order: Sequelize.literal('RAND()'),
      limit: parseInt(qnum)
    });
    
    let diffSum = 0;
    let tmpScoreSum = 0;
    let realDiffSum = 0;
    for(let j = 0; j < ex.length; j++) {
      let exKey = await bank_question_keyword.findAll({
        attributes: [[Sequelize.fn('sum', Sequelize.col('score')), 'sum']],
        where:{bankQuestionID: ex[j].dataValues.bank_question_id}
      });
      tmpScoreSum += exKey[0].dataValues.sum;
      diffSum += ex[j].dataValues.difficulty;
      realDiffSum += ex[j].dataValues.real_difficulty;
    }
    // 첫번째에는 무조건 한번 저장해야 null 문제 발생하지 않음
    if(i == 0) {
      result1 = ex;
      diff = diffSum/ex.length;
      realDiff = realDiffSum/ex.length;
      tot = tmpScoreSum;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        || ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        || ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result1 = ex;
        diff = diffSum/ex.length;
        tot = tmpScoreSum;
        realDiff = realDiffSum/ex.length;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        && ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        && ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result1 = ex;
        diff = diffSum/ex.length;
        tot = tmpScoreSum;
        realDiff = realDiffSum/ex.length;
        break;
    }
  }
  for(let i = 0; i < 30; i++) {
    let ex = await bank_question.findAll({
      attributes: ['bank_question_id', 'real_difficulty' ,'difficulty', 'lecture_id', "type", "title", "question", "real_difficulty", "bogi1", "bogi2", "bogi3", "bogi4", "bogi5"],
      include: [{
        model: bank_question_keyword,
        where: {
          bank_question_keyword: keywords
        }
      }],
      order: Sequelize.literal('RAND()'),
      limit: parseInt(qnum)
    });
    let diffSum = 0;
    let tmpScoreSum = 0;
    let realDiffSum = 0;
    for(let j = 0; j < ex.length; j++) {
      let exKey = await bank_question_keyword.findAll({
        attributes: [[Sequelize.fn('sum', Sequelize.col('score')), 'sum']],
        where:{bankQuestionID: ex[j].dataValues.bank_question_id}
      });
      tmpScoreSum += exKey[0].dataValues.sum;
      diffSum += ex[j].dataValues.difficulty;
      realDiffSum += ex[j].dataValues.real_difficulty;
    }
    if(i==0) {
      result2 = ex;
      diff1 = diffSum/ex.length;
      tot1 = tmpScoreSum;
      realDiff1 = realDiffSum/ex.length;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        || ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        || ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result2 = ex;
        diff1 = diffSum/ex.length;
        tot1 = tmpScoreSum;
        realDiff1 = realDiffSum/ex.length;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        && ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        && ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result2 = ex;
        diff1 = diffSum/ex.length;
        tot1 = tmpScoreSum;
        realDiff1 = realDiffSum/ex.length;
        break;
    }
  }
  for(let i = 0; i < 30; i++) {
    let ex = await bank_question.findAll({
      attributes: ['bank_question_id', 'real_difficulty', 'difficulty', 'lecture_id', "type", "title", "question", "real_difficulty", "bogi1", "bogi2", "bogi3", "bogi4", "bogi5"],
      include: [{
        model: bank_question_keyword,
        where: {
          bank_question_keyword: keywords
        }
      }],
      order: Sequelize.literal('RAND()'),
      limit: parseInt(qnum)
    });
    let diffSum = 0;
    let tmpScoreSum = 0;
    let realDiffSum = 0;
    for(let j = 0; j < ex.length; j++) {
      let exKey = await bank_question_keyword.findAll({
        attributes: [[Sequelize.fn('sum', Sequelize.col('score')), 'sum']],
        where:{bankQuestionID: ex[j].dataValues.bank_question_id}
      });
      tmpScoreSum += exKey[0].dataValues.sum;
      diffSum += ex[j].dataValues.difficulty;
      realDiffSum += ex[j].dataValues.real_difficulty;
    }
    if(i==0) {
      result3 = ex;
      diff2 = diffSum/ex.length;
      tot2 = tmpScoreSum;
      realDiff2 = realDiffSum/ex.length;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        || ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        || ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result3 = ex;
        diff2 = diffSum/ex.length;
        tot2 = tmpScoreSum;
        realDiff2 = realDiffSum/ex.length;
    }
    if( ((minDiff < diffSum/ex.length) && (diffSum/ex.length < maxDiff))
        && ((minScore < tmpScoreSum) && (tmpScoreSum < maxScore)) 
        && ((minRealDiff < realDiffSum/ex.length) && (realDiffSum/ex.length < maxRealDiff))) {
        result3 = ex;
        diff2 = diffSum/ex.length;
        tot2 = tmpScoreSum;
        realDiff2 = realDiffSum/ex.length;
        break;
    }
  }
  return res.render('question_candidate_list', {
    title: 'LMS DB PJ', 
    user:req.user, 
    id: req.params.id, 
    questions: result1, 
    diff: diff,
    realDiff: realDiff,
    tot: tot, 
    questions1: result2, 
    diff1: diff1,
    realDiff1: realDiff1,
    tot1: tot1,
    questions2: result3,  
    diff2: diff2, 
    realDiff2: realDiff2,
    tot2: tot2
  });
})

//문항 만들기 페이지
router.get('/make/:id1/:id2', isLoggedIn, async(req, res, next)=>{
  const lec_keywords = await lecture_keyword.findAll({
    where: {
      lectureID: req.params.id1
    }
  });
  res.render('question_make', {title: 'LMS DB PJ', user:req.user, id1:req.params.id1, id2:req.params.id2, lecture_keywords:lec_keywords});
});

//강의별 문항 리스트 가져오기
router.get('/list/:id', isLoggedIn, async(req, res, next)=>{
    try{
      const lec = await lecture.findOne({where: {lectureID: req.params.id}});
      const ques = await question.findAll({where: {lectureID: lec.dataValues.lectureID}});
      res.render('question_list', { title: 'LMS DB PJ', user:req.user, lecture:lec, questions: ques});
    } catch (error) {
      console.error(error);
      return next(error);
    }   
});

//문항별 학생 풀이 확인
router.post('/solution', isLoggedIn, async(req,res,next)=>{
  const lec = await lecture.findOne({where:{lectureID:req.body.lecID}});
  const key = await question_keyword.findAll({where:{questionID:req.body.queID}});
  //학생당 가장 마지막에 제출한 정답만 가져옴
  const subsID = await submission.findAll({
    where:{questionID:req.body.queID},
    attributes: [Sequelize.fn("max", Sequelize.col("submission_id"))],
    group: ["stu_id"],
    raw:true
    });
  var ID = [];
  for(var a in subsID)
    {
        var val = Object.values(subsID[a]);
        ID.push(val);
    }
  console.log(ID);
  const subs = await submission.findAll({where:{submissionID:{[Sequelize.Op.in]: ID}}, include:[{model:student, attributes:['stuID', 'userID']}]})
  let parameterIDs = [];
  subs.forEach((sub) => {
    parameterIDs.push(sub.dataValues.parameterID);
  })
  const paras = await parameter.findAll({where:{parameterID: {[Sequelize.Op.in]: parameterIDs}}});
  
  let avg = 0;
  let totScore = 0;
  //해당 문제의 총점
  for(let i = 0; i < key.length; i++) {
    totScore += key[i].dataValues.score;
  }
  //학생이 푼 기록이 있는 경우
  if (subs.length != 0){ 
    let sum = 0;
    for (let i=0;i < subs.length; i++){
      sum=sum+subs[i].dataValues.score;
    }
    avg = sum/(subs.length);
    // 실질난이도(10점 만점) 계산: (1-평균점수/전체점수)*10 
    // 실질난이도는 tests.js에 학생이 답을 제출한 경우 question테이블에 realDifficulty로 업데이트됨.
  } else { //학생이 푼 기록이 없는 경우
    avg = 0;
 
  }
  const que = await question.findOne({where:{questionID:req.body.queID}});
  res.render('question_solution', {title: 'LMS DB PJ', user:req.user, lecture: lec, question: que, total_score: totScore, average: avg, submissions:subs, paras: paras});
});


//문항 만들기
router.post('/make/:id1/:id2', upload.single('params'), isLoggedIn, function(req, res, next){
  //id1 은 lectureID, id2는 단답(0), 객관(1), 파라미터 단답(2)을 의미함
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
          realDifficulty: difficulty,
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
          realDifficulty: difficulty,
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
          realDifficulty: difficulty,
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
          let paraXlsx = XLSX.readFile(__dirname + "\/..\/" + req.file.path);
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
router.post('/delete', isLoggedIn, async(req, res, next)=>{
  const id = req.body.delete;
  try{
  await question_keyword.destroy({where: {questionID: id}});
  await question.destroy({where: {questionID: id}})
  var link = '/questions/list/'+ req.body.lecID;
  return res.redirect(link);
  }catch (err){
    console.error(err);
    return next(err);
  }
});

module.exports = router;
