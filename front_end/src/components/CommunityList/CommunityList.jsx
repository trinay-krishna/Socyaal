import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import styles from './CommunityList.module.css';
import NavButton from '../NavButton/NavButton';

export default function CommunityList( { setDialog } ) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [ communities, setCommunities ] = useState([]);
    const [ queryResults, setQueryResults ] = useState([]);

    const [ searchQuery, setSearchQuery ] = useState('');

    useEffect ( () => {
        fetch(`${API_URL}/community/get-popular-communities`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then ( res => {
            if ( res.success ) {
                setCommunities(res.communities);
            }
        } )
    }, [] );

    useEffect( ( ) => {

        const debounceTimer = setTimeout( ( ) => {
            if ( !searchQuery ) return;

            console.log('Request sent! for query', searchQuery);

            fetch(`${API_URL}/community/search-community`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchQuery,
                }),
            })
            .then( res => res.json() )
            .then( res => {
                if ( res.success ) {
                    setQueryResults(res.queryResult);
                }
            } );

        }, 300 );

        return () => clearTimeout(debounceTimer);

    }, [searchQuery] );

    function handleSearchBarChange( event ) {
        setSearchQuery(event.target.value);
    }

    function handleCommunitySelect( community ) {
        setDialog(community);
    }

    return (
        <div className={styles.communityListContainer}>
            <h2 className={styles.heading}>Communities</h2>
            <div className={styles.searchBarContainer}>
                <SearchBar width={'80%'} onChange = {handleSearchBarChange} inputValue = {searchQuery}/>
            </div>
            <div>
                
                { !searchQuery && <h2 className={styles.popular_communities}>Popular Communities</h2> }
                {
                    ( !searchQuery ) ? communities.map( ( ele, index ) => <NavButton key={index} src={ele.imgURL} text={ele.name} onClick={() => handleCommunitySelect(ele)}/> )
                    : queryResults.map( ( ele, index ) => <NavButton key={index} src={ele.imgURL} text={ele.name} onClick={() => handleCommunitySelect(ele)}/> )
                }


                
            </div>
        </div>
    )
}