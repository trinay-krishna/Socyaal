import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import Timer from "../../components/Timer/Timer";
import QuizStart from "./QuizComponents/QuizStart/QuizStart";
import QuizFinish from "./QuizComponents/QuizFinish/QuizFinish";
import Quiz404 from "./QuizComponents/Quiz404/Quiz404";
import Loading from "../Loading/Loading";

let socket;

export default function Quiz() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { quizID } = useParams();
    const navigate = useNavigate();

    const [ signal, setSignal ] = useState(-1);
    const [ questions, setQuestions ] = useState([]);
    const [ time, setTime ] = useState(-1);
    const [ questionIndex, setquestionIndex ] = useState(-1);
    const [ leaderboard, setLeaderboard ] = useState([]);
    const [ quizJoined, setQuizJoined ] = useState(false);



    useEffect( () => {
        if ( !socket ) {
            socket = io(`${API_URL}`, {
                withCredentials: true,
                autoConnect: false,
            });
        }
        socket.connect();
    
        socket.on('nextQuestion', newIndex => {
            setquestionIndex( () =>  newIndex);
        });

        socket.on('currentQuestion', index => {
                setquestionIndex(index);
        });

        socket.on('updateLeaderboard', leaderboard => {
            setLeaderboard(leaderboard);
        });

        socket.on('time', msg => {
            setTime(msg.time);
            setSignal(msg.signal);
        });

        socket.on('reconnectSocket', () => {
            window.location.reload();
        });

        socket.on('joinedQuiz', () => {
            setQuizJoined(true);
        });

        socket.emit('quizJoin', quizID);


        return () => {

            if ( socket && socket.connected ) {
                socket.disconnect();
            }
        }

    }, [] );
    
    useEffect( () => {

        fetch(`${API_URL}/quiz/${quizID}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            console.log(res);
            if( res.signal == 2 ) {
                setQuestions(res.questions)
                socket.emit('requestCurrentQuestion', quizID);
            }
            setSignal(res.signal);

        } )

    }, [ signal ] );

    function addPoints ( points ) {
        socket.emit('addPoints', quizID, points);
    }

    function nextQuestion() {
        socket.emit('requestNextQuestion', quizID)
    }

    function setAttempted() {
        socket.emit('attempted', quizID);
    }

    if ( signal === undefined ) {
        navigate('/');
    };

    if ( signal === -2 ) return <Quiz404 />;

    if ( !quizJoined ) return <Loading />;

    switch ( signal ) {
        case -1:
            return <Loading />;
        
        case 0: 
            return <div> Time Left is: {time} </div>
        
        case 1:
            return <QuizFinish time={time} />;
        
        case 2:
            return <QuizStart time = {time} leaderboard={leaderboard} questions={questions} addPoints={addPoints} nextQuestion={nextQuestion} questionIndex={questionIndex} setAttempted = {setAttempted} />;
        
    }
}