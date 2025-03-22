// Login.jsx
import React, { useState } from 'react';
import styles from './Login.module.css';
import house from '../../assets/house.png';
import { useLogin } from '../../hooks/useLogin';
import {  useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login, error, isLoading } = useLogin();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSignup=()=>{
    navigate('/signup');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <img src={house} alt="House Icon" className={styles.houseIcon} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@gmail.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="*******"
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={isLoading} className={styles.button}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            <button type="button" onClick={handleSignup} className={styles.button}> Go to Sign Up</button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;