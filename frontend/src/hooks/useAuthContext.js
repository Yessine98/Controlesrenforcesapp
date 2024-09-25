import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  console.log('AuthContext:', context);
  if (!context) {
    throw new Error(
      'useAuthContext must be used inside an AuthContextProvider'
    );
  }

  return context;
};