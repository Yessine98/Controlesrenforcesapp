import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HomeManager from './HomeManager';
import ManagerSidebar from '../components/ManagerSidebar';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import Archive from './Archive';
import Users from './Users';
import AllControls from './AllControls';

const ManagerPage = () => {
  return (
    <Container fluid style={{ paddingTop: '112px', height: '100vh' }}>
    <Row style={{ height: '100%' }}>
    <Col md={2} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
          <ManagerSidebar />
        </Col>
      <Col md={10} className="main-content p-4" style={{ overflowY: 'auto', height: '100vh' }}>
        <Routes>
          <Route path="home" element={<HomeManager />} />
          <Route path="users" element={<Users />} />
          <Route path="archive" element={<Archive />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="controls" element={<AllControls />} />
        </Routes>
      </Col>
    </Row>
  </Container>
  );
};

export default ManagerPage;
