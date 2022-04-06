const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => {
    // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
        session: true, // 세션에 저장 여부
        passReqToCallback: false,
      },
      (id, password, done) => {
        const user = await User.findOne({ id }).select('+password');
        if (!(await argon2.verify(user.password, password))) {
          return done(null, false, {status: 'failure', message: '존재하지 않는 아이디이거나 패스워드가 맞지 않습니다.' }); 
        }
       }
    )
  );
};
