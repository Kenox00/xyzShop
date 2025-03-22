
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";

export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useContext(AuthContext);
  
    const signUp = async (email, password) => {
      setIsLoading(true);
      setError(null);
  
      try {
        console.log('Attempting sign-up with:', { email, password }); // Debug line to show sent data
  
        const response = await fetch('http://localhost:4000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const json = await response.json();
        console.log('Response data:', json);
  
        if (!response.ok) {
          setIsLoading(false);
          setError(json.error || 'Sign-up failed');
        } else {
          localStorage.setItem('user', JSON.stringify(json));
          dispatch({ type: 'LOGIN', payload: json });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Sign-up error:', err); // Log unexpected errors
        setError('An unexpected error occurred');
        setIsLoading(false);
      }
    };
  
    return { signUp, error, isLoading };
  };
  
