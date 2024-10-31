import { useRef, useState } from "react";
import { checkAuth, getAPIURL } from "../../utils";
import Button from '../../components/Button/Button';
import Loading from "../Loading/Loading";
import styles from './CommunityCreate.module.css';
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import { useNavigate } from "react-router-dom";

export default function CommunityCreate() {
    const API_URL = getAPIURL();
    const navigate = useNavigate();

    const [ isLoading, setIsLoading ] = useState(false);

    const [ media, setMedia ] = useState([]);

    const mediaUploadRef = useRef(null);


    function onMediaUpload( event ) {
        const target = event.target;
        const files = Array.from(target.files);



        const fileUrls = files.map( file => new Promise( resolve => {
            const reader = new FileReader();
            
            reader.onload = function () {
                resolve( { mediaUrl: reader.result, mediaType: file.type.split('/')[0] } );
            }

            reader.readAsDataURL(file);
        }) );

        Promise.all(fileUrls).then( results => {
            setMedia(results);
        } )

    }

    function onReupload() {
        if ( mediaUploadRef.current == null ) return;

        mediaUploadRef.current.click();
    } 

    function onFormSubmit( event ) {
        event.preventDefault();
        const form = event.target;

        const formData = new FormData(form);

        setIsLoading(true);
        fetch(`${API_URL}/community/createCommunity`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success ) {
                return;
            }
            if ( res.success ) {
                navigate('/home');
            }
        } );
    }

    if ( isLoading ) return <Loading />;

    return (
        <div className={styles.container}>
            <div className={ styles.mainContainer }>
                <form onSubmit={ onFormSubmit } className={styles.communityForm}>
                    <div className={styles.mediaUploadContainer}>
                        {
                            ( media.length > 0 ) &&
                            <div className={styles.carousel}>
                                <ImageCarousel src={media} />
                                <Button text={'Reupload'} onClick={onReupload} type={'button'}/>
                            </div> 
                        }
                        <div className={styles.mediaUploadSubContainer}>
                            <label htmlFor="file-upload" className={styles.fileUpload} ref={mediaUploadRef} style={ ( media.length > 0 ? { 'display': 'none' } : {} ) }> + </label>
                            <input type="file" accept="image/*" id="file-upload" name="communityImg" multiple onChange={ onMediaUpload } required/>
                        </div>
                    </div>
                    <div className={styles.postDetails}>
                        <h1 className={styles.postHeading}>Create Community</h1>

                        <div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="communityName">Community Name</label>
                                <input type="text" id="communityName" placeholder="Enter Community title" name="communityName" className={styles.input} required/>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="communityDescription">Desciption</label>
                                <textarea id="communityDescription" name="communityDescription" rows="4" cols="50" className={styles.input} placeholder="Enter Desciption" required/>
                            </div>

                        </div>
                        <div className={styles.submitContainer}>
                            <Button text={'Create Community'} type={'submit'}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}