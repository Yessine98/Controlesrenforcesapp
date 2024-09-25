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
                  <p><strong>Date de Décision:</strong>{result.dateDecision}</p>

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
                      <p><strong>Lot:</strong> {result.lot}</p>
                      <p><strong>Designation:</strong> {result.controlRequest.designation}</p>
                      <p><strong>Motif Controle:</strong> {result.controlRequest.motifControle}</p>
                      <p><strong>Date of Decision:</strong> {new Date(result.dateDecision).toLocaleDateString()}</p>
                      <p><strong>Commentaires AQ:</strong> {result.commentairesAQ || 'No comments'}</p>
                      <p><strong>Temps Prelevement:</strong> {result.tempsPrelevement} minutes</p>
                      <p><strong>Temps Controle:</strong> {result.tempsControleHeures} hours</p>
                      <p><strong>Anomalie:</strong> {result.anomalie || 'None'}</p>
                      <p><strong>Visa:</strong> {result.visa || 'Not available'}</p>
                      <p><strong>Controleur:</strong> {result.controleur || 'N/A'}</p>
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
