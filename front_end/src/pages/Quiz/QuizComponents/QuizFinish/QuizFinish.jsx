import { useNavigate, useParams } from 'react-router-dom';
import styles from './QuizFinish.module.css';

export default function QuizFinish( { time, offlinePoints } ) {

    const { quizID } = useParams();
    const navigate = useNavigate();

    function handleLeaderboardClick() {
        navigate(`/quiz/leaderboard/${quizID}/1`);
    }

    function handlePlayOfflineClick() {
        if ( offlinePoints ) {
            return window.location.reload();
        }

        navigate(`/quiz/offline/${quizID}`)
    }

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
                    <button onClick={handlePlayOfflineClick}>Play offline?</button>
                    <button onClick={handleLeaderboardClick}>Leaderboard</button>

                    { ( offlinePoints ) && <div> Your points are: {offlinePoints} </div> }
                </div>
            }
        </div>
    </div>
)

}