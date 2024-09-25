// src/hooks/useLogin.js
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const useLogin = () => {
  const { dispatch } = useContext(AuthContext);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/signin', credentials);
      dispatch({ type: 'LOGIN', payload: response.data });
         // Save token in localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    
    // Optionally save other fields if necessary
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('role', response.data.role);
      return response.data;
    } catch (err) {
      throw err; // Re-throw the error for handling in the component if needed
    }
  };

  return { login };
};

export default useLogin;
