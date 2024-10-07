import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button, Collapse, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ArchivePage = () => {
  const [archivedResults, setArchivedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null); // To track expanded cards

  // Function to map decision to card color
  const getCardVariant = (decisionAQ) => {
    switch (decisionAQ) {
      case 'liberable':
        return 'success'; // Green for liberable
      case 'en quarantaine':
        return 'warning'; // Yellow for en quarantaine
      case 'refuser':
        return 'danger'; // Red for refuser
      default:
        return 'secondary'; // Grey for undecided or null
    }
  };

  // Fetch archived results on component mount
  useEffect(() => {
    const fetchArchivedResults = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8080/api/aq/archived-results', {
          headers: {
            'x-access-token': token,
          },
        });
        setArchivedResults(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching archived results');
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedResults();
  }, []);

  // Handle card toggle
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Archive of Results</h2>
      <hr />
      {archivedResults.length === 0 ? (
        <Alert variant="info">No archived results found.</Alert>
      ) : (
        <Row>
          {archivedResults.map((result) => (
            <Col key={result.id} md={4} className="mb-3"> {/* Adjust the column size as needed */}
              <Card
                bg={getCardVariant(result.decisionAQ)}
                text={getCardVariant(result.decisionAQ) === 'warning' ? 'dark' : 'white'}
              >
                <Card.Body>
                  <p><strong>Produit:</strong> {result.controlRequest.produit}</p>
                  <p><strong>Conformité:</strong> {result.conformite}</p>
                  <p><strong>Decision AQ:</strong> {result.decisionAQ}</p>
                  <p><strong>Commentaires AQ:</strong> {result.commentairesAQ || 'No comments'}</p>
                  <p><strong>Date of Decision:</strong> {new Date(result.dateDecision).toLocaleDateString()}</p>
                  

                  {/* Toggle button to expand/collapse */}
                  <Button
                    variant="light"
                    onClick={() => toggleCard(result.id)}
                    aria-controls={`collapse-${result.id}`}
                    aria-expanded={expandedCard === result.id}
                  >
                    {expandedCard === result.id ? 'Hide Details' : 'View Details'}
                  </Button>

                  {/* Collapsible section for detailed information */}
                  <Collapse in={expandedCard === result.id}>
                    <div id={`collapse-${result.id}`}>
                      <hr />
                      <p><strong>Numero:</strong>{result.numero}</p>
                      <p><strong>Code:</strong>{result.code}</p>
                      <p><strong>Lot:</strong> {result.lot}</p>
                      <p><strong>Secteur:</strong>{result.controlRequest.secteur}</p>
                      <p><strong>Controles demandes:</strong>{result.controlRequest.controleAFaire}</p>
                      <p><strong>Date de Prelevement:</strong> {new Date(result.datePrelevement).toLocaleDateString()}</p>
                      <p><strong>Date de Controle:</strong> {new Date(result.dateControle).toLocaleDateString()}</p>
                      <p><strong>Anomalie:</strong> {result.anomalie || 'None'}</p>
                      <p><strong>N° Event: </strong>{result.eventNumber}</p>
                      <p><strong>N° Seau Barils-Caisse: </strong>{result.numeroSeau}</p>
                      <p><strong>Péleveur: </strong>{result.preleveur}</p>
                      <p><strong>Temps de Prelevement:</strong> {result.tempsPrelevement}</p>
                      <p><strong>Controleur:</strong> {result.controleur || 'N/A'}</p>
                      <p><strong>Temps de Controle:</strong> {result.tempsControleHeures} heures</p>
                      <p><strong>Commentaires: </strong>{result.commentaires}</p>
                      <p><strong>Visa:</strong> {result.visa || 'Not available'}</p>
                      <p><strong>Date de transmission: </strong>{new Date(result.dateTransmission).toLocaleDateString()}</p>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ArchivePage;
