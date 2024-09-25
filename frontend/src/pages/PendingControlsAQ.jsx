// src/pages/PendingControls.jsx
import React from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import useControlRequests from '../hooks/useControlRequests';

const PendingControlsAQ = () => {
  const { controlRequests, loading, error } = useControlRequests();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h2 className="my-4">Pending Control Requests</h2>
      <Row>
      {controlRequests.map((request) => (
        <Col md={4} key={request.id} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{request.produit}</Card.Title>
              <Card.Text>Lot: {request.lot}</Card.Text>
              <Card.Text>Motif de Contrôle: {request.motifControle}</Card.Text>
              <Card.Text>Contrôle à faire: {request.controleAFaire}</Card.Text>
              <Card.Text>Délai d'exécution: {new Date(request.delaiExecution).toLocaleDateString()}</Card.Text>
              <Card.Text>Status: {request.status}</Card.Text>
              <Card.Text>
                Assigned CQ Users: {request.assignedCQUsers.map(user => user.username).join(', ') || 'None'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </Container>
  );
};

export default PendingControlsAQ;
