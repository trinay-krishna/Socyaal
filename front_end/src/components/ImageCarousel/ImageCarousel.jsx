import { useState } from 'react';
import styles from './ImageCarousel.module.css';
import SliderArrow from '../SliderButtons/SliderArrow';

export default function ImageCarousel( { src } ) {
    const [ slide, setSlide ] = useState(0);


    function nextSlide() {
        setSlide((prevSlide) => (prevSlide + 1)%src.length);
    }

    function prevSlide() {
        setSlide((prevSlide) => (prevSlide - 1 + src.length)%src.length);
    }
    return(
        <div className={styles.wrapper}>
            <div className={styles.carousel} style={ { transform: `translate(${-100 * slide}%)` } }>
                {
                    src.map((ele, index) => ( ele.mediaType != 'video' ) ? 
                    <img key={index} src={ele.mediaUrl} className={styles.slide} /> : 
                    <video key={index} className={styles.slide} controls> 
                        <source src={ele.mediaUrl} />
                    </video>  
                )
                }
            </div>
            <SliderArrow direction={'right'} handleClick={nextSlide}/>
            <SliderArrow direction={'left'} handleClick={prevSlide}/>
        </div>
    );
}