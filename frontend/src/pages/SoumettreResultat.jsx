import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import useInProgressControls from '../hooks/useInProgressControls'; // Custom hook



const SoumettreResultat = () => {
  const { inProgressControls, setInProgressControls, loading, error } = useInProgressControls();
  const [showModal, setShowModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const [resultData, setResultData] = useState({
    code: '',
    lot: '',
    controlesDemandes: '',
    dateControle: '',
    numero: '',
    designation: '',
    secteur: '',
    datePrelevement: '',
    anomalie: '',
    numeroSeau: '',
    tempsPrelevement: '',
    tempsControleHeures: '',
    eventNumber: '',
    preleveur: '',
    controleur: '',
    commentaires: '',
    conformite: '',
    visa: '',
    dateTransmission:''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedControl(null);
    setResultData({
      code: '',
      lot: '',
      controlesDemandes: '',
      dateControle: '',
      numero: '',
      designation: '',
      secteur: '',
      datePrelevement: '',
      anomalie: '',
      numeroSeau: '',
      tempsPrelevement: '',
      tempsControleHeures: '',
      eventNumber: '',
      preleveur: '',
      controleur: '',
      commentaires: '',
      conformite: 'conforme',
      visa: '',
      dateTransmission:''
    });
    setSubmitSuccess(false); // Reset success message
    setSubmitError(''); // Reset error message
  };

  const handleShowModal = (control) => {
    setSelectedControl(control);
    setShowModal(true);
  };

  useEffect(() => {
    if (selectedControl) {
      setResultData({
        code: selectedControl.code || '',
        lot: selectedControl.lot || '',
        controlesDemandes: selectedControl.controleAFaire || '',
        dateControle: '', // User needs to input
        numero: selectedControl.numero || '',
        designation: selectedControl.produit || '',
        secteur: selectedControl.secteur || '',
        datePrelevement: '', // User needs to input
        anomalie: '',
        numeroSeau: '',
        tempsPrelevement: '',
        tempsControleHeures: '',
        eventNumber: '',
        preleveur: '', // User needs to input
        controleur: '', // User needs to input
        commentaires: '',
        conformite: 'conforme',
        visa: '',
        dateTransmission:''
      });
    }
  }, [selectedControl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResultData({ ...resultData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedControl || !selectedControl.id) {
      setSubmitError('Please select a valid control before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://localhost:8080/api/cq/control-requests/${selectedControl.id}/results`,
        {
          ...resultData,
          secteur: resultData.secteur.toLowerCase(),
          dateTransmission: new Date().toISOString(),
        },
        {
          headers: {
            'x-access-token': token,
          },
        }
      );
      setSubmitSuccess(true);
      setSubmitError('');
      setInProgressControls((prevControls) =>
        prevControls.filter((control) => control.id !== selectedControl.id)
      );
      handleCloseModal();
    } catch (err) {
      setSubmitError(
        'Error submitting result: ' + (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container style={{ marginTop: '20px' }}>
      <h2>Soumettre un Résultat</h2>
      <hr />
  
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : inProgressControls.length === 0 ? (
        <p>Aucun contrôle en cours à soumettre.</p> // Message when no controls are available
      ) : (
        <Row>
          {inProgressControls.map((control) => (
            <Col key={control.id} xs={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{control.produit}</Card.Title>
                  <Card.Text>
                    <strong>Numero:</strong> {control.numero} <br />
                    <strong>Code:</strong> {control.code} <br />
                    <strong>Lot:</strong> {control.lot} <br />
                    <strong>Contrôles Demandés:</strong> {control.controleAFaire} <br />
                    <strong>Secteur:</strong> {control.secteur} <br />
                    <strong>Execution Deadline:</strong> {new Date (control.delaiExecution).toLocaleDateString()} <br />
                  </Card.Text>
                  <Button
                    style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}} 
                    onClick={() => handleShowModal(control)}
                  >
                    Soumettre
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for submitting the result */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Soumettre un Résultat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Pre-filled fields from ControlRequest but editable */}
            <Form.Group controlId="numero">
              <Form.Label>Numéro</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={resultData.numero}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="code">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={resultData.code}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="designation">
              <Form.Label>Désignation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={resultData.designation}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="lot">
              <Form.Label>Lot</Form.Label>
              <Form.Control
                type="text"
                name="lot"
                value={resultData.lot}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="secteur">
              <Form.Label>Secteur</Form.Label>
              <Form.Control
                as="select"
                name="secteur"
                value={resultData.secteur}
                onChange={handleChange}
                required
              >
                
                <option value="validation">Validation</option>
                <option value="routine">Routine</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="controlesDemandes">
              <Form.Label>Contrôles Demandés</Form.Label>
              <Form.Control
                type="text"
                name="controlesDemandes"
                value={resultData.controlesDemandes}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="datePrelevement">
              <Form.Label>Date de Prélèvement</Form.Label>
              <Form.Control
                type="date"
                name="datePrelevement"
                value={resultData.datePrelevement}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="dateControle">
              <Form.Label>Date de Contrôle</Form.Label>
              <Form.Control
                type="date"
                name="dateControle"
                value={resultData.dateControle}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="anomalie">
              <Form.Label>Anomalie</Form.Label>
              <Form.Control
                type="text"
                name="anomalie"
                value={resultData.anomalie}
                onChange={handleChange}
                placeholder="Anomalie (optional)"
              />
            </Form.Group>

            <Form.Group controlId="eventNumber">
              <Form.Label>N° EVENT </Form.Label>
              <Form.Control
                type="text"
                name="eventNumber"
                value={resultData.eventNumber}
                onChange={handleChange}
                placeholder="Numéro d'Événement (optional)"
              />
            </Form.Group>

            <Form.Group controlId="numeroSeau">
              <Form.Label>N° Seau Barils-Caisse</Form.Label>
              <Form.Control
                type="text"
                name="numeroSeau"
                value={resultData.numeroSeau}
                onChange={handleChange}
                placeholder="Numéro Seau (optional)"
              />
            </Form.Group>

            <Form.Group controlId="preleveur">
              <Form.Label>Préleveur</Form.Label>
              <Form.Control
                type="text"
                name="preleveur"
                value={resultData.preleveur}
                onChange={handleChange}
                placeholder="Préleveur (optional)"
                required
              />
            </Form.Group>

            <Form.Group controlId="tempsPrelevement">
              <Form.Label>Temps de Prélèvement</Form.Label>
              <Form.Control
                type="number"
                name="tempsPrelevement"
                value={resultData.tempsPrelevement}
                onChange={handleChange}
                placeholder="Temps de Prélèvement (optional)"
              />
            </Form.Group>

            <Form.Group controlId="controleur">
              <Form.Label>Contrôleur</Form.Label>
              <Form.Control
                type="text"
                name="controleur"
                value={resultData.controleur}
                onChange={handleChange}
                placeholder="Contrôleur (optional)"
                required
              />
            </Form.Group>

            <Form.Group controlId="tempsControleHeures">
              <Form.Label>Temps de Contrôle (en heures)</Form.Label>
              <Form.Control
                type="number"
                name="tempsControleHeures"
                value={resultData.tempsControleHeures}
                onChange={handleChange}
                placeholder="Temps de Contrôle (optional)"
              />
            </Form.Group>

            <Form.Group controlId="conformite">
              <Form.Label>Conformité</Form.Label>
              <Form.Control
                as="select"
                name="conformite"
                value={resultData.conformite}
                onChange={handleChange}
                required
              >
                <option value="conforme">Conforme</option>
                <option value="non-conforme">Non Conforme</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="commentaires">
              <Form.Label>Commentaires</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="commentaires"
                value={resultData.commentaires}
                onChange={handleChange}
                placeholder="Commentaires (optional)"
              />
            </Form.Group>


            <Form.Group controlId="visa">
              <Form.Label>Visa</Form.Label>
              <Form.Control
                type="text"
                name="visa"
                value={resultData.visa}
                onChange={handleChange}
                placeholder="Visa (optional)"
              />
            </Form.Group>

            <Form.Group controlId="dateTransmission">
              <Form.Label>Date de transmission</Form.Label>
              <Form.Control
                type="date"
                name="dateTransmission"
                value={resultData.dateTransmission}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <hr />

            {submitError && <p className="text-danger">{submitError}</p>}
            {submitSuccess && <p className="text-success">Result submitted successfully!</p>}

            <div className="d-flex justify-content-center">
               <Button style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}} type="submit">
                 Soumettre
                 </Button>
                 </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SoumettreResultat;
