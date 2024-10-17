import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the user list on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            'x-access-token': token,
          },
        });
        setUsers(response.data); // Set the fetched users
      } catch (err) {
        console.log('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };
    
    fetchUsers();
  }, []);

  const handleResetPassword = async (userId) => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post('http://localhost:8080/api/admin/reset-password', { userId, newPassword }, {
        headers: {
          'x-access-token': token,
        },
      });
      setMessage('Password reset successfully.');
      setNewPassword(''); // Clear password input after reset
      setSelectedUserId(''); // Clear selected user ID
    } catch (err) {
      setError('Error resetting password.');
      console.log('Error:', err);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
      <MDBCard className='m-4' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-4">Admin User Management</h2>
          {message && <p className="text-success text-center">{message}</p>}
          {error && <p className="text-danger text-center">{error}</p>}
          
          <MDBTable bordered>
            <MDBTableHead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <MDBInput 
                      type='password' 
                      placeholder='New Password' 
                      value={selectedUserId === user.id ? newPassword : ''} 
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setSelectedUserId(user.id); // Set the selected user ID
                      }} 
                    />
                    <MDBBtn 
                      className='mt-2' 
                      onClick={() => handleResetPassword(user.id)}
                      disabled={!newPassword}
                    >
                      Reset Password
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AdminUsers;
