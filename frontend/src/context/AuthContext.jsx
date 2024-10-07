// src/context/AuthContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';

// Define the initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

// Create context
export const AuthContext = createContext();

// Define the reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

// Create the provider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
    console.log('Current user:', state.user);
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
