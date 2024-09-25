import { useState } from 'react';
import axios from 'axios';

const useUpdateDecision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitDecision = async (resultId, decisionAQ, onSuccess) => {
    let isMounted = true; // Track component mount status
    const token = localStorage.getItem('accessToken');
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8080/api/aq/completed-requests/${resultId}/decision`,
        { decisionAQ },
        {
          headers: {
            'x-access-token': token,
          },
        }
      );
      
      if (isMounted) {
        onSuccess(); // Callback to update UI after successful decision
      }
    } catch (err) {
      if (isMounted) {
        setError(err.response ? err.response.data.message : 'Error updating decision');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    // Clean up function to avoid state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  };

  return { submitDecision, loading, error };
};

export default useUpdateDecision;
