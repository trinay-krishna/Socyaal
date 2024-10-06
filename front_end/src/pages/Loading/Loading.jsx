import styles from './Loading.module.css';

export default function Loading( { backdrop, wrapContainer } ) {

    const style = {
        'backgroundColor': 'rgb(34, 42, 55, .5)',
        'width': '100%',
        'min-height': '100%',
        'position': 'absolute',
        'zIndex': '999',
    };

    return (
        <div className={styles.container} style={ ( backdrop ) ? style : {} }>
            <div class={styles.loader}>Loading...</div>
        </div>
    )
}