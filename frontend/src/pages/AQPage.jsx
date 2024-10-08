// src/pages/AQPage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AqSidebar from '../components/AqSidebar';
import { Routes, Route } from 'react-router-dom';
import HomeAQ from './HomeAQ';
import PendingControlsAQ from './PendingControlsAQ';
import ResultsPage from './ResultsPage';
import Archive from './Archive';
import ProfilePage from './ProfilePage';

const AQPage = () => {
  return (
    <Container fluid style={{ paddingTop: '112px', height: '100vh' }}> 
      <Row style={{ height: '100%' }}>
        <Col md={2} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
          <AqSidebar />
        </Col>
        <Col md={10} className="main-content p-4" style={{ overflowY: 'auto', height: '100vh' }}>
          <Routes>
            <Route path="home" element={<HomeAQ />} />
            <Route path="pending-controls" element={<PendingControlsAQ />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="archive" element={<Archive />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AQPage;
