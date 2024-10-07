import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './NotificationList.css';

const socket = io('http://localhost:8080');

const NotificationList = ({ notifications, onMarkAllAsRead, setNotifications }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const initialUnreadCount = notifications.filter(n => !n.read).length;
        setUnreadCount(initialUnreadCount);
        
        socket.on('newNotification', (data) => {
            console.log("New notification received:", data);
            setUnreadCount(prevCount => prevCount + 1); 
            setNotifications((prevNotifications) => [data, ...prevNotifications]); 
        });


        return () => {
            socket.off('newNotification');
        };
    }, [notifications, setNotifications]);

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(notification => !notification.read);
        try {
            for (const notification of unreadNotifications) {
                await axios.put(`http://localhost:8080/api/notifications/${notification.id}/read`);
            }
            
            onMarkAllAsRead();
            setUnreadCount(0); 

            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                read: true
            }));
            setNotifications(updatedNotifications); 
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    return (
        <div className="notification-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Unread Notifications: {unreadCount}</strong>
                {unreadCount > 0 && (
                    <Button style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }} onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>
            <hr />
            {notifications.length === 0 ? (
                <p>No new notifications</p>
            ) : (
                notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`} 
                        style={{ 
                            padding: '5px',
                            marginBottom: '10px',
                            borderRadius: '5px'
                        }}
                    >
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;
