import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import styles from './ListElement.module.css';

export default function ListElement( { name, startDate, quizID } ) {
    const navigate = useNavigate();

    const formattedDate = new Date(startDate).toLocaleString('default', { day: '2-digit',month: 'short' });
    const [hours, minutes] = [new Date(startDate).getHours(), new Date(startDate).getMinutes()];

    function nagivateToQuiz( quizID ) {
        navigate(`/quiz/${quizID}`);
    }

    return (
    <div className={styles.listItem}>
        <div>
             {name} 
        </div>
        <button className={styles.listButton}>
            {
            ( !startDate ) ? 
                <Button text = "Play" onClick={ () => nagivateToQuiz( quizID ) }/>
                :
                <div className={styles.startDate}>
                    Starts at: { formattedDate } { hours }:{minutes} 
                </div>
            }
        </button>
    </div>
    );
}