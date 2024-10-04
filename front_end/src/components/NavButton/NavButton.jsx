import { useNavigate } from 'react-router-dom';
import styles from './NavButton.module.css';

export default function NavButton({ src, text, to, onClick }) {
    const navigate = useNavigate();

    function handleClick() {
        if ( to ) {
            navigate(`${to}`);
        }
    }

    return(
        <button 
        className={styles.navButton}
        onClick={ onClick || handleClick }
        >
            <img src={src} />
            <p>{text}</p>
        </button>
    );
}