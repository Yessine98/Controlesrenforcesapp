import React from 'react';
import { Card, Col, Row, Container,Button } from 'react-bootstrap';
import useControlRequests from '../hooks/useControlRequests';
import axios from 'axios';

const PendingControlsAQ = () => {
  const { controlRequests, loading, error } = useControlRequests();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCancel = async (controlRequestId) => {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'x-access-token': token
    };

    try {
      await axios.put(`http://localhost:8080/api/aq/controlRequest/cancel/${controlRequestId}`, null, { headers });
      alert('Control request cancelled successfully.');
      // Optionally refresh the list of requests or update the state
    } catch (error) {
      alert('Error cancelling control request.');
      console.log(error);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Pending Control Requests</h2>
      <hr />
      <Row>
        {controlRequests.map((request) => (
          <Col md={4} key={request.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{request.produit}</Card.Title>
                <Card.Text>Numero: {request.numero}</Card.Text>
                <Card.Text>Code: {request.code}</Card.Text>
                <Card.Text>Lot: {request.lot}</Card.Text>
                <Card.Text>Contrôle à faire: {request.controleAFaire}</Card.Text>
                <Card.Text>Délai d'exécution: {new Date(request.delaiExecution).toLocaleDateString()}</Card.Text>
                <Card.Text>
                  Assigned CQ Users: {request.assignedCQUsers.map(user => user.username).join(', ') || 'None'}
                </Card.Text>
                {request.status === 'pending' && (
                  <Button
                  style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}}  onClick={() => handleCancel(request.id)}>Cancel</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PendingControlsAQ;
