import React from 'react';
import { Container } from 'react-bootstrap';


const currentDateTime = new Date().toLocaleString();


const HomeManager = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
     <h2>Welcome to the Quality Control Management System</h2>
     <p>{currentDateTime}</p>
    </Container>

  );
};

export default HomeManager;
