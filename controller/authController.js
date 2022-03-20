const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('./../models/user');

exports.signup = async (req, res, next) => {
  const { id, name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res
      .status(409)
      .send({ status: 'failure', message: '비밀번호가 맞지 않습니다.' });
    return;
  }

  if (userCheck) {
    res
      .status(409)
      .send({ status: 'failure', message: '중복된 아이디 입니다.' });
    return;
  }

  const hashPassword = await argon2.hash(password);

  const newUser = await User.create({
    id: id,
    name: name,
    email: email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // set to 90d for 90 days
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};
