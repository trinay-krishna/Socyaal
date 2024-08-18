import styles from './NavButton.module.css';

export default function NavButton({ src, text }) {
    return(
        <button className={styles.navButton}>
            <img src={src} />
            <p>{text}</p>
        </button>
    );
}