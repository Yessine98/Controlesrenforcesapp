import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Modal } from 'react-bootstrap';
import NotificationList from './NotificationList';
import ProfilePage from '../pages/ProfilePage';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { GoSignOut } from 'react-icons/go';
import { CgProfile } from "react-icons/cg";


const socket = io('http://localhost:8080');

const LoggedInNavbar = ({ notifications, setNotifications, unreadCount, setUnreadCount }) => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            socket.on('newNotification', (notification) => {
                console.log("New notification received via socket:", notification);

                if (notification.type === 'result_submitted') {
                    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
                    setUnreadCount(prevCount => prevCount + 1);
                }
            });

            return () => {
                socket.off('newNotification');
            };
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            console.log("Fetching notifications for user ID:", user.id);
            const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`);
            const notifications = response.data;

            setNotifications(notifications);
            const unreadNotifications = notifications.filter(notification => !notification.read).length;
            setUnreadCount(unreadNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleNotifications = () => {
        if (!showNotifications) {
            setUnreadCount(0);
        }
        setShowNotifications(prev => !prev);
    };

    if (!user) {
        return null; 
    }

    return (
        <>
            <Navbar 
                bg="light" 
                expand="lg" 
                fixed="top" 
                className="second-navbar" 
                style={{
                    background: 'linear-gradient(to right,#546955,#9EAA9E)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    top: '56px', 
                    marginBottom: '0'
                }}
            >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link onClick={toggleNotifications} style={{ position: 'relative' }}>
                            <i className="fas fa-bell" style={{ color: '#ffffff' }}></i>
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-10px',
                                    backgroundColor: '#FF78D2',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '3px 6px',
                                    fontSize: '12px',
                                    fontWeight:'bold'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </Nav.Link>
                        <NavDropdown title={`${user.username} (${user.role})`} id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to={user.role === 'AQ' ? "/aq/profile": user.role==='CQ'? "/cq/profile":"manager/profile"}><CgProfile />
                            Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}><GoSignOut/>Se déconnecter</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Modal for Notifications */}
            <Modal show={showNotifications} onHide={() => setShowNotifications(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length === 0 ? (
                        <p> Aucune nouvelle notification</p>
                    ) : (
                        <NotificationList 
                            notifications={notifications}
                            setNotifications={setNotifications}
                            onMarkAllAsRead={() => setUnreadCount(0)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoggedInNavbar;
