import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useCreateControlRequest from '../hooks/useCreateControlRequest';

const HomeAQ = () => {
    const [show, setShow] = useState(false);
    const [produit, setProduit] = useState('');
    const [lot, setLot] = useState('');
    const [controleAFaire, setControleAFaire] = useState('');
    const [delaiExecution, setDelaiExecution] = useState('');
    const [secteur, setSecteur] = useState('Routine'); // Default value
    const [assignedCQUserIds, setAssignedCQUserIds] = useState([]);
    const [numero, setNumero] = useState(`CR-${new Date().getFullYear().toString().slice(-2)}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)
    const [code, setCode] = useState(''); // Editable

    const { createControlRequest, fetchCQUsers, cqUsers, loading, error } = useCreateControlRequest();

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        await fetchCQUsers(); 
        setShow(true);
    };

    const currentDateTime = new Date().toLocaleString();

    const handleSubmit = async () => {
        try {
            const response = await createControlRequest({
                produit,
                lot,
                controleAFaire,
                delaiExecution,
                secteur,
                numero, 
                code,   
                assignedCQUserIds,
            });
            console.log(response);
            handleClose();
        } catch (error) {
            console.error('Error creating control request:', error);
        }
    };

    return (
        <div className="home-page" style={{ padding: '2rem' }}>
            <h2>Bienvenue dans le Système de Gestion des Contrôles Renforcées</h2>
            <p>{currentDateTime}</p>

            <Button 
    style={{ 
        marginTop: '1rem', 
        background: 'linear-gradient(to right,#263F26,#9EAA9E)', 
        color: 'white',  
        border: 'none' 
    }} 
    onClick={handleShow}
>
     Ajouter un Nouveau Contrôle
</Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Nouveau Contrôle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numero</Form.Label>
                            <Form.Control
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formCode">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)} 
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formProduct">
                            <Form.Label>Produit</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ajouter le produit"
                                value={produit}
                                onChange={(e) => setProduit(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLot">
                            <Form.Label>Lot</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ajouter le lot"
                                value={lot}
                                onChange={(e) => setLot(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formControleAFaire">
                            <Form.Label>Controle à Faire</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter le control a faire"
                                value={controleAFaire}
                                onChange={(e) => setControleAFaire(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDelaiExecution">
                            <Form.Label>Date Limite d'Exécution</Form.Label>
                            <Form.Control
                                type="date"
                                value={delaiExecution}
                                onChange={(e) => setDelaiExecution(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formSecteur">
                            <Form.Label>Secteur</Form.Label>
                            <Form.Control
                                as="select"
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                            >
                                <option value="Routine">Routine</option>
                                <option value="Validation">Validation</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formAssignedCQUsers">
    <Form.Label>Attribuer des Utilisateurs CQ <span style={{ color: 'red' }}>*</span></Form.Label>
    <Form.Control
        as="select"
        multiple
        value={assignedCQUserIds}
        onChange={(e) => {
            const options = e.target.options;
            const values = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }
            setAssignedCQUserIds(values);
        }}
        isInvalid={!assignedCQUserIds.length} // Add validation feedback
    >
        {cqUsers.map(user => (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        ))}
    </Form.Control>
    <Form.Control.Feedback type="invalid">
    Veuillez sélectionner au moins un utilisateur CQ.
    </Form.Control.Feedback>
</Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{background:'linear-gradient(to right,#9EAA9E,#263F26)'}} onClick={handleClose}>
                    Fermer
                    </Button>
                    <Button 
                    style={{background:'linear-gradient(to right,#263F26,#9EAA9E)'}} onClick={handleSubmit}>
                        Enregistrer les Modifications
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HomeAQ;
