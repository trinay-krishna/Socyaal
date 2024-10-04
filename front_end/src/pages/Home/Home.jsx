import { useState } from 'react';
import CommunityJoinDialog from '../../components/CommunityJoinDialog/CommunityJoin';
import CommunityList from '../../components/CommunityList/CommunityList';
import NavButton from '../../components/NavButton/NavButton';
import Post from '../../components/Post/Post';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Home.module.css';

export default function Home() {
    const [ showDialog, setShowDialog ] = useState({});


    function openDialog( community ) {
        setShowDialog({
            community,
            show: true,
        });
    }

    function closeDialog() {
        setShowDialog({});
    }

    return(
        <div className={styles.homeWrapper}>
            <div className={styles.logo}>
                <img src="/Logo.png" alt="" height='100%'/>
                <p>Socyaal</p>
            </div>
            <div className={styles.searchBarContainer}>
                <SearchBar width={'40%'} />
            </div>
            <div className={styles.profile}>
                <span className={styles.iconsContainer}>
                    <button><img src="/notif.svg" alt=""/></button>
                    <button><img src="/Profile.svg" alt=""/></button>
                </span>
            </div>
            <div className={styles.navigationContainer}>
                <nav className={styles.navigation}>
                    <NavButton src={'/Profile.svg'} text={'Home'} />
                    <NavButton src={'/quiz.svg'} text={'Trivia'} to={'/quiz/quizList'} />
                </nav>
                <CommunityList setDialog={openDialog}/>
            </div>
            <div className={styles.posts}>
                <Post />
            </div>
            <div className={styles.friends}>
                FRIENDS
            </div>
            { showDialog.community && <CommunityJoinDialog community={showDialog.community} isOpen={showDialog.show} closeDialog={closeDialog}/> }
        </div>
    );
}