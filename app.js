var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subjectsRouter = require('./routes/subjects');
var lecturesRouter = require('./routes/lectures');
var questionsRouter = require('./routes/questions');
var testsRouter = require('./routes/tests');
var apiRouter = require('./routes/api');


// DB Setting (Sequelize)
const models = require("./models/index.js");
// login => passport
const passportConfig = require('./passport')


var app = express();

models.sequelize.sync().then(() => {
  console.log("DB connected.")
}).catch(err => {
  console.log("DB connection failed.");
  console.log(err);
});

passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('lmsdbproject'));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'lmsdbproject',
  cookie: {
    httpOnly: true,
    secure: false
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




// Routers => 이것을 보고 링크 판단
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);
app.use('/lectures', lecturesRouter);
app.use('/questions', questionsRouter);
app.use('/tests', testsRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
