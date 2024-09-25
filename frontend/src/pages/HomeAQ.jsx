import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useCreateControlRequest from '../hooks/useCreateControlRequest';

const HomeAQ = () => {
    const [show, setShow] = useState(false);
    const [produit, setProduit] = useState('');
    const [lot, setLot] = useState('');
    const [motifControle, setMotifControle] = useState('');
    const [controleAFaire, setControleAFaire] = useState('');
    const [delaiExecution, setDelaiExecution] = useState('');
    const [secteur, setSecteur] = useState('Routine'); // Default value
    const [assignedCQUserIds, setAssignedCQUserIds] = useState([]);
    const [numero, setNumero] = useState(`CR-${new Date().getFullYear().toString().slice(-2)}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`); // Editable
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
                motifControle,
                controleAFaire,
                delaiExecution,
                secteur,
                numero, // User-inputted numero
                code,   // User-inputted code
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
            <h2>Welcome to the Quality Control Management System</h2>
            <p>{currentDateTime}</p>

            <Button 
    style={{ 
        marginTop: '1rem', 
        backgroundColor: '#263F26', 
        color: 'white',  // Adjust text color to ensure readability
        border: 'none' // Optional: remove border if needed
    }} 
    onClick={handleShow}
>
    Add New Control
</Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Control</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Numero</Form.Label>
                            <Form.Control
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)} // Allow user to change numero
                            />
                        </Form.Group>
                        <Form.Group controlId="formCode">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)} // Allow user to change code
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formProduct">
                            <Form.Label>Product</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={produit}
                                onChange={(e) => setProduit(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLot">
                            <Form.Label>Lot Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter lot number"
                                value={lot}
                                onChange={(e) => setLot(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formMotifControle">
                            <Form.Label>Motif Controle</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter control motif"
                                value={motifControle}
                                onChange={(e) => setMotifControle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formControleAFaire">
                            <Form.Label>Controle à Faire</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter control to be done"
                                value={controleAFaire}
                                onChange={(e) => setControleAFaire(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDelaiExecution">
                            <Form.Label>Execution Deadline</Form.Label>
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
    <Form.Label>Assign CQ Users <span style={{ color: 'red' }}>*</span></Form.Label>
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
        Please select at least one CQ user.
    </Form.Control.Feedback>
</Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HomeAQ;
