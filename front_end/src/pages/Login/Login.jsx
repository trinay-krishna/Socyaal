import styles from './Login.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [ Error, setError ] = useState('');
    useEffect(() => {
        fetch(`${API_URL}/login`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.auth == true) {
                navigate('/home');
            }
        })
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            userName: formData.get('userName'),
            userPass: formData.get('userPass'),
        };

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            
            const result = await response.json();
            console.log(result);
            if(result.success) {
                navigate('/home');
            } else {
                setError('Username or password is incorrect!');
            }
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <div className={styles.bgImg}>
            <div className={styles.loginContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input label = "Username: " name = "userName"/>
                    <Input label = "Password: " name = "userPass" isPassword = {true}/>
                    <Button text = "Login" />
                </form>
                <Link to='/home' className={styles.signUp}>Sign Up</Link>
                <div className={styles.errors}>
                    {Error}
                </div>
            </div>
        </div>
    );
}