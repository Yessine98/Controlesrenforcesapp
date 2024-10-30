import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


const HomeCQ = () => {
  const [inProgressControls, setInProgressControls] = useState([]);
  const [error, setError] = useState('');
  const currentDateTime = new Date().toLocaleString();


  useEffect(() => {
    const fetchInProgressControls = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${apiUrl}/cq/control-requests/in-progress`, {
          headers: {
            'x-access-token': token,
          },
        });
        console.log("API Response:", response.data); // Check the API response here
        setInProgressControls(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
      } catch (error) {
        setError('Could not fetch in-progress controls');
        console.error('Error fetching in-progress controls:', error);
      }
    };

    fetchInProgressControls();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR'); // Format for French locale (dd/mm/yyyy)
  };

  return (
    <Container>
        <div style={{ padding: '2rem' }}>
     <h2>Bienvenue dans le Système de Gestion des Contrôles Renforcées</h2>
     <p>{currentDateTime}</p>
     <hr />
      <h3 >Rappels pour les Contrôles en Cours:</h3>
      {inProgressControls.length > 0 ? (
        <ul>
          {inProgressControls.map((control) => (
            <li key={control.id}>
              Contrôle: {control.numero}, lot: {control.lot} - Deadline d'execution: {formatDate(control.delaiExecution)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun contrôle en cours .</p>
      )}
           </div>

    </Container>
  );
};

export default HomeCQ;
