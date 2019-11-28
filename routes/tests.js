var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {question, lecture, submission, student} = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('test', { title: 'LMS DB PJ', user: req.user });
});
router.get('/make', function(req, res, next) {
    res.render('subject_make', {title: 'LMS DB PJ'});
})
router.get('/free/:id', isLoggedIn, async(req, res, next) => {
    try{
        const que = await question.findByPk(req.params.id);
        const lec = await que.getLecture();
        const sub = await lec.getSubject();
        return res.render('free_test', {
            title: 'LMS DB PJ', 
            user: req.user, 
            question: que.dataValues,
            lecture: lec.dataValues,
            subject: sub.dataValues
        });
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
            // [TODO]이부분에서 배점을 구해야함
            // 우선은 10점으로 배점 가정하고 구현
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
            // [TODO] 배점 계산
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
        }
        // 문제 유형에 따라서 별도로 처리해야하고,
        // 제출과 동시에 채점이 이루어져야함
        return res.redirect('/lectures/'+lec.dataValues.lectureID);
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = router;