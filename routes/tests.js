var express = require('express');
const Sequelize = require('sequelize');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {question, lecture, submission, student} = require('../models');


router.get('/', function(req, res, next) {
    res.render('test', { title: 'LMS DB PJ', user: req.user });
});

//문항별 테스트 화면, id는 문항ID 
router.get('/free/:id', isLoggedIn, async(req, res, next) => {
    try{
        const que = await question.findByPk(req.params.id);
        const lec = await que.getLecture();
        const sub = await lec.getSubject();
        if(que.dataValues.type == 2) { // 파라미터형 문항의 경우
            const pars = await que.getParameters();
            let randomN = Math.floor(Math.random()*pars.length);
            let par = pars[randomN];
            console.log(par);
            return res.render('free_test', {
                title: 'LMS DB PJ', 
                user: req.user, 
                question: que.dataValues,
                lecture: lec.dataValues,
                subject: sub.dataValues,
                parameter: par.dataValues
            });
        } else {
            return res.render('free_test', {
                title: 'LMS DB PJ', 
                user: req.user, 
                question: que.dataValues,
                lecture: lec.dataValues,
                subject: sub.dataValues
            });
        }
    } catch(err) {
        console.log(err);
        return next(err);
    }
});
// 답안 제출 시
router.post('/:id', isLoggedIn, async(req, res, next) => {
    try {
        const stu = await student.findOne({where:{userID: req.user.userID}});
        const que = await question.findByPk(req.params.id);
        const lec = await que.getLecture();
        let type = req.body.type;
        if(type == 1) {
            let inputArr = new Array();
            inputArr.push(req.body.bogi1);
            inputArr.push(req.body.bogi2);
            inputArr.push(req.body.bogi3);
            inputArr.push(req.body.bogi4);
            inputArr.push(req.body.bogi5);
            inputArr.sort();
            let answerArr = que.dataValues.answer.split(/\D/);
            answerArr.sort();
            let match = 0;
            let actualInputLength = 0;
            let answerLength = answerArr.length;
            inputArr.forEach((input) => {
                if(input != undefined) {
                    actualInputLength++;
                }
                answerArr.forEach((answer) => {
                    if(input == answer) {
                        match++;
                    }
                })
            })
            let subAns = inputArr.join("?");
            let percentile = (2*match - actualInputLength)/answerLength;
            percentile = percentile >= 0 ? percentile : 0;
            // 배점에 곱할 상수로 percentile 계산
            let totScore = 0;
            const key = await que.getQuestion_keywords();
            for(let i = 0; i < key.length; i++) {
                totScore += key[i].dataValues.score;
            }
            let score = totScore*percentile;
            let now = Date.now();
            await submission.create({
                userID: req.user.userID,
                questionID: que.questionID,
                stuID: stu.stuID,
                score: score,
                subAnswer: subAns,
                createdAt: now,
                updatedAt: now
            });
            // 끝나면 자동으로 돌아감
        } else if(type == 0) {
            let standardizedAns = que.dataValues.answer.toLowerCase();
            let userAns = req.body.answer.toLowerCase();
            let totScore = 0;
            const key = await que.getQuestion_keywords();
            for(let i = 0; i < key.length; i++) {
                totScore += key[i].dataValues.score;
            }
            let score = 0;
            if(userAns == standardizedAns) {
                score = totScore;
            }
            let now = Date.now();
            await submission.create({
                userID: req.user.userID,
                questionID: que.questionID,
                stuID: stu.stuID,
                subAnswer: userAns,
                score: score,
                createdAt: now,
                updatedAt: now
            });
            // 끝나면 자동으로 돌아감
        } else if(type == 2) { //파라미터 있는 문항의 경우
            let para = await que.getParameters({where:{ parameterID: req.body.parameterID}});
            let standardizedAns = para[0].dataValues.answer.toLowerCase();
            let userAns = req.body.answer.toLowerCase();
            let totScore = 0;
            const key = await que.getQuestion_keywords();
            for(let i = 0; i < key.length; i++) {
                totScore += key[i].dataValues.score;
            }
            let score = 0;
            if(userAns == standardizedAns) {
                score = totScore;
            }
            let now = Date.now();
            await submission.create({
                userID: req.user.userID,
                questionID: que.questionID,
                stuID: stu.stuID,
                subAnswer: userAns,
                score: score,
                parameterID: req.body.parameterID,
                createdAt: now,
                updatedAt: now
            });
            //끝나면 자동으로 돌아감
        }
        // 문제 유형에 따라서 별도로 처리해야하고,
        // 제출과 동시에 채점이 이루어져야함

        // 마지막으로 문제의 실제 난이도 업데이트 필요
        const key = await que.getQuestion_keywords();
        const subsID = await submission.findAll({
            where:{questionID: que.questionID},
            attributes: [Sequelize.fn("max", Sequelize.col("submission_id"))],
            group: ["stu_id"],
            raw:true
        });
        var ID = [];
        for(var a in subsID) {
            var val = Object.values(subsID[a]);
            ID.push(val);
        }
        const subs = await submission.findAll({where:{submissionID:{[Sequelize.Op.in]: ID}}, include:[{model:student, attributes:['stuID', 'userID']}]})
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
            //실질난이도(10점 만점) 계산: (1-평균점수/전체점수)*10 
            let real_dif = (1-(avg/totScore))*10;
            //실질 난이도 업데이트
            await question.update(
            {realDifficulty: real_dif},
            {where:{questionID: que.questionID}}
            );
        }

        return res.redirect('/lectures/'+lec.dataValues.lectureID);
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = router;