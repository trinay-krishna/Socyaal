import styles from './Leaderboard.module.css';

export default function Leaderboard( { leaderboard } ) {
    return (
        <div className={styles.leaderBoard}>
            <p className={styles.leaderboardText}>Leaderboard</p>
            {
                ( leaderboard.length != 0 ) ?
                leaderboard.map(  user =>  {
                    return (
                        <div
                            className={styles.leaderboardEntry}
                            key={user.userName}>
                                <span className={styles.userName}>{user.userName}</span> 
                                <span className={styles.points}>{user.points}</span> 
                        </div>
                    );
                }
                ) :
                <div>Waiting for responses…</div>
            }



        </div>
    )
}