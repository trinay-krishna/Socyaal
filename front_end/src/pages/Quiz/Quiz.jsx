import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import Timer from "../../components/Timer/Timer";
import QuizStart from "./QuizComponents/QuizStart";

let socket;

export default function Quiz() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { quizID } = useParams()

    const [ signal, setSignal ] = useState(-1);
    const [ questions, setQuestions ] = useState([]);
    const [ timerDate, setTimerDate ] = useState(Date.now());
    const [ questionIndex, setquestionIndex ] = useState(-1);
    const [ leaderboard, setLeaderboard ] = useState([]);
    console.log(questionIndex, 'it is');

    const [ updater, setUpdater ] = useState(false);

    function connectSocket() {
        if ( !socket ) {
            socket = io(`${API_URL}`, {
                withCredentials: true,
                autoConnect: false,
            });
        }
        socket.connect();
    
        socket.on('nextQuestion', newIndex => {
            console.log('setting to ', newIndex);
            setquestionIndex( () =>  newIndex);
        });

        socket.on('currentQuestion', index => {
                console.log('currr', index);
                setquestionIndex(index);
        });

        socket.on('updateLeaderboard', leaderboard => {
            console.log(leaderboard);
            setLeaderboard(leaderboard);
        });

        socket.emit('quizJoin', quizID);

        socket.emit('requestCurrentQuestion', quizID);


    }
    
    useEffect( () => {

        fetch(`${API_URL}/quiz/${quizID}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            console.log(res);
            if( res.signal === 0 )
                setTimerDate(() => (new Date(res.startDate)).getTime()  );
            else if( res.signal == 2 ) {
                setTimerDate(() => (new Date(res.endDate)).getTime()  );
                console.log('questions', res.questions);
                setQuestions(res.questions)
                connectSocket();
            }
            setSignal(res.signal);

        } )

        return () => {
            if ( socket && socket.connected )
                socket.disconnect();
        }
    }, [ updater ] );

    function addPoints ( points ) {
        socket.emit('addPoints', quizID, points);
    }

    function nextQuestion() {
        socket.emit('requestNextQuestion', quizID)
    }

    function setAttempted() {
        socket.emit('attempted', quizID);
    }

    console.log('lel is ', questionIndex);
    switch ( signal ) {
        case -1:
            return <div>LOADING</div>;
        
        case 0: 
            return <Timer endTime={timerDate} onTimeUp={() => setUpdater(!updater)} />
        
        case 1:
            return <div>Quiz Finished</div>
        
        case 2:
            return <QuizStart endTime={timerDate} onTimeUp={() => setUpdater(!updater)} questions={questions} addPoints={addPoints} nextQuestion={nextQuestion} questionIndex={questionIndex} setAttempted = {setAttempted} />
        
        default:
            return <div> Invalid Signal </div>
    }
}