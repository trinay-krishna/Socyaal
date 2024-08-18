import styles from './SliderArrow.module.css';

export default function SliderArrow( { direction, handleClick } ) {

    return (
        <button onClick={() => handleClick()}><img src={`/menu-${direction}.svg`} alt="" className= {styles.icon} style={ { [direction] : '0' } } /></button>
    );
}