import NavButton from '../../components/NavButton/NavButton';
import Post from '../../components/Post/Post';
import styles from './Home.module.css';

export default function Home() {
    return(
        <div className={styles.homeWrapper}>
            <div className={styles.logo}>
                <img src="/Logo.png" alt="" height='100%'/>
                <p>Socyaal</p>
            </div>
            <div className={styles.searchBar}>
                <form>
                    <span className={styles.search}><img src="/searchicon.svg" alt="" /></span>
                    <input className={styles.searchInput} type="text" placeholder='Search'/>
                </form>
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
                </nav>
            </div>
            <div className={styles.posts}>
                <Post />
            </div>
            <div className={styles.friends}>
                FRIENDS
            </div>
        </div>
    );
}