import React, { useEffect, useState } from 'react';
import { Table ,Container} from 'react-bootstrap';
import axios from 'axios';

const RefusedControls = () => {
  const [refusedControls, setRefusedControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch refused control requests
  useEffect(() => {
    const fetchRefusedControls = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/aq/controlRequest/refused', {
          headers: {
            'x-access-token': token,
          },
        });
        setRefusedControls(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching refused controls:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRefusedControls();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!refusedControls || refusedControls.length === 0) {
    return <p>No refused controls available.</p>;
  }

  return (
    <Container>
         <h2 className="my-4">Refused Control Requests</h2>
         <hr />
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Code</th>
          <th>Numero</th>
          <th>Lot</th>
          <th>Secteur</th>
          <th>Control à faire</th>
          <th>Justification</th>
          <th>Request More Info</th>
          <th>Date of Refusal</th>
        </tr>
      </thead>
      <tbody>
        {refusedControls.map(control => (
          <tr key={control.id}>
            <td>{control.code}</td>
            <td>{control.numero}</td>
            <td>{control.lot}</td>
            <td>{control.secteur}</td>
            <td>{control.controleAFaire}</td>
            <td>{control.justification || 'No justification provided'}</td>
            <td>{control.requestMoreInfo || 'No additional information requested'}</td>
            <td>{new Date(control.updatedAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </Container>
  );
};

export default RefusedControls;
