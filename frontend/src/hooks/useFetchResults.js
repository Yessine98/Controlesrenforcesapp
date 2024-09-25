import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    const fetchResults = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8080/api/aq/completed-requests', {
          headers: {
            'x-access-token': token,
          },
        });
        if (isMounted) {
          setResults(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response ? err.response.data.message : 'Error fetching results');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false; // Prevent state updates if the component unmounts
    };
  }, []);

  return { results, loading, error };
};

export default useFetchResults;
