const Quiz = require('../models/Quiz');
const Participant = require('../models/Participant');
const { body, validationResult } = require('express-validator');
const { addQuiz } = require('../socketConfig/setupSockets');
const mongoose = require('mongoose');
const { getAIQuiz } = require('../utils/openAI');


exports.getQuiz = async ( req, res, next ) => {

    try {
        const { quizID } = req.params;

        if ( !mongoose.Types.ObjectId.isValid( quizID ) ) {
            return res.status(400).json({
                success: false,
                signal: -2,
                msg: 'Quiz does not exist',
            });
        }
        const quiz = await Quiz.findOne({
            _id: quizID,
        });

        if ( !quiz ) {
            return res.status(400).json({
                success: false,
                signal: -2,
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

exports.createQuiz = [
    body('quizName')
    .trim()
    .isLength( { min: 5 } )
    .withMessage('Quiz name must atleast be of 5 characters.'),
    async ( req, res, next ) => {
        try {

            const errors = validationResult(req);

            if ( !errors.isEmpty() ) {
                return res.status(400).json({
                    success: false,
                    errors: errors.errors,
                });
            }

            console.log(req.body);
            const { quizName, questions, startDate, endDate } = req.body;

            let questionsArray;
            
            if ( questions.length === 0 ) {
                const response = await getAIQuiz( req, quizName );

                questionsArray = JSON.parse(response.content.replace(/```json\n|\n```/g, ""));
            } else {
                questionsArray = JSON.parse(questions);
            }

            if ( questionsArray.length === 0 ) {
                return res.status(400).json({
                    success: false,
                    msg: 'Quiz creation Failed!',
                });
            }


            const quiz = new Quiz({
                quizName,
                questions: questionsArray,
                startDate,
                endDate,
            });

            console.log('Date diff', Date.now() - startDate);

            await quiz.save();
            console.log('Quiz ', quiz);

            const quizID = quiz._id.toString();
            console.log('Emitting to ',quizID);

            const io = req.app.get('io');

            const addQuizTime = startDate - Date.now();
            const BUFFER = 10000;

            setTimeout( () => {
                console.log('Adding Quiz');
                addQuiz( quizID, endDate );
                io.to(quizID).emit('reconnectSocket');
            }, addQuizTime - BUFFER );

            const timerInterval = setInterval( ( ) => {
                if ( Date.now() <= startDate ) {
                    const time = Math.floor( (startDate - Date.now())/1000 );
                    const msg = {
                        signal: 0,
                        time,
                    }
                    console.log('Signal is ', msg.signal, 'Time is', msg.time);
                    io.to(quizID).emit('time', msg);
                } else if ( Date.now() <= endDate ) {
                    const time = Math.floor( (endDate - Date.now())/1000 );
                    const msg = {
                        signal: 2,
                        time,
                    }
                    console.log('Signal is ', msg.signal, 'Time is', msg.time);
                    io.to(quizID).emit('time', msg);
                } else {
                    console.log('Interval cleared!');
                    io.to(quizID).emit('time', {
                        signal: 1,
                        time: 0,
                    });
                    clearInterval( timerInterval );
                }
            }, 1000 );

            return res.status(201).json({
                success: true,
                msg: 'Quiz Created!',
            });

        } catch(err) {
            console.error(err);
            res.status(500).json({
                success: false,
                msg: 'Error',
            });
        }
    }
]

exports.getQuizList = async ( req, res, next ) => {
    try {
        const [ upcomingQuizList,
                ongoingQuizList,
                finishedQuizList ] = await Promise.all([
                    Quiz.find( { startDate: { $gt: Date.now() } }, { questions: false, endDate: false,  } ),
                    Quiz.find( { 
                        $and: [
                            {
                                startDate : { $lt: Date.now() }
                            },
                            {
                                endDate: { $gt: Date.now() },
                            }
                        ]
                    }, { questions: false, endDate: false, startDate: false,  } ),
                    Quiz.find( { endDate: { $lt: Date.now() } }, { questions: false, endDate: false, startDate: false, } ),
                ]);

        
        res.status(200).json( {
            success: true,
    
            quizList: [
                {
                    type: 'Upcoming',
                    list: upcomingQuizList
                },
                {
                    type: 'Ongoing',
                    list: ongoingQuizList,
                },
                {
                    type: 'Finished',
                    list: finishedQuizList,
                }
            ]
        });
    } catch( err ) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: err,
        });
    }
}

exports.getLeaderboard = async ( req, res, next ) => {
    try {
        const { quizID, page } = req.params;

        const quiz = await Quiz.findOne( { _id: quizID } );

        if ( !quiz ) {
            return res.status(400).json({
                success: false,
                msg: 'Quiz not found!',
            });
        }
        
        const pageIndex = page - 1;
        const MAX_ENTRIES = 10;
        
        const [ totalDocuments, leaderboard ] = await Promise.all([
            Participant.countDocuments( { quizID } ),
            Participant.find( { quizID }, { quizID: false,  } )
                                    .sort( { points: -1, endDate: 1 } )
                                    .skip( pageIndex * MAX_ENTRIES )
                                    .limit( MAX_ENTRIES ),
        ]);

        if ( !leaderboard ) {
            return res.status(400).json({
                success: false,
                msg: 'Leaderboard not available',
            });
        }


        const totalPageCount = Math.ceil( totalDocuments / MAX_ENTRIES );

        res.status(200).json({
            success: true,
            leaderboard,
            totalPageCount,
        });
        
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: err,
        });
    }
}

// exports.get_ai_quiz = async ( req, res, next ) => {
//     try {
//         const response = await getAIQuiz(req, 'King Kong');


//         const jsonString = response.content.replace(/```json\n|\n```/g, "");

//         res.status(200).json({
//             success: true,
//             response,
//             jsonString: JSON.parse(jsonString),
//         });
//     } catch(err) {
//         console.log(err);
//     }
// }