var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const passport = require('passport');
const {user} = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/mypage', isLoggedIn, function(req, res) {
  res.render('mypage', {title: "마이페이지", user: req.user});
})

router.get('/sign_up', isNotLoggedIn, function(req, res) {
  res.render('signup', {
    title: 'LMS DB PJ',
    user: req.user,
    signInError: req.flash('signUpError')});
})

router.post('/sign_up', isNotLoggedIn, async(req, res, next) => {
  const {id, email, name, password, type} = req.body;
  try {
    const exUser = await user.findOne({where: {emailID: email}});
    if(exUser) {
      req.flash('signInError', '이미 가입되어있습니다');
      return res.redirect('/sign_in');
    }
    let now = Date.now();
    await user.create({
      userID: id,
      emailID: email,
      name: name,
      type: type,
      password: password,
      updateAt: now,
      createdAt: now 
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

router.get('/sign_in', isNotLoggedIn, function(req, res) {
  res.render('signin', {title: '로그인'});
})

router.post('/sign_in', isNotLoggedIn, (req, res, next) => {
  console.log("body parsing", req.body)
  passport.authenticate('local', (authError, user, info) => {
    if(authError) {
      console.error(authError);
      return next(authError);
    }
    if(!user) {
      req.flash('loginError', info.message);
      return res.status(403).send('가입한 내역이 없습니다');
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log("successfully login processing")
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/sign_out', isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;