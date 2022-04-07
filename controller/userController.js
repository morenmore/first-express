const jwt = require('jsonwebtoken');
// const argon2 = require('argon2');
const User = require('./../models/user');
const passport = require('passport');

exports.login = async (req, res, next) => {
  const { id, password } = req.body;

  // 1) Check if email and password exists
  if (!id || !password) {
    res.status(400).send({
      status: 'failure',
      message: '아이디나 패스워드가 입력되지 않았습니다.',
    });
    return;
  }

  // 2) Check if user exists and password is correct
  // const user = await User.findOne({ id }).select('+password');

  // if (!(await argon2.verify(user.password, password))) {
  //   res.status(401).send({
  //     status: 'failure',
  //     message: '아이디나 패스워드가 맞지 않습니다.',
  //   });
  //   return;
  // }

  passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    },
    (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError); // 에러처리 미들웨어로 보낸다.
      }
      if (!user) {
        // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
        res.status(401).send({
          status: info.status,
          message: info.message,
        });
        return;
      }
      req.login(user, (loginError) => {
        //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
        // 만일 done(err) 가 됬다면,
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN, // set to 90d for 90 days
        });

        res.status(200).json({
          status: 'success',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        });
        return;
      });
    }
  )(req, res, next);

  // 3) If everything is ok, send token to client
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN, // set to 90d for 90 days
  // });
};

exports.checkId = async (req, res, next) => {
  const { id } = req.body;
  const userCheck = await User.findOne({ id });

  if (userCheck) {
    res
      .status(409)
      .send({ status: 'failure', message: '중복된 아이디 입니다.' });
  } else {
    res
      .status(200)
      .send({ status: 'success', message: '아이디가 중복되지 않습니다.' });
  }
};
