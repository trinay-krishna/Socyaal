const Quiz = require('../models/Quiz');

exports.getQuiz = async ( req, res, next ) => {

    try {
        const { quizID } = req.params;

        const quiz = await Quiz.findOne({
            _id: quizID,
        });

        if ( !quiz ) {
            return res.status(400).json({
                success: false,
                msg: 'Quiz does not exist!',
            });
        }

        if ( Date.now() < quiz.startDate ) {
            return res.status(200).json({
                success: true,
                signal: 0,
                msg: 'Quiz yet to start',
                startDate: quiz.startDate,

            });
        }

        if ( Date.now() >= quiz.endDate ) {
            return res.status(200).json({
                success: true,
                signal: 1,
                msg: 'Quiz finished',
                questions: quiz.questions,
                endDate: quiz.endDate,
            });
        }

        return res.status(200).json({
            success: true,
            signal: 2,
            msg: 'Quiz started!',
            questions: quiz.questions,
            endDate: quiz.endDate,
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: 'Error',
        });
    }

}