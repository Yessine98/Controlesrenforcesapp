import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HomeCQ from './HomeCQ';
import AssignedControlsCQ from './AssignedControlsCQ';
import SoumettreResultat from './SoumettreResultat';
import CqSidebar from '../components/CqSidebar';
import { Routes, Route } from 'react-router-dom';

const CQPage = () => {
  return (
    <Container fluid style={{ paddingTop: '112px' }}> 
    <Row>
      <Col md={2} style={{ padding: '0', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <CqSidebar />
      </Col>
      <Col md={10} className="main-content p-4">
        <Routes>
          <Route path="home" element={<HomeCQ />} />
          <Route path="assigned-controls" element={<AssignedControlsCQ />} />
          <Route path="soumettre-resultat" element={<SoumettreResultat />} />
        </Routes>
      </Col>
    </Row>
  </Container>
  );
};

export default CQPage;
