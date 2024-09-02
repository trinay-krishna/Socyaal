import { useState } from "react";
import Timer from "../../../components/Timer/Timer";

const CORRECT_ANSWER_COLOR = 'green';
const WRONG_ANSWER_COLOR = 'red';

export default function QuizStart( { endTime, onTimeUp, questions, addPoints, nextQuestion, questionIndex, setAttempted } ) {

    const [ selectedOption, setSelectedOption ] = useState(-1);
    console.log("questions are", questions);
    let correctAnswerIndex =  getCorrectAnswerIndex();

    function getCorrectAnswerIndex() {
        return (questionIndex != -1 && questionIndex < questions.length) ? questions[questionIndex].correctAnswer : -2;
    }

    function getOptionStyle( optionIndex ) {
        if ( selectedOption === optionIndex ) {
            if ( correctAnswerIndex === optionIndex ) 
                return { 'color' : CORRECT_ANSWER_COLOR };

            return { 'color' : WRONG_ANSWER_COLOR };
        }

        return {};
    }

    function handleOptionClick(optionIndex) {
        console.log('CLicked')
        if ( optionIndex === correctAnswerIndex ) {
            addPoints(questions[questionIndex].points);
            console.log('CORRECT!!!');
        }
        setAttempted();
        setSelectedOption(optionIndex);
        
    }

    function handleNextQuestion() {

        setSelectedOption(-1);

        nextQuestion();
    }
    console.log('ee');
    if ( !( questionIndex !== -1 && questionIndex < questions.length) ) return null;

    return (
        <div>
            <Timer endTime={endTime} onTimeUp={onTimeUp} />
            <div>
                { console.log(questionIndex, 'qindex') }
                <div> Question: {questions[questionIndex].questionText} </div>
                {
                    questions[questionIndex].options.map( ( option, optionIndex ) => (
                    <button 
                        disabled = { selectedOption != -1 }
                        key={optionIndex}
                        style={ getOptionStyle(optionIndex) }  
                        onClick={ () => handleOptionClick(optionIndex) } > 
                        
                        {option} </button>
                    )
                    )
                }
                <div>
                    <button onClick={handleNextQuestion} disabled = { selectedOption === -1 } >Next Question</button>
                </div>
            </div>

        </div>
    )

}