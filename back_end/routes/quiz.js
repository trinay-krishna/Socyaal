const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../authentication/checkAuthentication');
const quizController = require('../controllers/QuizController');


router.get('/:quizID', checkAuthenticated, quizController.getQuiz);

router.post('/createQuiz', checkAuthenticated, quizController.createQuiz);

module.exports = router;