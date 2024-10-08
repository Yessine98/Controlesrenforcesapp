import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Initialize socket connection

const ProfilePage = () => {
  const { dispatch } = useContext(AuthContext); // Get dispatch from AuthContext
  const [userData, setUserData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current user info
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          headers: {
            'x-access-token': token,
          },
        });
        setUserData((prev) => ({ ...prev, username: response.data.username }));
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('http://localhost:8080/api/user/profile', userData, {
        headers: {
          'x-access-token': token,
        },
      });
  
      // Fetch user data from localStorage, ensure correct userId is set
      const storedUser = JSON.parse(localStorage.getItem('user'));
  
      const updatedUser = {
        ...storedUser, // Keep the existing data like role, userId, etc.
        username: userData.username, // Update only the username
      };
  
      // Update the user in the local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
  
      // Update the AuthContext with the new data
      dispatch({ type: 'LOGIN', payload: updatedUser });
  
      // Re-register the updated userId with the socket
      socket.emit('registerUser', updatedUser.userId); // Make sure the userId is valid
  
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    }
  };
  
  

  return (
    <Container>
        <div className="d-flex justify-content-center">
        <h2>Update profile</h2>
        </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="currentPassword">
          <Form.Label>Current Password (optional for username change)</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={userData.currentPassword}
            onChange={handleChange}
            // Make this optional based on your needs
          />
        </Form.Group>

        <Form.Group controlId="newPassword">
          <Form.Label>New Password (optional)</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleChange}
          />
        </Form.Group>

        {message && <p>{message}</p>}
        <br />
        <div className='d-flex justify-content-center'>
        <Button style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}} type="submit">
          Update Profile
        </Button>
        </div>

      </Form>
    </Container>
  );
};

export default ProfilePage;
