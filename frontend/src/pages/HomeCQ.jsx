import React from 'react';
import { Container } from 'react-bootstrap';


const currentDateTime = new Date().toLocaleString();


const HomeCQ = () => {
  return (
    <Container >
      <div style={{ padding: '2rem' }}>
     <h2>Bienvenue dans le Système de Gestion des Contrôles Renforcées</h2>
     <p>{currentDateTime}</p>
     </div>
    </Container>

  );
};

export default HomeCQ;
