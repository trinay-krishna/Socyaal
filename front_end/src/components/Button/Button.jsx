
import styles from './Button.module.css';

export default function Button( { text, onClick, disabled, width } ) {



    return(
            <button onClick={onClick} className={styles.button} disabled = { disabled } >{text}</button>
    );
}