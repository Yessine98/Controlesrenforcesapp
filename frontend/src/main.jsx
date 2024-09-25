import React from 'react'; 
import { createRoot } from 'react-dom/client'; 
import App from './App.jsx';
import './index.css'; 

import { AuthContextProvider } from './context/AuthContext'; // Make sure the path is correct

const rootElement = document.getElementById('root'); // Ensure this ID matches your HTML
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
