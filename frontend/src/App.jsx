import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesList from './pages/RoutesList';
import { AuthContext } from './context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppNavbar from './components/AppNavbar';
import LoggedInNavbar from './components/LoggedInNavbar';
import Footer from './components/Footer';
import { AuthContextProvider } from './context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

function App() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            console.log('Emitting user ID:', user.id);
            socket.emit('registerUser', user.id); // Ensure this ID is correct

            socket.on('newNotification', (notification) => {
                console.log("New notification received:", notification);
                setNotifications((prevNotifications) => {
                    const updatedNotifications = [notification, ...prevNotifications];
                    console.log("Updated notifications:", updatedNotifications);
                    return updatedNotifications;
                });
                setUnreadCount(prevCount => prevCount + 1);
            });
        }

        return () => {
            socket.off('newNotification');
        };
    }, [user]);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <BrowserRouter>
                    <AppNavbar />
                    <LoggedInNavbar 
                        notifications={notifications} 
                        unreadCount={unreadCount} 
                        setUnreadCount={setUnreadCount} // Pass setUnreadCount as a prop
                        setNotifications={setNotifications} // Pass setNotifications as a prop
                    />
                    <div className="content" style={{ minHeight: 'calc(100vh - 200px)' }}>
                        <RoutesList />
                    </div>
                    <Footer />
                    <ReactQueryDevtools />
                </BrowserRouter>
            </AuthContextProvider>
        </QueryClientProvider>
    );
}

export default App;
