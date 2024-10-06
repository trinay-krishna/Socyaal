import styles from './QuizInput.module.css';

export default function QuizInput( { type, labelText, name, value, onChange } ) {
    return (
        <div className={styles.container}>
            <label htmlFor={name} className={styles.label}>{labelText}</label> 
            <input type={type} name={name} id={name} className={styles.input} required value={value} onChange={onChange}/>
        </div>
    );
}