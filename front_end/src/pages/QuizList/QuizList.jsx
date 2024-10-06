import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './QuizList.module.css';
import ListElement from "./ListElement/ListElement";
import Loading from "../Loading/Loading";
import Button from "../../components/Button/Button";

export default function QuizList() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [ isLoading, setLoading ] = useState(true);

    const [ quizList, setQuizList ] = useState([]);
    const [ selectedTab, setSelectedTab ] = useState(0);

    const selectedStyle = {
        backgroundColor: 'var(--primary)',
    };

    useEffect( () => {
        fetch(`${API_URL}/quiz/quizList`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( res.success ) {
                setQuizList( res.quizList );
            } else {
                navigate('/');
            }

            setLoading(false);
        } )
    }, [] );

    function handleCreateQuiz() {
        navigate('/quiz/createQuiz');
    }

    if ( isLoading ) return <Loading />;

    return (
        <div className={styles.container}>
                <div className={styles.buttonContainer}>
                    <Button text={'Create AI Quiz'} onClick={handleCreateQuiz}/>
                </div>
            <div className={styles.listContainer} >
                <div className={styles.listTabs}>
                    {
                        quizList.map( ({ type }, index) => <div className={styles.tab} key={index} style={ ( index === selectedTab ) ? selectedStyle : {} } onClick={() => setSelectedTab(index)}> {type} </div> )
                    }
                </div>
                <div className={styles.tabList} >
                    {
                        quizList[selectedTab].list.map( quiz => <ListElement name={quiz.quizName} startDate = {quiz.startDate} quizID = {quiz._id}/> )
                    }
                </div>
            </div>
        </div>
    )

}