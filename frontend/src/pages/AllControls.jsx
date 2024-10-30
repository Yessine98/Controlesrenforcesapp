import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Modal, Button } from 'react-bootstrap';
const apiUrl = import.meta.env.VITE_API_URL;


const AllControls = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // State for filter
  const [showModal, setShowModal] = useState(false); // State for modal
  const [selectedControl, setSelectedControl] = useState(null); // State for selected control

  useEffect(() => {
    const fetchControls = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${apiUrl}/manager/controls`, {
          headers: {
            'x-access-token': token,
          },
        });
        setControls(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching controls');
      } finally {
        setLoading(false);
      }
    };

    fetchControls();
  }, []);

  // Filter controls based on the selected status
  const filteredControls = controls.filter(control => {
    if (filter === 'all') return true;
    return control.status === filter;
  });

  const handleShowModal = (control) => {
    setSelectedControl(control);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedControl(null);
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Controls List</h2>
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produit</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredControls.map(control => (
            <tr key={control.id}>
              <td>{control.id}</td>
              <td>{control.produit}</td>
              <td>{control.status}</td>
              <td>
                <button style={{backgroundColor:'#FF78D2'}} className="btn btn-info" onClick={() => handleShowModal(control)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for control details */}
      {selectedControl && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Control Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <h5>{selectedControl.produit}</h5>
  <p><strong>Numero:</strong> {selectedControl.numero}</p>
  <p><strong>Code:</strong> {selectedControl.code}</p>
  <p><strong>Lot:</strong> {selectedControl.lot}</p>
  <p><strong>Contrôle à faire:</strong> {selectedControl.controleAFaire}</p>
  <p><strong>Délai d'exécution:</strong> {new Date(selectedControl.delaiExecution).toLocaleDateString()}</p>
  <p>
    <strong>Assigned CQ Users:</strong> 
    {selectedControl.assignedCQUsers.map(user => user.username).join(', ')}
  </p>
</Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AllControls;
