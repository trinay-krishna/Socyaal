const Quiz = require('../models/Quiz');
const Participant = require('../models/Participant');

let leaderboard = {};

function addQuiz( quizID, endDate ) {
    leaderboard[quizID] = {};

    const BUFFER = 30000;
    const timeRemaining = endDate - Date.now();

    setTimeout( async () => {
        const participantEntries = Object.entries(leaderboard[quizID]);

        await Promise.all( participantEntries.map( ( [ userID, { points, endTime } ] ) => {
            const participantInstance = new Participant({
                userID,
                quizID,
                points,
                endDate: endTime,
            });

            return participantInstance.save();
        } ) );

        console.log('Leaderboard commited to Database, clearing cache');
        delete leaderboard[quizID];
    },  ( timeRemaining + BUFFER ) ); 
}

function setupSocket( io ) {

    function getLeaderboard( quizID ) {
        const userIDs = Object.entries(leaderboard[quizID])
            .sort( ([, userA], [, userB]) => userB.points - userA.points || userA.endTime - userB.endTime )
            .map( ( [userID, { points }] ) => ({ userID, points }) );
        
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

        socket.on('quizJoin', async ( quizID ) => {
            console.log('joining', quizID);

            socket.join(quizID);
            const userID = getUserID(socket);
            
            if (  leaderboard[quizID] && !leaderboard[quizID][userID] ) {
                console.log('Leaderboard is', leaderboard);
                console.log('init leaderboard');
                leaderboard[quizID][userID] = { points: 0, currQuestion: 0, attempted: false, endTime: Infinity };
            }

            console.log(JSON.stringify(leaderboard));
        });

        socket.on('addPoints', ( quizID, points ) => {
            const userID = getUserID(socket);
            if ( !leaderboard[quizID] || !leaderboard[quizID][userID] )
                    return;

            leaderboard[quizID][userID].points += points;
            leaderboard[quizID][userID].endTime = Date.now();
            
            const sortedLeaderboard = getLeaderboard(quizID);
            socket.emit('updateLeaderboard', sortedLeaderboard);
            console.log(JSON.stringify(leaderboard));
        });

        socket.on('requestNextQuestion', ( quizID ) => {
            const userID = getUserID(socket);
            if ( !leaderboard[quizID] || !leaderboard[quizID][userID] )
                return;
            if ( leaderboard[quizID][userID].attempted ) {
                leaderboard[quizID][userID].currQuestion += 1;
                leaderboard[quizID][userID].attempted = false;
            }

            socket.emit('nextQuestion', leaderboard[quizID][userID].currQuestion);
        });
        
        socket.on('requestCurrentQuestion', quizID => {
            const userID = getUserID(socket);
            console.log(leaderboard, leaderboard[quizID]);
            if ( !leaderboard[quizID] || !leaderboard[quizID][userID] )
                return;

            if ( leaderboard[quizID][userID].attempted ) {
                leaderboard[quizID][userID].currQuestion += 1;
                leaderboard[quizID][userID].attempted = false;
            }
            socket.emit('currentQuestion', leaderboard[quizID][userID].currQuestion);
        });

        socket.on('attempted', quizID => {
            const userID = getUserID(socket);
            if ( !leaderboard[quizID] || !leaderboard[quizID][userID] )
                return;

            leaderboard[quizID][userID].attempted = true;
        });

        socket.on('disconnect', () => {
            console.log('DISCONNECTED!');
        });

    });


    
}

module.exports = { setupSocket, addQuiz };