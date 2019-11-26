var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {question, lecture} = require('../models');

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
        const que = await question.findByPk(req.params.id);
        const lec = await que.getLecture();
        console.log(req.body);
        return res.redirect('/lectures/'+lec.dataValues.lectureID);
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = router;
