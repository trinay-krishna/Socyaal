import { useState } from "react";
import Timer from "../../../../components/Timer/Timer";
import QuizFinish from "../QuizFinish/QuizFinish";
import styles from './QuizStart.module.css';
import Leaderboard from "../Leaderboard/Leaderboard";


const CORRECT_ANSWER_COLOR = 'green';
const WRONG_ANSWER_COLOR = 'red';

const CORRECT_ANSWER_BORDER = '2px solid green';

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

        if ( selectedOption != -1 && optionIndex === correctAnswerIndex ) {
            return { 'border' : CORRECT_ANSWER_BORDER };
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
                <Leaderboard leaderboard={leaderboard}/>
                <div className={styles.questionWrapper}>
                    <div className={styles.timer}> Time Left: {time} </div>
                    <div className={styles.questionDiv}>{questionIndex + 1}/{questions.length} Question: {questions[questionIndex].questionText} </div>
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
                        <button onClick={handleNextQuestion} disabled = { selectedOption === -1 } >
                            { questionIndex === ( questions.length - 1 ) ? <div> Finish Quiz </div>
                            :
                            <div>Next Question</div>
                            }

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}