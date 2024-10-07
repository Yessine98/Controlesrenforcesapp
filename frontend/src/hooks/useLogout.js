import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = () => {
    setIsLoading(true);
    setError(null);

    localStorage.clear();
    
    dispatch({ type: 'LOGOUT' });

    setIsLoading(false);
  };

  return { logout, isLoading, error };
};