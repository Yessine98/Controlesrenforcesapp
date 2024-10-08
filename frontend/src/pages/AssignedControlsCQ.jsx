import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import useAssignedControls from '../hooks/useAssignedControls';
import axios from 'axios';

const AssignedControls = () => {
  const { assignedControls, loading, error, setAssignedControls } = useAssignedControls();

  const handleExecute = async (requestId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8080/api/cq/control-requests/${requestId}/execute`, {}, {
        headers: {
          'x-access-token': token,
        },
      });

      // Filter out the executed request from the list
      setAssignedControls(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!assignedControls || assignedControls.length === 0) {
    return <p>No controls have been assigned yet.</p>;
  }

  return (
    <Row>
      {assignedControls.map(request => (
        <Col key={request.id} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{request.produit}</Card.Title>
              <Card.Text>
                <strong>Numero:</strong> {request.numero} <br />
                <strong>Code:</strong> {request.code} <br />
                <strong>Lot:</strong> {request.lot} <br />
                <strong>Secteur:</strong> {request.secteur} <br />
                <strong>Control à faire:</strong> {request.controleAFaire} <br />
                <strong>Execution Deadline:</strong> {new Date(request.delaiExecution).toLocaleDateString()} <br />
              </Card.Text>
              <Button style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}} onClick={() => handleExecute(request.id)}>Execute</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AssignedControls;
