import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import styles from './CommunityJoin.module.css';
import { checkAuth, getAPIURL } from '../../utils';
import Loading from '../../pages/Loading/Loading';

export default function CommunityJoinDialog( { community, isOpen, closeDialog, userCommunities, setUserCommunities } ) {

    const [ isLoading, setLoading ] = useState(false);

    const dialogRef = useRef(null);

    const isMember = ( userCommunities.find( ele => ele.communityID === community._id ) );
    console.log(isMember);

    useEffect( ( ) => {
        if ( isOpen ) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.closeModal();
        }
    }, [isOpen] );

    function handleJoin() {
        setLoading(true);

        fetch(`${getAPIURL()}/community/join-community/${community._id}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success )
                    return;
            
            if ( res.success ) {
                setUserCommunities( [ ...userCommunities, { communityID: community._id } ] );
                console.log('Community Joined!');
            }
        } )
        .finally( ( ) => setLoading(false) );
    }

    function handleLeave() {
        setLoading(true);
        
        fetch(`${getAPIURL()}/community/leave-community/${community._id}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success )
                    return;
            
            if ( res.success ) {
                setUserCommunities( userCommunities.filter( ( ele ) => ele.communityID !== community._id ) );
                console.log('Community Left!');
            }
        } )
        .finally( ( ) => setLoading(false) );
    }

    return (
        <dialog className={styles.container} ref={dialogRef} >
            <div className={styles.mainContainer}>
                { isLoading && <Loading backdrop={true} />}
                <div className={styles.imgContainer}>
                    <img src={community.imgURL} alt="Community Image" />
                </div>
                <div className={styles.communityInfo}>
                    <h1 className={styles.communityName}>{community.name}</h1>
                    <p className={styles.communityDesc}>
                        {community.description}
                    </p>

                    <div className={styles.buttonContainer}>
                        {
                            ( isMember && isMember.role === 'Admin' ) ? <Button text={'Edit'}/> :
                            <Button text={ ( isMember ) ? 'Leave' : 'Join' } onClick={ ( !isMember ) ? handleJoin : handleLeave } disabled={isLoading}/>
                        }
                        <Button text={'Close'} onClick={closeDialog} disabled={isLoading}/>
                    </div>
                </div>
            </div>
        </dialog>
    )

}