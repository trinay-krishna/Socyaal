const Quiz = require('../models/Quiz');
const Participant = require('../models/Participant');

function setupSocket( io ) {

    io.use( (socket, next) => {
        const session = socket.request.session;
        console.log(session);
        if ( session && session.passport && session.passport.user ) {
            next();
        } else {
            next(new Error('Not authenticated!'));
        }
    } );
    
    let leaderboard = {};

    function getLeaderboard( quizID ) {
        const userIDs = Object.entries(leaderboard[quizID])
            .sort( ([, userA], [, userB]) => userB.points - userA.points )
            .map( ( [userID] ) => userID );
        
        return userIDs;
        
    }

    function getUserID(socket) {
        const session = socket.request.session;
        console.log(session);
        const userID = session.passport.user;
        return userID;
    }

    io.on('connection', socket => {
        console.log(`${socket.id} connected!`);

        socket.on('quizJoin', ( quizID ) => {
            const userID = getUserID(socket);
            if ( !leaderboard[quizID] ) {
                leaderboard[quizID] = {};
                
                Quiz.findOne({_id: quizID })
                .then( quiz => {
                    
                    const BUFFER = 30000;
                    const endDate = ( new Date(quiz.endDate) ).getTime();
                    const timeRemaining = endDate - Date.now() + BUFFER;

                    setTimeout(async () => {
                        
                        const participantEntries = Object.entries(leaderboard[quizID]);

                        await Promise.all( participantEntries.map( ( [ userID, { points } ] ) => {

                            const participantInstance = new Participant({
                                userID,
                                quizID,
                                points,
                                endDate: endDate,
                            });

                            

                            return participantInstance.save();
                        } ) );

                        delete leaderboard[quizID];


                    }, timeRemaining );

                } )
                .catch(err => console.error(err));
            }
            
            if ( !leaderboard[quizID][userID] ) {
                leaderboard[quizID][userID] = { points: 0, currQuestion: 0, attempted: false, };
            }

            console.log(JSON.stringify(leaderboard));
        });

        socket.on('addPoints', ( quizID, points ) => {
            const userID = getUserID(socket);
            leaderboard[quizID][userID].points += points;
            
            const sortedLeaderboard = getLeaderboard(quizID);
            socket.emit('updateLeaderboard', sortedLeaderboard);
            console.log(JSON.stringify(leaderboard));
        });

        socket.on('requestNextQuestion', ( quizID ) => {
            const userID = getUserID(socket);
            console.log(userID);
            if ( leaderboard[quizID][userID].attempted ) {
                leaderboard[quizID][userID].currQuestion += 1;
                leaderboard[quizID][userID].attempted = false;
            }

            socket.emit('nextQuestion', leaderboard[quizID][userID].currQuestion);
        });
        
        socket.on('requestCurrentQuestion', quizID => {
            const userID = getUserID(socket);

            if ( leaderboard[quizID][userID].attempted ) {
                leaderboard[quizID][userID].currQuestion += 1;
                leaderboard[quizID][userID].attempted = false;
            }
            socket.emit('currentQuestion', leaderboard[quizID][userID].currQuestion);
        });

        socket.on('attempted', quizID => {
            const userID = getUserID(socket);

            leaderboard[quizID][userID].attempted = true;
        });

        socket.on('disconnect', () => {
            console.log('DISCONNECTED!');
        });

    });


    
}

module.exports = setupSocket;