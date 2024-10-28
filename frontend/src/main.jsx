import React from 'react'; 
import { createRoot } from 'react-dom/client'; 
import App from './App.jsx';
import './index.css'; 

import { AuthContextProvider } from './context/AuthContext'; 

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
