import { useState } from 'react';
import axios from 'axios';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Add success state

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:8080/api/user/signup', userData);
      setLoading(false);
      setSuccess('Account created successfully! Please log in.'); // Set success message
      return response.data; 
    } catch (err) {
      setLoading(false);
      setError(err.response ? err.response.data : err.message);
      throw err;
    }
  };

  return { register, loading, error, success };
};

export default useRegister;