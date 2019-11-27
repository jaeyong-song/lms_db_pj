var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const {question} = require('../models');

router.get('/make', isLoggedIn, async(req, res, next) => {
    try {
        if(req.user.type == 1) {
            const questions = await question.findAll();
            return res.render('bank_make', { title: 'LMS DB PJ', user: req.user, questions: questions});
        } else {
            return res.redirect('/');
        }
        
    } catch(err) {
        console.log(err);
        return next(err);
    }
})

module.exports = router;