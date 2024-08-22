import { useState } from 'react';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import styles from './Post.module.css';

import Like from '../../assets/like.svg';
import Dislike from '../../assets/dislike.svg';


const MAX_LENGTH = 4;

export default function Post() {

    const [ readMore, setReadMore ] = useState(false);
    const [ like, setLike ] = useState(false);
    const [ dislike, setDislike ] = useState(false);

    const arr = ['/bg.gif', '/invalid.gif','/bg.gif', '/invalid.gif'];
    const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione repellendus dolore, voluptas neque velit odio omnis, odit doloribus incidunt itaque cum tenetur ducimus vero quis error adipisci minus, facilis aspernatur?\nsit amet consectetur\nsit amet consectetur\nsit amet consectetur\n";
    const contentParas = content.split('\n');


    const paragraphStyle = {
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        display: '-webkit-box'
    };

    function handleFeedback( type ) {
        if ( type == 'dislike' ) {
            if ( like )
                setLike(false);
            setDislike(!dislike);
        } else {
            if ( dislike )
                    setDislike(false);
            
            setLike(!like);
        }
    }
    
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
                <ul style={ !readMore ? paragraphStyle : undefined }>
                    {
                        contentParas.map( (line, index )=> <li key={index} >{line}</li> )
                    }
                </ul>
                { !readMore && contentParas.length >= MAX_LENGTH &&  <button onClick={() => setReadMore(true)} >Read More</button>}
                { readMore && <button onClick={() => setReadMore(false)} >Read Less</button> }
            </div>
            <div className= {styles.postButton}>
                    <div className={styles.likeDiv}>
                        <button className={`${styles.likeButton} ${ like && styles.highlight }`} onClick={() => handleFeedback('like')}><img src={Like} alt="Like-Button" /></button>
                        <div className={styles.likeInfo}>
                            <p>Like</p>
                            <p>23k</p>
                        </div>
                    </div>

                    <div className={styles.dislikeDiv}>
                        <button className={`${styles.dislikeButton} ${ dislike && styles.highlight }`} onClick={() => handleFeedback('dislike')}><img src={Dislike} alt="Dislike-Button" /></button>
                        <div className={styles.dislikeInfo}>
                            <p>Dislike</p>
                            <p>11k</p>
                        </div>
                    </div>

            </div>
        </div>
    );
}