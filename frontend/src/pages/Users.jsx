import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken'); // Assuming you are using token-based authentication
      try {
        const response = await axios.get('http://localhost:8080/api/manager/users', {
          headers: {
            'x-access-token': token,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Users List</h2>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody >
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
