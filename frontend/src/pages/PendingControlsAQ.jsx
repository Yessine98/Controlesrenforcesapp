import React from 'react';
import { Card, Col, Row, Container, Button } from 'react-bootstrap';
import useControlRequests from '../hooks/useControlRequests';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


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
      await axios.put(`${apiUrl}/aq/controlRequest/cancel/${controlRequestId}`, null, { headers });
      alert('Demande de contrôle annulée avec succès.');
      // Optionally refresh the list of requests or update the state
    } catch (error) {
      alert("Erreur lors de l'annulation de la demande de contrôle.");
      console.log(error);
    }
  };

  return (
    <Container>
      {/* Always display the header and horizontal rule */}
      <h2 className="my-4">Demandes de Contrôle en Attente</h2>
      <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
      Contrôles créés par vous qui n'ont pas encore été exécutés ou refusés.
    </span>      <hr />
      {controlRequests.length === 0 ? (
        <p>Aucune demande de contrôle en attente trouvée.</p>
      ) : (
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
                    Utilisateurs CQ Assignés: {request.assignedCQUsers.map(user => user.username).join(', ') || 'None'}
                  </Card.Text>
                  {request.status === 'pending' && (
                    <Button
                      style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)' }}
                      onClick={() => handleCancel(request.id)}
                    >
                      Annuler
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PendingControlsAQ;
