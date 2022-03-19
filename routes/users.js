const express = require('express');

// const userController = require('../controller/userController')
const authController = require('../controller/authController');

const router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/signup', authController.signup);

module.exports = router;
