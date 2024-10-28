import React, { useState } from 'react';
import { Card, Col, Row, Button, Modal, Form } from 'react-bootstrap';
import useAssignedControls from '../hooks/useAssignedControls';
import axios from 'axios';

const AssignedControls = () => {
  const { assignedControls, loading, error, setAssignedControls } = useAssignedControls();
  const [showModal, setShowModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [justification, setJustification] = useState('');
  const [requestMoreInfo, setRequestMoreInfo] = useState('');

  const handleExecute = async (requestId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8080/api/cq/control-requests/${requestId}/execute`, {}, {
        headers: {
          'x-access-token': token,
        },
      });
      setAssignedControls(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleRefuse = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8080/api/cq/control-requests/${currentRequestId}/refuse`, {
        justification,
        requestMoreInfo,
      }, {
        headers: {
          'x-access-token': token,
        },
      });

      // Filter out the refused request from the list
      setAssignedControls(prev => prev.filter(req => req.id !== currentRequestId));

      // Close the modal and reset form
      setShowModal(false);
      setJustification('');
      setRequestMoreInfo('');
    } catch (err) {
      console.error('Error refusing control:', err);
    }
  };

  const handleShowModal = (requestId) => {
    setCurrentRequestId(requestId);
    setShowModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h2 className="my-4">Contrôles Assignés</h2>
      <hr />
      
      {/* Conditional message for no assigned controls */}
      {(!assignedControls || assignedControls.length === 0) ? (
        <p>Aucun contrôle n'a encore été assigné.</p>
      ) : (
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
                    <strong>Délai d'exécution:</strong> {new Date(request.delaiExecution).toLocaleDateString()} <br />
                  </Card.Text>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                    <Button style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }} onClick={() => handleExecute(request.id)}>Exécuter</Button>
                    <Button style={{ background: 'linear-gradient(to right ,#F2CFDB,#FF78D2)' }} onClick={() => handleShowModal(request.id)}>Refuser</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Refusal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Refuser la Demande de Contrôle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="justification">
              <Form.Label>Justification</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={justification} 
                onChange={(e) => setJustification(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="requestMoreInfo">
              <Form.Label>Demander Plus d'Informations</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={requestMoreInfo} 
                onChange={(e) => setRequestMoreInfo(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} style={{ background: 'linear-gradient(to right,#9EAA9E,#263F26)' }}>
            Annuler
          </Button>
          <Button onClick={handleRefuse} style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }}>
            Soumettre le Refus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignedControls;
