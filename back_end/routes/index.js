var express = require('express');
var router = express.Router();
const checkAuthenticated = require('../authentication/checkAuthentication');


/* GET home page. */
router.get('/', checkAuthenticated, (req, res, next) => {
  res.status(201).json({
    auth: true,
  });
});

router.get('/login',checkAuthenticated, (req, res, next) => {
  res.status(201).json({
    auth: true,
  })
});

module.exports = router;
