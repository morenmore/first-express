const express = require('express');
const router = express.Router();
const modelPlanets = require('../models/planets');
const userController = require('../controller/userController');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (req, res, next) {
  modelPlanets.find({}, function (err, planets) {
    if (err) {
      console.error(err);
    } else {
      res.render('index', {
        title: 'planets',
        planets: planets,
        planetsLen: planets.length,
      });
    }
  });
});

router.get('/planets', async (req, res) => {
  try {
    const data = await modelPlanets.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/login', userController.login);

module.exports = router;
