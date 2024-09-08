import styles from './QuizFinish.module.css';

export default function QuizFinish( { time } ) {

return(
    <div className={styles.quizFinishContainer}>
        <div className={styles.mainContainer}>
            <p className={styles.quizFinishedText}>Quiz Finished!</p>
            {
                ( time > 0 ) ?
                <div className={styles.timerDiv}>
                    <p>Full leaderboard and offline play will be available after quiz ends!</p>
                    <div> Time Left: {time} </div>
                </div> :
                <div className={styles.playDiv}>
                    <button>Play offline?</button>
                    <button>Leaderboard</button>
                </div>
            }
        </div>
    </div>
)

}