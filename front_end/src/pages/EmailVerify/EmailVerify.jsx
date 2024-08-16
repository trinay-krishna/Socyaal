import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './EmailVerify.module.css';

export default function EmailVerify() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { userID, token } = useParams();
    const navigate = useNavigate();
    const [ error, setError ] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/users/verify/${userID}/${token}`)
        .then(response => response.json())
        .then(result => {
            if(result.success)
                    navigate('/');
            else
                setError(true);
        })
        .catch(err => console.error(err));
    }, []);

    return(
        <div className={styles.errorContainer}>
            {error &&
             <div>
                <img src="/invalid.gif" alt="" />
            </div>}
        </div>
    );
}