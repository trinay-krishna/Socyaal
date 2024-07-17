var express = require('express');
var router = express.Router();
const usersController = require('../controllers/UsersController');
const checkAuthenticated = require('../authentication/checkAuthentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/verify/:userID/:token', usersController.verify_user);

router.post('/createUser',usersController.create_user );

router.post('/login', usersController.login_user);

module.exports = router;
