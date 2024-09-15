import { useNavigate } from 'react-router-dom';
import styles from './NavButton.module.css';

export default function NavButton({ src, text, to }) {
    const navigate = useNavigate();

    function handleClick() {
        if ( to ) {
            navigate(`${to}`);
        }
    }

    return(
        <button 
        className={styles.navButton}
        onClick={handleClick}
        >
            <img src={src} />
            <p>{text}</p>
        </button>
    );
}