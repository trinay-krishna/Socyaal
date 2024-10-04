import styles from './SearchBar.module.css';

export default function SearchBar( { width, onChange, inputValue } ) {
    return (
        <div className={styles.searchBar}>
            <form style={ { width: width } }>
                <span className={styles.search}><img src="/searchicon.svg" alt="" /></span>
                <input className={styles.searchInput} type="text" placeholder='Search' onChange={onChange} value={inputValue} />
            </form>
        </div>
    )
}