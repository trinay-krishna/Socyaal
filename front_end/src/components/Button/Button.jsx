
import styles from './Button.module.css';

export default function Button( { text, onClick, disabled, type } ) {



    return(
            <button onClick={onClick} className={styles.button} disabled = { disabled } type={type}>{text}</button>
    );
}