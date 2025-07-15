import { useState } from 'react';
import Button from '../../components/Button/Button';
import QuizInput from '../../components/QuizInput/QuizInput';
import styles from './QuizCreate.module.css';
import Loading from '../Loading/Loading';
import { getAPIURL, checkAuth } from '../../utils';
import { useNavigate } from 'react-router-dom';

const convertToDateTimeLocalString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const MINIMUM_QUIZ_DURATION = 1;

function checkDates(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const currDate = new Date();


    if ( endDate - startDate <= 0 ) {
        return 'Invalid End Date, End Date must come after Start Date';
    }

    if ( startDate - currDate < MINIMUM_QUIZ_DURATION * 60 * 1000 ) {
        return `Quiz must be scheduled atleast ${MINIMUM_QUIZ_DURATION} minutes from the current time!`;
    }

    return true;
}

export default function QuizCreate() {

    const navigate = useNavigate();

    const [ quizName, setQuizName ] = useState('');
    const [ startDate, setStartDate ] = useState(convertToDateTimeLocalString(new Date( Date.now() + 5 * 60 * 1000 )));
    const [ endDate, setEndDate ] = useState(convertToDateTimeLocalString(new Date(Date.now() + 6 * 60 * 1000)));

    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');


    function handleQuizNameChange( event ) {
        setQuizName(event.target.value);
    }

    function handleStartDateChange( event ) {
        setStartDate(event.target.value);
    }

    function handleEndDateChange( event ) {
        setEndDate(event.target.value);
    }

    function handleSubmit( event ) {
        event.preventDefault();

        const isValid = checkDates(startDate, endDate);
        if ( isValid === true ) {
            setError('');
        } else {
            setError(isValid);
            return;
        }

        const startDateObj = new Date(startDate).getTime();
        const endDateObj = new Date(endDate).getTime();
        const quizData = {
            quizName: quizName.trim(),
            startDate: startDateObj,
            endDate: endDateObj,
            questions: [],
        };

        setIsLoading(true);
        fetch(`${getAPIURL()}/quiz/createQuiz`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success ) {
                return;
            }

            navigate('/quiz/quizList');
        } )

    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContainer} >
           { isLoading && <Loading backdrop={true} />}
                <h1 className={styles.heading}>Create Quiz</h1>

                <form onSubmit={handleSubmit} className={styles.quizForm}>
                    <QuizInput type={'text'} labelText={'Quiz Name: '} name={'quizName'} value={quizName} onChange={handleQuizNameChange}/>

                    <QuizInput type={'datetime-local'} labelText={'Start Date: '} name={'quizStart'} value={startDate} onChange={handleStartDateChange}/>
                    <QuizInput type={'datetime-local'} labelText={'End Date: '} name={'quizEnd'} value={endDate} onChange={handleEndDateChange}/>

                    <div className={styles.buttonContainer}>
                        <Button text={'Create AI Quiz'}  />
                    </div>

                </form>
                <h2 className={styles.Note}>Note: Choose a meaningful quiz name as the AI quiz is generated based on it</h2>
                <div>
                    {error && error}
                </div>
            </div>
        </div>
    );
}