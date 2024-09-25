// src/hooks/useInProgressControls.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useInProgressControls = () => {
  const [inProgressControls, setInProgressControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInProgressControls = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/cq/control-requests/in-progress', {
          headers: {
            'x-access-token': token,
          },
        });
        setInProgressControls(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressControls();
  }, []);

  return { inProgressControls, loading, error };
};

export default useInProgressControls;
