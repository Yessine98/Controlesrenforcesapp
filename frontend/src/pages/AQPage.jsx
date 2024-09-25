// src/pages/AQPage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AqSidebar from '../components/AqSidebar';
import { Routes, Route } from 'react-router-dom';
import HomeAQ from './HomeAQ';
import PendingControlsAQ from './PendingControlsAQ';
import ResultsPage from './ResultsPage';
import Archive from './Archive';


const AQPage = () => {
  return (
    <Container fluid style={{ paddingTop: '112px' }}> 
      <Row>
        <Col md={2} style={{ padding: '0', backgroundColor: '#f8f9fa', height: '100vh' }}>
          <AqSidebar />
        </Col>
        <Col md={10} className="main-content p-4">
          <Routes>
            <Route path="home" element={<HomeAQ />} />
            <Route path="pending-controls" element={<PendingControlsAQ />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="archive" element={<Archive />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AQPage;
