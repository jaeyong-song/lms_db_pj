var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     // 이부분도 파라미터 받아오도록 수정 필요
//     res.render('lecture_list', { title: 'LMS DB PJ' });
// });
// subjects router에서 처리하도록 이동


router.get('/make', function(req, res, next) {
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user});
});

//과목 subjectID 를 :id로 받음
router.get('/make/:id', isLoggedIn, function(req,res,next){
    res.render('lecture_make', {title: 'LMS DB PJ', user:req.user});
});

//과목에 강의 추가 작업중
// router.post('/make/:id', isLoggedIn, function(req, res, next) {
//     const {name, start_date, end_date,} = req.body;
//     try {
//       teacher.findOne({
//         where: {
//           userID: req.user.userID
//         }
//       }).then((teacher)=> {
//         let now = Date.now();
//         lecture.create({
//           subjectID: req.params.id,
//           name: name,
//           startDate: start_date,
//           endDate: end_date,
//           tchID: teacher.dataValues.tchID,
//           createdAt: now,
//           updatedAt: now
//           });
//           return res.redirect('/subject/:id');
//         })
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
//   });
  

router.get('/:id', function(req, res, next) {
    // http://jeonghwan-kim.github.io/express-js-2-%EB%9D%BC%EC%9A%B0%ED%8C%85/
    // 여기 참고해서 파라미터 받아서 DB에서 불러와서 넘겨주어야함.
     // 여기서 예시로 1로 둔것
    res.render('lecture', {id: req.params.id, user:req.user, title: 'LMS DB PJ'});
})

module.exports = router;
