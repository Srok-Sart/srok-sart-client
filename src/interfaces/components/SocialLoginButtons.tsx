import styles from '../styles/RegisterForm.module.css';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";

export default function SocialLoginButtons() {
  return (
    <div className={styles.socialButtons}>
      <button className={styles.facebook}>
        <span className={styles.icon}><FaFacebook /></span>
        <span className={styles.text}>Log in with Facebook</span>
      </button>
      <button className={styles.google}>
        <span className={styles.icon}><FcGoogle /></span>
        <span className={styles.text}>Log in with Google</span>
      </button>
    </div>
  );
}