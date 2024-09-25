// src/components/AppNavbar.jsx
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Logo from '../images/Opella_Workmark_ Warm White_RGB.png';

const AppNavbar = () => {
  return (
    <Navbar 
      bg="light" 
      variant="light" 
      fixed="top" 
      className="navbar-fixed"
      style={{
        background: 'linear-gradient(to right,#042B0B,#546955)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
        padding: '0.5rem 1rem',
        marginBottom: '0' // Ensure no margin at the bottom
      }}
    >
      <Container fluid>
        <Navbar.Brand href="/home" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            alt=""
            src={Logo}
            width="100"
            height="40"
            className="d-inline-block align-top"
            style={{ marginRight: '20px', borderRadius: '0%' }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#Ffffff' }}>
            Gestion des controles renforces
          </span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
