require('dotenv').config();
const { MONGO_URI } = process.env;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
global.logger || (global.logger = require('./config/logger')); // → 전역에서 사용
const morganMiddleware = require('./config/morganMiddleware');
const mongoose = require('mongoose');
const app = express();

app.use(morganMiddleware); // 콘솔창에 통신결과 나오게 해주는 것
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//Set up mongoose connection

module.exports = app;
