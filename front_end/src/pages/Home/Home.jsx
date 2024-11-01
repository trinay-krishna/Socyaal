import { useEffect, useState } from 'react';
import CommunityJoinDialog from '../../components/CommunityJoinDialog/CommunityJoin';
import CommunityList from '../../components/CommunityList/CommunityList';
import NavButton from '../../components/NavButton/NavButton';
import Post from '../../components/Post/Post';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Home.module.css';
import Loading from '../Loading/Loading';
import { checkAuth, getAPIURL } from '../../utils.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';

export default function Home() {
    const API_URL = getAPIURL();
    const navigate = useNavigate();

    const [ showDialog, setShowDialog ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ communities, setCommunities ] = useState([]);

    const [ posts, setPosts ] = useState([]);

    useEffect ( ( ) => {
        setIsLoading(true);
        fetch(`${API_URL}/community/get-user-communities`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success )
                return;
            console.log(res.communities);
            setCommunities(res.communities);
            
        } )
        .finally( () => setIsLoading(false) );
    }, [] );

    useEffect( ( ) => {
        fetch(`${API_URL}/post/get-posts/0`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success )
                return;
            console.log(res.posts);
            setPosts(res.posts);
        } )
    }, [] )

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
                <div className={styles.communityCreate}>
                    <Button text={'Create Community'} onClick={ () => navigate('/community/create_community') }/>
                </div>
            </div>
            <div className={styles.posts}>
                <div className={styles.createPostContainer}>
                    <Button text={'Create Post'} onClick={ () => navigate( '/post/create_post' ) }/>
                </div>
                {
                    posts.map( post => <Post postIntance={post} key={post._id}/> )
                }
            </div>
            <div className={styles.friends}>
                FRIENDS
            </div>
            { isLoading && <Loading backdrop={true}/>}
            { showDialog.community && <CommunityJoinDialog userCommunities = {communities} setUserCommunities={setCommunities} community={showDialog.community} isOpen={showDialog.show} closeDialog={closeDialog}/> }
        </div>
    );
}