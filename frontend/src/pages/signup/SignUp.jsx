import React, { useState } from 'react';
import styles from './SignUp.module.css'; // Reusing the same CSS styles
// Optional: Replace with a suitable image for SignUp
import house from '../../assets/house.png'; // Optional: Replace with your preferred icon
import { useSignUp } from '../../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUp, error, isloading } = useSignUp()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault(); 

      await signUp(email, password);
  }
  const handleLogin = ()=>{
    navigate('/login');
  }
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <img
            src={house} 
            alt="House Icon"
            className={styles.houseIcon}
          />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
            type="email" 
            id="email" name="email"
             placeholder="john@gmail.com" 
             onChange={(e) => setEmail(e.target.value)}
             value={email}
             />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
            <button type="button" onClick={handleLogin} className={styles.button}>
              Back to Login
            </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;