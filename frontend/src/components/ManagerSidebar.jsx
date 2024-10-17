// src/components/AqSidebar.jsx
import React, { useState } from 'react';
import { Nav, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaArchive, FaUser } from 'react-icons/fa';


const ManagerSidebar = () => {
  const [activeButton, setActiveButton] = useState('home');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const navButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#333',
    fontWeight: 'bold',
    border: '1px solid transparent',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.375rem',
    marginBottom: '0.75rem',
    backgroundColor: '#ffffff',
    textDecoration: 'none',
    transition: 'background-color 0.3s, border-color 0.3s',
    width: '100%',
  };

  const activeStyle = {
    backgroundColor: '#d1a4e8',
    color: '#ffffff',
    borderColor: '#d1a4e8',
  };

  return (
    <Col 
      className="sidebar" 
      style={{ 
        background: 'linear-gradient(to right, #F7EFE6, #F7EFE6)', 
        padding: '1rem', 
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
        height: '100vh',
        overflowY: 'auto', 
        position: 'sticky',
        top: '60px',
      }}
    >
      <Nav className="flex-column gap-4">
        <Nav.Link 
          as={NavLink} 
          to="/manager/home" 
          onClick={() => handleButtonClick('home')} 
          active={activeButton === 'home'} 
          style={navButtonStyle} 
          activeStyle={activeStyle} 
          className="text-decoration-none">
          <FaHome className="me-2" /> Home Page
        </Nav.Link>

        <Nav.Link 
          as={NavLink} 
          to="/manager/users" 
          onClick={() => handleButtonClick('users')} 
          active={activeButton === 'users'} 
          style={navButtonStyle} 
          activeStyle={activeStyle} 
          className="text-decoration-none">
          <FaUser className="me-2" /> Users
        </Nav.Link>


        <Nav.Link 
          as={NavLink} 
          to="/manager/controls" 
          onClick={() => handleButtonClick('controls')} 
          active={activeButton === 'controls'} 
          style={navButtonStyle} 
          activeStyle={activeStyle} 
          className="text-decoration-none">
          <FaTasks className="me-2" /> All controls
        </Nav.Link>

    

        <Nav.Link 
          as={NavLink} 
          to="/manager/archive" 
          onClick={() => handleButtonClick('archive')} 
          active={activeButton === 'archive'} 
          style={navButtonStyle} 
          activeStyle={activeStyle} 
          className="text-decoration-none">
          <FaArchive className="me-2" /> Archive
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default ManagerSidebar;
