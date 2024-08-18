import ImageCarousel from '../ImageCarousel/ImageCarousel';
import styles from './Post.module.css';

export default function Post() {
    const arr = ['/bg.gif', '/invalid.gif','/bg.gif', '/invalid.gif'];

    
    return(
        <div className={styles.postContainer}>
            <div className={styles.profileHeader}>
                <img src="/tempProfile.jpg" alt="" className={styles.profileImage}/>
                <div className={styles.userInfo}>
                    <p>Profile Name</p>
                    <p>Date</p>
                </div>
            </div>
            <div className={styles.carousel}>
                <ImageCarousel src={arr}/>
            </div>
            <div className={styles.content}>
                <p>Heading</p>
                <p style={ { 
                    // WebkitLineClamp: 5,
                    // WebkitBoxOrient: 'vertical',
                    // overflow: 'hidden',
                    // display: '-webkit-box'
                 } }>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione repellendus dolore, voluptas neque velit odio omnis, odit doloribus incidunt itaque cum tenetur ducimus vero quis error adipisci minus, facilis aspernatur?
                    {/* <br />sit amet consectetur<br />sit amet consectetur<br />sit amet consectetur<br />sit amet consectetur<br />sit amet consectetur<br /> */}
                </p>
                <button>Read More</button>
            </div>
            <div className= {styles.postButton}>Buttons</div>
        </div>
    );
}