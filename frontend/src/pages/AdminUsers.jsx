import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [passwords, setPasswords] = useState({}); // Object to store passwords for each user
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
    const newPassword = passwords[userId]; // Get the new password for this specific user

    try {
      const response = await axios.post('http://localhost:8080/api/admin/reset-password', { userId, newPassword }, {
        headers: {
          'x-access-token': token,
        },
      });
      setMessage('Password reset successfully.');
      setPasswords(prevPasswords => ({ ...prevPasswords, [userId]: '' })); // Clear password input after reset
    } catch (err) {
      setError('Error resetting password.');
      console.log('Error:', err);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
      <MDBCard className='m-4' style={{ maxWidth: '800px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-4">Admin User Management</h2>
          {message && <p className="text-success text-center">{message}</p>}
          {error && <p className="text-danger text-center">{error}</p>}
          
          <MDBTable bordered>
            <MDBTableHead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Reset password</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <MDBInput 
                      type='password' 
                      placeholder='New Password' 
                      value={passwords[user.id] || ''} // Only show password for this user
                      onChange={(e) => setPasswords({ ...passwords, [user.id]: e.target.value })} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MDBBtn 
                        className='mt-2' 
                        onClick={() => handleResetPassword(user.id)}
                        disabled={!passwords[user.id]} // Disable button if no password is entered for this user
                        style={{
                          background: 'linear-gradient(to right,#263F26,#9EAA9E)'
                        }}
                      >
                        Reset Password
                      </MDBBtn>
                    </div>
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
