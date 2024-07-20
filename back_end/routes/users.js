var express = require('express');
var router = express.Router();
const usersController = require('../controllers/UsersController');
const checkAuthenticated = require('../authentication/checkAuthentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/verify/:userID/:token', usersController.verify_user);

router.get('/reset-pass/:userID/:token', usersController.reset_pass_get);
router.post('/reset-pass/:userID/:token', usersController.reset_pass_post);

router.post('/reset-pass',usersController.reset_pass_link )

router.post('/createUser',usersController.create_user );

router.post('/login', usersController.login_user);

module.exports = router;
