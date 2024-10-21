// useRegister.js
import { useState } from "react";
import axios from "axios";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/signup",
        userData
      );
      setSuccess(response.data.message); // Assuming success returns a message
    } catch (err) {
      // Handle error response from server
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An error occurred."); // Extract message
      } else {
        setError("An error occurred while registering."); // Fallback error
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};

export default useRegister;
