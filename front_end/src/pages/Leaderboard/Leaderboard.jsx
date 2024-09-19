import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import PageNav from '../../components/PageNav/PageNav';

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

    return (
        <div className={styles.mainContainer}>
            LEADERBOARD
            <PageNav totalPages = {totalPageCount} currPage = {page} url = {leaderboardUrl}/>
            { console.log(leaderboard) }
        </div>
    );
}