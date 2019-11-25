var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();
const passport = require('passport');
const {user, teacher, student} = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// 이 부분 아래 sign_in 부분하고 겹치는데... 이유...
// router.get('/login', function(req, res, next) {
//   let session = req.session;
// });

router.get('/mypage', isLoggedIn, function(req, res) {
  res.render('mypage', {title: "마이페이지", user: req.user});
});

router.get('/sign_up', isNotLoggedIn, function(req, res) {
  res.render('signup', {
    title: 'LMS DB PJ',
    user: req.user,
    signInError: req.flash('signUpError')});
});

router.post('/sign_up', isNotLoggedIn, async(req, res, next) => {
  // [TODO] teacher와 student에 동시에 추가하도록 할 것!
  const {id, email, name, password, type} = req.body;
  try {
    const exUser = await user.findOne({where: {emailID: email}});
    if(exUser) {
      req.flash('signInError', '이미 가입되어있습니다');
      return res.redirect('../users/sign_in');
    }
    let now = Date.now();
    await user.create({
      userID: id,
      emailID: email,
      name: name,
      type: type,
      password: password,
      updatedAt: now,
      createdAt: now 
    });
    try {
      if(type == 1) {
        await teacher.create({
          userID: id,
          updatedAt: now,
          createdAt: now
        });
      } else {
        await student.create({
          userID: id,
          updatedAt: now,
          createdAt: now
        });
      }
    } catch (err) {
      console.log(err);
      return next(err);
    }
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/sign_in', isNotLoggedIn, function(req, res) {
  res.render('signin', {title: '로그인'});
});

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
      console.log("successfully login processin")
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