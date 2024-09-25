// src/components/LoggedInNavbar.jsx
import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

const LoggedInNavbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      fixed="top" 
      className="second-navbar" 
      style={{
        background: 'linear-gradient(to right,#546955,#9EAA9E)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        top: '56px', // Adjust the top position to eliminate spacing
        marginBottom: '0' // Ensure no margin at the bottom
      }}
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#notifications">
            <i className="fas fa-bell" style={{ color: '#ffffff' }}></i>
          </Nav.Link>
          <NavDropdown title={`${user.username} (${user.role})`} id="basic-nav-dropdown">
            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default LoggedInNavbar;
