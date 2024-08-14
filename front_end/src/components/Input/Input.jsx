import styles from './Input.module.css';

export default function Input( { label, name, id, placeHolder, isPassword } ) {

    const labelID = id ? id : name;
    
    return(
        <div className={styles.inputContainer}>
            <label htmlFor={labelID}>{label}</label>
            <input className={styles.input} type={ isPassword ? 'password' : 'text' } name={name} id={labelID} placeholder={placeHolder ? placeHolder : ''} required />
        </div>
    );
}
