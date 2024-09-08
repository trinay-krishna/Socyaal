import { useState } from "react";
import Timer from "../../../../components/Timer/Timer";
import QuizFinish from "../QuizFinish/QuizFinish";
import styles from './QuizStart.module.css';


const CORRECT_ANSWER_COLOR = 'green';
const WRONG_ANSWER_COLOR = 'red';

export default function QuizStart( { time, leaderboard, questions, addPoints, nextQuestion, questionIndex, setAttempted } ) {

    const [ selectedOption, setSelectedOption ] = useState(-1);
    let correctAnswerIndex =  getCorrectAnswerIndex();

    function getCorrectAnswerIndex() {
        return (questionIndex != -1 && questionIndex < questions.length) ? questions[questionIndex].correctAnswer : -2;
    }

    function getOptionStyle( optionIndex ) {
        if ( selectedOption === optionIndex ) {
            if ( correctAnswerIndex === optionIndex ) 
                return { 'backgroundColor' : CORRECT_ANSWER_COLOR };

            return { 'backgroundColor' : WRONG_ANSWER_COLOR };
        }

        return {};
    }

    function handleOptionClick(optionIndex) {
        if ( optionIndex === correctAnswerIndex ) {
            addPoints(questions[questionIndex].points);
        }
        setAttempted();
        setSelectedOption(optionIndex);
        
    }
    console.log(leaderboard);

    function handleNextQuestion() {

        setSelectedOption(-1);

        nextQuestion();
    }
    if ( questionIndex >= questions.length ) return <QuizFinish time={time} />;

    if ( questionIndex === -1 ) return null;

    return (
        <div className={styles.QuizContainer}>
            <div className={styles.mainContainer}>
                <div className={styles.leaderBoard}>
                    {leaderboard.map( user => <div key={user.userID}> {user.userID} - {user.points} </div> )}
                </div>
                <div className={styles.questionWrapper}>
                    <div className={styles.timer}> Time Left: {time} </div>
                    <div className={styles.questionDiv}> Question: {questions[questionIndex].questionText} </div>
                    <div className={styles.optionContainer}>
                        {
                            questions[questionIndex].options.map( ( option, optionIndex ) => (
                            <button
                                className= {styles.optionButton}
                                disabled = { selectedOption != -1 }
                                key={optionIndex}
                                style={ getOptionStyle(optionIndex) }
                                onClick={ () => handleOptionClick(optionIndex) } >
                                {option} </button>
                            )
                            )
                        }
                    </div>
                    <div className={styles.nextDiv}>
                        <button onClick={handleNextQuestion} disabled = { selectedOption === -1 } >Next Question</button>
                    </div>
                </div>
            </div>
        </div>
    )

}