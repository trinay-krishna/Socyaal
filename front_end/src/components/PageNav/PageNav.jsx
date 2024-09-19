import { Link, useNavigate } from 'react-router-dom';
import styles from './PageNav.module.css';

const PREV_DIRECTION = 'prev';
const NEXT_DIRECTION = 'next';

const MAX_PAGE = 5;

export default function PageNav( { currPage, url } ) {

    const highlightStyle = {
        'backgroundColor': 'black',
    };

    const totalPages = 8;
    if ( currPage > totalPages || currPage < 1 ) {
        return <div>Invalid Page</div>;
    }

    const pageSection = Math.ceil( currPage / MAX_PAGE );
    const pageSectionIndex = pageSection - 1;

    const pageSectionStart = 1 + pageSectionIndex * MAX_PAGE;
    const pageSectionEnd = pageSectionStart + MAX_PAGE;

    function handlePageSectionChange( direction ) {
        if ( direction == PREV_DIRECTION ) {
            window.location.href = `${url}/${pageSectionStart - 1}`
        }
        
        else if ( direction == NEXT_DIRECTION ) {
            window.location.href = `${url}/${pageSectionEnd}`
        }
    }

    const LinkComponents = [];
    function generatePages() {
        for(let i = pageSectionStart; i < pageSectionEnd; i++) {
            if ( i > totalPages ) {
                break;
            }

            LinkComponents.push(
                    <Link key={i} to={`${url}/${i}`} className={`${styles.pageLinks}`} style={ ( i == currPage ) ? highlightStyle : {} } > {i} </Link>
            );
        }
    }

    generatePages();

    return (
        <div>
            <div className={styles.pageContainer}>
                { ( pageSectionIndex > 0 ) && <button className={styles.sectionNav} onClick={ () => handlePageSectionChange(PREV_DIRECTION) }> { `<` } </button>}
                {
                    LinkComponents.map( ele => ele )
                }
                { ( pageSectionEnd < totalPages ) && <button className={styles.sectionNav} onClick={ () => handlePageSectionChange(NEXT_DIRECTION) }> { `>` } </button>}
            </div>
        </div>
    );
}