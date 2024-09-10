import styles from './Quiz404.module.css';

export default function Quiz404() {
    return (
        <div className={styles.container}>
            <div className={styles.mainContainer}>
                <img
                src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTlsYWR1djl1aWQxbmh6ZGdzZzF4bDJtaDcxN2RhZzd2cW9ocWw2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/llfVoXzlEppScDN9V5/giphy.gif"
                alt="No Existo ;)"
                />
                <p>Hmm... It seems there's no quiz here.</p>
            </div>
        </div>
    )
}