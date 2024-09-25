const db = require('../models');
const { createNotification } = require('../utils/notificationUtils');

const ControleRequest = db.controlRequest;
const ControleResult = db.controlResult;
const User=db.user

// Fetch all control requests
exports.getControlRequests = async (req, res) => {
  try {
    const cqUserId = req.userId; // Assuming userId is populated by the token middleware

    const controlRequests = await ControleRequest.findAll({
      include: [
        {
          model: User,
          as: 'assignedCQUsers', // Use the alias from your association
          where: { id: cqUserId }, // Filter by logged-in CQ user
          attributes: [], // We only care about the control request data
        },
      ],
    });

    if (controlRequests.length === 0) {
      return res.status(404).send({ message: 'No control requests found for this user.' });
    }

    res.status(200).send(controlRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.getInProgressControlsForUser = async (req, res) => {
  try {
    const cqUserId = req.userId; // Assuming 'req.userId' is populated by the middleware

    const controlRequests = await ControleRequest.findAll({
      include: [
        {
          model: User,
          as: 'assignedCQUsers', // Use the correct alias defined in associations
          where: { id: cqUserId }, // Filter by the current logged-in CQ user
          attributes: [], // Don't return the user details, only filter by them
        },
      ],
      where: {
        status: 'in progress', // Only return requests with this status
      },
    });

    if (controlRequests.length === 0) {
      return res.status(404).send({ message: 'No control requests found for this user.' });
    }

    res.status(200).send(controlRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




// Mark control request as in progress
exports.markControlRequestInProgress = async (req, res) => {
  try {
    const controlRequest = await ControleRequest.findByPk(req.params.id);
    if (!controlRequest) {
      return res.status(404).send({ message: 'Control request not found.' });
    }

    controlRequest.status = 'in progress';
    await controlRequest.save();

    // Notify AQ user about the progress
    await createNotification({
      recipientId: controlRequest.requesterId, // AQ user who requested the control
      type: 'control_in_progress',
      message: `Control request for ${controlRequest.produit} is now in progress.`,
      controlId: controlRequest.id
    });

    res.status(200).send({
      message: 'Control request marked as in progress',
      controlRequest: controlRequest
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};





// Submit control result
exports.submitControlResult = async (req, res) => {
  try {
    const controlRequest = await ControleRequest.findByPk(req.params.id);
    if (!controlRequest) {
      return res.status(404).send({ message: 'Control request not found.' });
    }
    
    const existingResult = await ControleResult.findOne({
      where: { controlRequestId: req.params.id }
    });

    if (existingResult) {
      return res.status(400).send({ message: 'Result already exists for this control request.' });
    }

    // Create the ControlResult using fields from the ControlRequest
    const controlResult = await ControleResult.create({
      code: controlRequest.code, // Pre-fill from ControlRequest
      lot: req.body.lot || controlRequest.lot, // Allow editing by CQ user
      controlesDemandes: req.body.controleAFaire || controlRequest.controleAFaire, // Allow editing
      dateControle: new Date(), // Current date for control
      numero: req.body.numero || controlRequest.numero, // Allow editing
      designation: req.body.produit || controlRequest.produit, // Allow editing
      secteur: req.body.secteur || controlRequest.secteur, // Allow editing
      datePrelevement: req.body.datePrelevement || null, // Optional, user can provide
      anomalie: req.body.anomalie || null, // Allow user to add anomaly
      numeroSeau: req.body.numeroSeau || null, // Optional
      tempsPrelevement: req.body.tempsPrelevement || null, // Optional
      tempsControleHeures: req.body.tempsControleHeures || null, // Optional
      eventNumber: req.body.eventNumber || null, // Optional
      preleveur: req.userId, // Assuming the logged-in user is the preleveur
      controleur: req.userId, // Assuming the logged-in user is the controleur
      commentaires: req.body.commentaires || '', // Allow CQ user to add comments
      dateTransmission: new Date(), // Set the current date for transmission
      conformite: req.body.result || 'conforme', // Set by the CQ user
      visa: req.body.visa, 
      decisionAQ: null, // This will be updated by AQ later
      dateDecision: null, // This will be updated by AQ later
      commentairesAQ: null, // This will be updated by AQ later
      archived: false, // Not archived yet
      controlRequestId: req.params.id, // Link to the original ControlRequest
      evaluatorId: req.userId, // Set to the logged-in user
    });
    

    // Update control request status
    controlRequest.status = 'completed';
    await controlRequest.save();

    // Notify AQ user about the submitted result
    await createNotification({
      recipientId: controlRequest.requesterId, // AQ user who requested the control
      type: 'result_submitted',
      message: `Control result for ${controlRequest.produit} has been submitted.`,
      controlId: controlRequest.id
    });

    res.status(201).send({
      message: 'Control result submitted successfully and request marked as completed',
      controlResult: controlResult
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

