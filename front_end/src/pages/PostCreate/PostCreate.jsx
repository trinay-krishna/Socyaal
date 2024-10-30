import { useEffect, useRef, useState } from "react";
import { checkAuth, getAPIURL } from "../../utils";
import Button from '../../components/Button/Button';
import Loading from "../Loading/Loading";
import styles from './PostCreate.module.css';
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import { useNavigate } from "react-router-dom";

export default function PostCreate() {
    const API_URL = getAPIURL();
    const navigate = useNavigate();

    const [ communities, setCommunities ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ media, setMedia ] = useState([]);

    const mediaUploadRef = useRef(null);


    useEffect ( ( ) => {
        setIsLoading(true);
        fetch(`${API_URL}/community/get-user-communities`, {
            method: 'GET',
            credentials: 'include',
        })
        .then( res => res.json() )
        .then( res => {
            if ( !checkAuth( res ) || !res.success )
                return;
            
            if ( res.communities.length == 0 )
                navigate('/home');

            setCommunities(res.communities);
            
        } )
        .finally( () => setIsLoading(false) );
    }, [] );

    function onMediaUpload( event ) {
        const target = event.target;
        const files = Array.from(target.files);


        const fileUrls = files.map( file => new Promise( resolve => {
            const reader = new FileReader();
            
            reader.onload = function () {
                resolve(reader.result);
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
        fetch(`${API_URL}/post/create-post`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
        .then( res => res.json() )
        .then( res => {
            console.log(res);
            if ( res.success ) {
                navigate('/home');
            } else {
                setIsLoading(false);
            }
        } );
    }

    if ( isLoading ) return <Loading />;

    return (
        <div className={styles.container}>
            <div className={ styles.mainContainer }>
                <form onSubmit={ onFormSubmit } className={styles.postForm}>
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
                            <input type="file" accept="image/*" id="file-upload" name="postImages" multiple onChange={ onMediaUpload } required/>
                        </div>
                    </div>
                    <div className={styles.postDetails}>
                        <h1 className={styles.postHeading}>Create Post</h1>

                        <div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="postTitle">Title</label>
                                <input type="text" id="postTitle" placeholder="Enter Post title" name="title" className={styles.input} required/>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="postDesc">Desciption</label>
                                <textarea id="postDesc" name="content" rows="4" cols="50" className={styles.input} placeholder="Enter Desciption" required/>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="communityDropDown">Select Community</label>
                                <select name="community" id="communityDropDown" className={styles.input} required>
                                    {
                                        communities.map(community => <option className={styles.option} key={community.communityID} value={community.communityID}>{community.communityName[0].name}</option>)
                                    }
                            
                                </select>
                            </div>
                        </div>
                        <div className={styles.submitContainer}>
                            <Button text={'Create Post'} type={'submit'}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}