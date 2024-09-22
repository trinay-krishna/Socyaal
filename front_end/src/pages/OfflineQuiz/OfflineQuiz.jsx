import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizStart from '../Quiz/QuizComponents/QuizStart/QuizStart';
import QuizFinish from '../Quiz/QuizComponents/QuizFinish/QuizFinish';

export default function OfflineQuiz() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { quizID } = useParams();
    const navigate = useNavigate();

    const [ points, setPoints ] = useState(0);
    const [ leaderboard, setLeaderboard ] = useState([ { userName: 'You', points: 0 } ]);
    const [ questions, setQuestions ] = useState([]);
    const [ questionIndex, setQuestionIndex ] = useState(0);

    const [ quizFinish, setQuizFinish ] = useState(false);

    useEffect( ( ) => {
        fetch(`${API_URL}/quiz/${quizID}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( res.success ) {
                if ( res.signal == 0 || res.signal == 2 ) {
                    return navigate(`/quiz/${quizID}`);
                }

                if ( res.signal === undefined ) {
                    return navigate('/');
                }

                setQuestions(res.questions);
            }

        } );
    }, [] );

    function addPoints( questionPoints ) {
        setPoints(points + questionPoints);

        const newPoints = { ...leaderboard[0], points: points + questionPoints };
        setLeaderboard( [ newPoints ] );
    }

    function nextQuestion() {
        if ( questionIndex === questions.length - 1 ) {
            setQuizFinish(true);
            return;
        }
        setQuestionIndex(questionIndex + 1);
    }

    if ( quizFinish ) return <div><QuizFinish time={0} offlinePoints={points} /></div>


    return (
        <div>
            <QuizStart time={'No Time limit :D'} leaderboard={leaderboard} questions={questions} addPoints={addPoints} questionIndex={questionIndex} nextQuestion={nextQuestion} setAttempted={() => {}} />
        </div>
    );
}