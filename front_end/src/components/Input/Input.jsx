import styles from './Input.module.css';

export default function Input( { label, name, type, onChange, value } ) {
    
    return(
        <div className={styles.inputContainer}>
            <input className={styles.input} type={type ? type : 'text'} name={name} placeholder='' onChange={onChange} value={value}  required />
            <div className={styles.labelline}>{label}</div>
        </div>
    );
}
