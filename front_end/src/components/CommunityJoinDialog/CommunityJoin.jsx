import { useEffect, useRef } from 'react';
import Button from '../Button/Button';
import styles from './CommunityJoin.module.css';

export default function CommunityJoinDialog( { community, isOpen, closeDialog } ) {

    const dialogRef = useRef(null);

    useEffect( ( ) => {
        if ( isOpen ) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.closeModal();
        }
    }, [isOpen] )

    return (
        <dialog className={styles.container} ref={dialogRef} >
            <div className={styles.mainContainer}>
                <div className={styles.imgContainer}>
                    <img src={community.imgURL} alt="Community Image" />
                </div>
                <div className={styles.communityInfo}>
                    <h1 className={styles.communityName}>{community.name}</h1>
                    <p className={styles.communityDesc}>
                        {community.description}
                    </p>

                    <div className={styles.buttonContainer}>
                        <Button text={'Join'}/>
                        <Button text={'Close'} onClick={closeDialog}/>
                    </div>
                </div>
            </div>
        </dialog>
    )

}