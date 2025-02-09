import SocialLoginButtons from './SocialLoginButtons';
import styles from '../styles/RegisterForm.module.css';

export default function LoginForm() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className={styles.title}>Login into account</h1>

        <label htmlFor="email">Email</label>
        <input type="email" id="email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" required />

        <p className={styles.forgotPassword}>
          <a href="/forgot-password">Forgot password?</a>
        </p>

        <button type="submit">Login</button>

        <div className={styles.divider}>Or Login with</div>

        <SocialLoginButtons />

        <p className={styles.loginPrompt}>
          Don't have an account? <a href="/register">Create Account</a>
        </p>
      </form>
    </div>
  );
}