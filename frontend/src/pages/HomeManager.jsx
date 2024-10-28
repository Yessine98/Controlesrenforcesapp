import React from 'react';
import { Container } from 'react-bootstrap';


const currentDateTime = new Date().toLocaleString();


const HomeManager = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
     <h2>Bienvenue dans le Système de Gestion des Contrôles Renforcées</h2>
     <p>{currentDateTime}</p>
    </Container>

  );
};

export default HomeManager;
