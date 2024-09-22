import styles from './QuizCountdown.module.css';

export default function QuizCountdown( { time } ) {
    return(
        <div className={styles.quizContainer}>
            <div className={styles.mainContainer}>
                <p className={styles.quizText}>Quiz Starts in</p>
    
                <div className={styles.timerDiv}>
                    <div> Time Left: {time} </div>
                </div>
            </div>
        </div>
    )
}