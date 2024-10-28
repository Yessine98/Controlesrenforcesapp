import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button, Collapse, Row, Col, Pagination, Form } from 'react-bootstrap';
import axios from 'axios';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component

const ArchivePage = () => {
  const [archivedResults, setArchivedResults] = useState([]); 
  const [filteredResults, setFilteredResults] = useState([]); // State for filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null); 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8); 

  // Sorting state
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

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
        setArchivedResults(response.data || []); // Set fetched results
        setFilteredResults(response.data || []); // Initialize filtered results with fetched data
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

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const results = archivedResults.filter((result) => {
      return (
        result.code?.toLowerCase().includes(term) || 
        result.numero?.toLowerCase().includes(term) || 
        result.lot?.toLowerCase().includes(term) ||
        result.controlRequest.produit?.toLowerCase().includes(term) || // Match on 'produit'
        result.conformite?.toLowerCase().includes(term) || // Match on 'conformité'
        result.decisionAQ?.toLowerCase().includes(term) || // Match on 'decisionAQ'
        result.controlRequest.secteur?.toLowerCase().includes(term) // Match on 'secteur'
      );
    });
    setFilteredResults(results);
    setCurrentPage(1); // Reset to the first page after search
  };

  // Sort results based on the selected order
  const sortResults = (order) => {
    const sortedResults = [...filteredResults].sort((a, b) => {
      const dateA = new Date(a.dateDecision);
      const dateB = new Date(b.dateDecision);
      return order === 'asc' ? dateA - dateB : dateB - dateA; // Ascending or descending
    });
    setFilteredResults(sortedResults);
  };

  // Handle sort order change
  const handleSortChange = (event) => {
    const newOrder = event.target.value;
    setSortOrder(newOrder);
    sortResults(newOrder); // Sort the results whenever the order changes
  };

  // Pagination logic: Calculate the indices of the results to display on the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult); // Use filteredResults instead of archivedResults

  // Handle pagination page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {/* Flexbox to align h2, SearchBar, and Sort Dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Archive of Results</h2>
        <div className="d-flex align-items-center">
          {/* Sort Dropdown */}
          <Form.Select value={sortOrder} onChange={handleSortChange} style={{ width: '150px', marginRight: '10px' }}>
            <option value="asc">Trier par Date (Croissant)</option>
            <option value="desc">Trier par Date (Décroissant)</option>
          </Form.Select>
          {/* Make the search bar smaller with size="sm" */}
          <div style={{ maxWidth: '300px' }}> {/* You can adjust the width as needed */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <hr />

      {filteredResults.length === 0 ? (
        <Alert variant="info">No archived results found.</Alert>
      ) : (
        <>
          <Row>
            {currentResults.map((result) => (
              <Col key={result.id} md={3} className="mb-3">
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
                    
                    <Button
                      variant="light"
                      onClick={() => toggleCard(result.id)}
                      aria-controls={`collapse-${result.id}`}
                      aria-expanded={expandedCard === result.id}
                    >
                      {expandedCard === result.id ? 'Hide Details' : 'View Details'}
                    </Button>

                    <Collapse in={expandedCard === result.id}>
                      <div id={`collapse-${result.id}`}>
                        <hr />
                        <p><strong>Numero:</strong>{result.numero}</p>
                        <p><strong>Code:</strong>{result.code}</p>
                        <p><strong>Lot:</strong> {result.lot}</p>
                        <p><strong>Secteur:</strong>{result.controlRequest.secteur}</p>
                        <p><strong>Controles demandes:</strong>{result.controlRequest.controleAFaire}</p>
                        <p><strong>Date de Controle:</strong> {new Date(result.dateControle).toLocaleDateString()}</p>
                        <p><strong>N° Event: </strong>{result.eventNumber}</p>
                        <p><strong>N° Seau Barils-Caisse: </strong>{result.numeroSeau}</p>
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

          {/* Pagination */}
          <Pagination className='d-flex justify-content-center'>
            {Array.from({ length: Math.ceil(filteredResults.length / resultsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ArchivePage;
