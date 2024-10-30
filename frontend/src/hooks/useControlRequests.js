// src/hooks/useControlRequests.js
import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const useControlRequests = () => {
  const [controlRequests, setControlRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchControlRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${apiUrl}/aq/control-requests/pending`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        setControlRequests(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchControlRequests();
  }, []);

  return { controlRequests, loading, error };
};

export default useControlRequests;
