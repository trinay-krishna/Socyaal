import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import PageNav from '../../components/PageNav/PageNav';
import Loading from '../Loading/Loading';

export default function Leaderboard() {

    const { quizID } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    const { page } = useParams();


    const [ leaderboard, setLeaderboard ] = useState([]);
    const [ totalPageCount, setTotalPageCount ] = useState(0);

    const leaderboardUrl = `${CLIENT_URL}/quiz/leaderboard/${quizID}`;

    useEffect( ( ) => {
        fetch(`${API_URL}/quiz/leaderboard/${quizID}/${page}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {

            if ( res.success ) {
                setLeaderboard(res.leaderboard);
                setTotalPageCount(res.totalPageCount);
            } else if ( res.auth === false ) {
                navigate('/');
            }
        } );

    }, [ page ] );
    
    if ( leaderboard.length === 0 ) return <Loading />;

    const pageIndex = page - 1;
    return (
        <div className={styles.mainContainer}>
            <table className={styles.lbTable}>
                <tr className={styles.mainHeader}>
                    <th className={`${styles.posHeader} ${styles.header}`}>Position</th>
                    <th className={`${styles.nameHeader} ${styles.header}`}>Name</th>
                    <th className={`${styles.pointsHeader} ${styles.header}`}>Points</th>
                    <th className={`${styles.endHeader} ${styles.header}`}>Endtime</th>
                </tr>

                {
                    leaderboard.map( (entry, index) => {
                        
                        const MAX_LEADERBOARD_ENTRIES = 10;
                        const position = index + pageIndex*MAX_LEADERBOARD_ENTRIES + 1;

                        const endDate = new Date(entry.endDate);
                        const hours = endDate.getHours();
                        const minutes = endDate.getMinutes();
                        const seconds = endDate.getSeconds();

                        const formattedTime = `${hours}:${minutes}:${seconds}`

                    return <tr className={styles.entryRow}>
                        <td>{position}</td>
                        <td>{entry.userName}</td>
                        <td>{entry.points}</td>
                        <td>{formattedTime}</td>
                    </tr> 
                    })
                }

                
            </table>
            <PageNav totalPages = {totalPageCount} currPage = {page} url = {leaderboardUrl}/>
            { console.log(leaderboard) }
        </div>
    );
}