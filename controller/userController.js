const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('./../models/user');

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
  const user = await User.findOne({ id }).select('+password');

  if (!(await argon2.verify(user.password, password))) {
    res.status(401).send({
      status: 'failure',
      message: '아이디나 패스워드가 맞지 않습니다.',
    });
    return;
  }

  // 3) If everything is ok, send token to client
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // set to 90d for 90 days
  });

  res.status(200).json({
    status: 'success',
    token,
  });
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
