import styles from './Loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div class={styles.loader}>Loading...</div>
        </div>
    )
}