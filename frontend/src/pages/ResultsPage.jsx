import React, { useState, useEffect } from 'react';
import { Card, Spinner, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dateDecision, setDateDecision] = useState('');
  const [commentairesAQ, setCommentairesAQ] = useState('');
  const [decisionAQ, setDecisionAQ] = useState('liberable'); // default decision

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8080/api/aq/completed-requests', {
          headers: {
            'x-access-token': token,  // Pass the token for authentication
          },
        });
        setResults(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Handle the modal open/close
  const handleShow = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setDateDecision(''); // Reset dateDecision when opening modal
    setCommentairesAQ(''); // Reset comment when opening modal
    setDecisionAQ('liberable'); // Reset to default decision
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  // Handle the decision submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    
    // Submit the decision to your backend
    try {
      await axios.put(`http://localhost:8080/api/aq/completed-requests/${selectedRequest.id}/decision`, {
        dateDecision,
        commentairesAQ,
        decisionAQ,
      }, {
        headers: {
          'x-access-token': token,
        },
      });

      handleClose();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error submitting decision');
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Results from CQ</h2>
      <hr />
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <Row>
          {results.map((request) => (
            <Col xs={12} md={6} lg={4} key={request.id} className="mb-3">
              <Card>
                <Card.Body>
                  <h5><strong>Numero: </strong>{request.controlRequest.numero}</h5>
                  <p><strong>Produit:</strong> {request.controlRequest.produit}</p>
                  <p><strong>Lot:</strong> {request.lot}</p>
                  <p><strong>Conformité:</strong> {request.conformite}</p>
                  <Button style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }} onClick={() => handleShow(request)}>Decision</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for decision */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Decision for Control Request ID: {selectedRequest ? selectedRequest.controlRequest.id : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <h5>Control Request Details</h5>
              <p><strong>Numéro:</strong> {selectedRequest.numero}</p>
              <p><strong>Code:</strong> {selectedRequest.code}</p>
              <p><strong>Désignation:</strong> {selectedRequest.designation}</p>
              <p><strong>Lot:</strong> {selectedRequest.lot}</p>
              <p><strong>Secteur:</strong> {selectedRequest.secteur}</p>
              <p><strong>Contrôles Demandés:</strong> {selectedRequest.controlesDemandes}</p>
              <p><strong>Date de Prélèvement:</strong> {new Date(selectedRequest.datePrelevement).toLocaleDateString()}</p>
              <p><strong>Date de Contrôle:</strong> {new Date(selectedRequest.dateControle).toLocaleDateString()}</p>
              <p><strong>Anomalie:</strong> {selectedRequest.anomalie || 'No anomaly'}</p>
              <p><strong>N° EVENT :</strong> {selectedRequest.eventNumber || 'No event number'}</p>
              <p><strong>N° Seau Barils-Caisse:</strong> {selectedRequest.numeroSeau || 'No number'}</p>
              <p><strong>Préleveur:</strong> {selectedRequest.preleveur || 'No preleveur'}</p>
              <p><strong>Temps Prélèvement:</strong> {selectedRequest.tempsPrelevement || 'No time'}</p>
              <p><strong>Contrôleur:</strong> {selectedRequest.controleur || 'No controleur'}</p>
              <p><strong>Temps Contrôle (Heures):</strong> {selectedRequest.tempsControleHeures || 'No time'}</p>
              <p><strong>Conformité:</strong> {selectedRequest.conformite}</p>
              <p><strong>Commentaires:</strong> {selectedRequest.commentaires || 'No comments'}</p>
              <p><strong>Visa:</strong> {selectedRequest.visa || 'No visa'}</p>
              <p><strong>Date de transmission</strong>{new Date(selectedRequest.dateTransmission).toLocaleDateString()}</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="dateDecision">
                  <Form.Label>Date of Decision</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateDecision}
                    onChange={(e) => setDateDecision(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="commentairesAQ">
                  <Form.Label>Commentaires AQ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentairesAQ}
                    onChange={(e) => setCommentairesAQ(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="decision">
                  <Form.Label>Decision</Form.Label>
                  <Form.Control
                    as="select"
                    value={decisionAQ}
                    onChange={(e) => setDecisionAQ(e.target.value)}
                    required
                  >
                    <option value="liberable">Liberable</option>
                    <option value="en quarantaine">En Quarantaine</option>
                    <option value="refuser">Refuser</option>
                  </Form.Control>
                </Form.Group>
                <hr/>
                <div className="d-flex justify-content-center">
                <Button style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }} type="submit">Submit Decision</Button>
                </div>
               
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResultsPage;
