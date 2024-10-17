import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSidebar from '../components/AdminSidebar';
import { Routes, Route } from 'react-router-dom';

import AdminUsers from './AdminUsers';


const AdminPage = () => {
  return (
    <Container fluid style={{ paddingTop: '112px', height: '100vh' }}>
    <Row style={{ height: '100%' }}>
    <Col md={2} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
          <AdminSidebar />
        </Col>
      <Col md={10} className="main-content p-4" style={{ overflowY: 'auto', height: '100vh' }}>
        <Routes>
          <Route path="AdminUsers" element={<AdminUsers />} />
        </Routes>
      </Col>
    </Row>
  </Container>
  );
};

export default AdminPage;
