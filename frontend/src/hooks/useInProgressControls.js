import { useState, useEffect } from 'react';
import axios from 'axios';

const useInProgressControls = () => {
  const [inProgressControls, setInProgressControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInProgressControls = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/cq/control-requests/in-progress', {
          headers: {
            'x-access-token': token,
          },
        });
        setInProgressControls(response.data); // Set the controls
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If we get a 404, assume it's because no controls were found, not an actual error.
          setInProgressControls([]);
          setError(''); // Clear the error
        } else {
          setError('Error fetching controls: ' + err.message);
        }
        setLoading(false);
      }
    };
    fetchInProgressControls();
  }, []);

  return { inProgressControls, setInProgressControls, loading, error }; // Exposing setInProgressControls
};

export default useInProgressControls;
