import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesList from './pages/RoutesList';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppNavbar from './components/AppNavbar';
import LoggedInNavbar from './components/LoggedInNavbar';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <AppNavbar />
          <LoggedInNavbar />
          <div className="content">
            <RoutesList />
          </div>
          <ReactQueryDevtools />
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
