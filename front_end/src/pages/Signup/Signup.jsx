import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [ Error, setError ] = useState('');
    const [ success, setSuccess ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/login`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            if(result.auth == true)
                navigate('/home');
        }).catch(err => console.error(err));
    }, [])

    function checkUserName(userName) {
        const trimmedUserName = userName.trim();

        if(trimmedUserName.length < 5) {
            setError(prevError => 'Username must atleast be 5 characters in length!')
            return(false);
        }

        if(trimmedUserName.includes('-') || trimmedUserName.includes(' ')) {
            setError(prevErr => 'Username must not contains spaces or dashes!');
            return false;
        }

        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.target);
        const data = {
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            userPass: formData.get('userPass'),
            confirmUserPass: formData.get('confirmUserPass'),
        };

        if( data.userPass !== data.confirmUserPass ) {
            setError('Passwords do not match!');
            return;
        }

        if(!checkUserName(data.userName)) {
            return; 
        }

        try {
            const response = await fetch(`${API_URL}/users/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            
            const result = await response.json();

            if(result.success) {
                setSuccess(true);
            } else {
                const error = result.errors[0].msg;
                setError(error);
            }
        } catch(err) {
            console.error(err);
        }

    }
    
    return(
        <div className={styles.mainContainer}>
            <div className={styles.imageContainer}></div>
            <div className={styles.signUpContainer}>
                {success ? 
                    <div className={styles.mailDiv}>
                        <img src="/mail.png" alt="" />
                        <p>Email Sent</p>
                    </div> 
                : 
                <div className={styles.formContainer}>
                <h1 className={styles.signupHeading}>Create Account</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <Input label={'Email'} type={'email'} name={'userEmail'}/>
                        <Input label={'Username'} name={'userName'}/>
                        <Input label={'Password'} type={'password'} name={'userPass'}/>
                        <Input label={'Confirm Password'} type={'password'} name={'confirmUserPass'}/>
                        <Button text={'Sign Up'}/>
                    </form>
                    <div>
                        {Error}
                    </div>
                </div>
                }
            </div>
        </div>
    );
}