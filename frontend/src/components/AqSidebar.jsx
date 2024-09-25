import React, { useState } from 'react';
import { Nav, Container, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaArchive } from 'react-icons/fa';
import { MdAssessment } from 'react-icons/md';

const AqSidebar = () => {
  // State for handling active button
  const [activeButton, setActiveButton] = useState('home');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Common style for nav buttons
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
    width: '100%', // Full-width for flex alignment
  };

  // Style for active nav button
  const activeStyle = {
    backgroundColor: '#d1a4e8',
    color: '#ffffff',
    borderColor: '#d1a4e8',
  };

  return (
    <Container fluid className="vh-100" style={{ padding: '0', margin: '0' }}>
      <Col 
        className="sidebar" 
        style={{ 
          background: 'linear-gradient(to right, #F7EFE6, #F7EFE6)', 
          padding: '1rem', 
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
          height: '100vh', // Ensure full viewport height
          overflowY: 'auto', // Add scrolling if content overflows
          position: 'sticky',
          top: '60px' // Adjust this value to match the height of your navbar
        }}
      >
        <Nav className="flex-column gap-4">
          <Nav.Link 
            as={NavLink} 
            to="/aq/home" 
            onClick={() => handleButtonClick('home')} 
            active={activeButton === 'home'} 
            style={navButtonStyle} 
            activeStyle={activeStyle} 
            className="text-decoration-none">
              <FaHome className="me-2" /> Home Page
          </Nav.Link>

          <Nav.Link 
            as={NavLink} 
            to="/aq/pending-controls" 
            onClick={() => handleButtonClick('pendingControls')} 
            active={activeButton === 'pendingControls'} 
            style={navButtonStyle} 
            activeStyle={activeStyle} 
            className="text-decoration-none">
              <FaTasks className="me-2" /> Pending Controls
          </Nav.Link>

          <Nav.Link 
            as={NavLink} 
            to="/aq/results" 
            onClick={() => handleButtonClick('results')} 
            active={activeButton === 'results'} 
            style={navButtonStyle} 
            activeStyle={activeStyle} 
            className="text-decoration-none">
              <MdAssessment className="me-2" /> Results (Taking Decision)
          </Nav.Link>

          <Nav.Link 
            as={NavLink} 
            to="/aq/archive" 
            onClick={() => handleButtonClick('archive')} 
            active={activeButton === 'archive'} 
            style={navButtonStyle} 
            activeStyle={activeStyle} 
            className="text-decoration-none">
              <FaArchive className="me-2" /> Archive
          </Nav.Link>
        </Nav>
      </Col>
    </Container>
  );
};

export default AqSidebar;
