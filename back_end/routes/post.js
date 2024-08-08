const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../authentication/checkAuthentication');
const postController = require('../controllers/PostController');


router.post('/create-post',checkAuthenticated, postController.create_post);


module.exports = router;
