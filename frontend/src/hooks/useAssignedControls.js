// src/hooks/useAssignedControls.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAssignedControls = () => {
  const [assignedControls, setAssignedControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedControls = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/cq/control-requests', {
          headers: {
            'x-access-token': token,
          },
        });
        // Filter for pending controls only
        const pendingControls = response.data.filter(request => request.status === 'pending');
        setAssignedControls(pendingControls);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedControls();
  }, []);

  return { assignedControls, setAssignedControls, loading, error };
};

export default useAssignedControls;
