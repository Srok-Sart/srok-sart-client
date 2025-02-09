import SocialLoginButtons from './SocialLoginButtons';
import styles from '../styles/RegisterForm.module.css';

export default function RegisterForm() {
  return (
    <div className={styles.container}>
      
      <form className={styles.form}>

      <h1 className={styles.title}>Register Account</h1>

      <label htmlFor="username">Username</label>
      <input type="username" required />

        <label htmlFor="email">Email</label>
        <input type="email" required />

        <label htmlFor="password">Password</label>
        <input type="password"  required />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" required />

        <button type="submit">Register</button>
        <div className={styles.divider}>Or Register with</div>
        <SocialLoginButtons />
        <p className={styles.loginPrompt}>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}