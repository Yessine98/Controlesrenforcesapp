// src/hooks/useCreateControlRequest.js
import { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const useCreateControlRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cqUsers, setCqUsers] = useState([]);

  const createControlRequest = async (controlData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        `${apiUrl}/aq/control-requests`,
        controlData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      setLoading(false);
      throw err;
    }
  };

  const fetchCQUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Correctly retrieve the token
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/aq/cqusers", {
        headers: {
          "x-access-token": token, // Change this line
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      setCqUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching CQ users:", err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  return { createControlRequest, fetchCQUsers, cqUsers, loading, error };
};

export default useCreateControlRequest;
