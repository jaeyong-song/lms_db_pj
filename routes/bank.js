var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {question, bank, teacher, bank_question, bank_question_keyword} = require('../models');

router.get('/', isLoggedIn, async(req, res, next) => {
    try {
        if(req.user.type == 1) {
            const tch = await teacher.findOne({where:{userID: req.user.userID}});
            const questions = await bank_question.findAll({where:{tchID: tch.tchID}});
            const candidates = await question.findAll();
            return res.render('bank_list', {title: 'LMS DB PJ', user: req.user, questions: questions, candidates: candidates});
        } else {
            return res.redirect('/');
        } 
    } catch(err) {
        console.log(err);
        return next(err);
    }
})

router.post('/make', isLoggedIn, async(req, res, next) => {
    try {
        if(req.user.type == 1) {
            // b_list: 원래 bank가 가지고 있던 문항 중에 수정되어서 최종으로 남은 것
            // q_list: 전체 문제 리스트에서 추가된 것
            const {b_list, q_list} = req.body;
            let bqIDs = b_list.split(',');
            let spaceIdx = bqIDs.indexOf("");
            if(spaceIdx != -1) {
                bqIDs.splice(spaceIdx, 1);
            }
            let qIDs = q_list.split(',');
            spaceIdx = qIDs.indexOf("");
            if(spaceIdx != -1) {
                qIDs.splice(spaceIdx, 1);
            }
            const tch = await teacher.findOne({where:{userID: req.user.userID}});
            const originalbq = await bank_question.findAll({where:{tchID: tch.tchID}});
            let wannaDel = [];
            for(let i = 0; i < originalbq.length; i++) {
                if(bqIDs.indexOf(String(originalbq[i].dataValues.bankQuestionID)) == -1) {
                    wannaDel.push(originalbq[i].dataValues.bankQuestionID);
                }
            }
            // 이름 변경
            for(let i = 0; i < wannaDel.length; i++) {
                await bank_question.destroy({where:{bankQuestionID: wannaDel[i]}}); // 원래 문제은행에 있던 녀석들은 삭제 완료
                // cascade로 알아서 키워드 삭제
            }
            // 전체 문제에서 온 녀석들은 새로 추가
            console.log(qIDs);
            let now = Date.now();
            for(let i = 0; i < qIDs.length; i++) {
                const que = await question.findOne({where: {questionID: qIDs[i]}});
                await bank_question.create({
                    bankQuestionID: qIDs[i],
                    tchID: tch.tchID,
                    lectureID: que.lectureID,
                    type: que.type,
                    title: que.title,
                    question: que.question,
                    answer: que.answer,
                    difficulty: que.difficulty,
                    realDifficulty: que.difficulty,
                    timeLimit: que.timeLimit,
                    bogi1: que.bogi1,
                    bogi2: que.bogi2,
                    bogi3: que.bogi3,
                    bogi4: que.bogi4,
                    bogi5: que.bogi5,
                    createdAt: now,
                    updatedAt: now
                })
                const keywords = await que.getQuestion_keywords();
                for(let j = 0; j < keywords.length; j++) {
                    await bank_question_keyword.create({
                        bankQuestionID: qIDs[i],
                        bank_question_keyword: keywords[j].dataValues.question_keyword,
                        lectureID: keywords[j].dataValues.lectureID,
                        score: keywords[j].dataValues.score
                    });
                }
            }
            return res.redirect('/banks');
        } else {
            return res.redirect('/');
        }
    } catch(err) {
        console.log(err);
        return next(err)
    }
})

module.exports = router;