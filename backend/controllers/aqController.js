const db = require('../models');
const { createNotification, notifyCQUsers } = require('../utils/notificationUtils');
const { Op } = require('sequelize');

const ControlRequest = db.controlRequest;
const ControlResult = db.controlResult;

//Fetch CQ users
// controllers/aqController.js
const User = db.user;

exports.getCQUsers = async (req, res) => {
  try {
    const cqUsers = await User.findAll({ where: { role: 'CQ' } });
    res.status(200).json(cqUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new control request

exports.createControleRequest = async (req, res) => {
  try {
    // Generate the numero in the format CR-24
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dayOfYear = Math.ceil((new Date() - new Date(year, 0, 0)) / 86400000); // Calculate the day of the year
    const numero = `CR-${dayOfYear}-${month}`;


    const controlRequest = await ControlRequest.create({
      numero:req.body.numero, 
      code:req.body.code,   
      produit: req.body.produit,
      lot: req.body.lot,
      motifControle: req.body.motifControle,
      controleAFaire: req.body.controleAFaire,
      delaiExecution: req.body.delaiExecution,
      secteur:req.body.secteur,
      status: 'pending',
      requesterId: req.userId,
    });

    // Assign CQ users to the control request
    if (req.body.assignedCQUserIds) {
      await controlRequest.addAssignedCQUsers(req.body.assignedCQUserIds);
    }

    // Notify CQ users about the new control request
    const cqUsers = await controlRequest.getAssignedCQUsers();
    for (const user of cqUsers) {
      await createNotification({
        recipientId: user.id,
        type: 'control_assigned',
        message: `New control request assigned for ${controlRequest.produit}.`,
        controlId: controlRequest.id,
      });
    }
    
    res.status(201).send(controlRequest);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




    

// Get all pending control requests
exports.getPendingControlRequests = async (req, res) => {
  try {
    const pendingRequests = await ControlRequest.findAll({
      where: {
        status: 'pending'
      },
      include: [{
        model: User, // Assuming the associated model is User
        as: 'assignedCQUsers', // Use the correct alias for the association
        attributes: ['id', 'username'] // Specify the fields you want to include
      }]
    });

    if (pendingRequests.length === 0) {
      return res.status(404).send({ message: 'No pending control requests found.' });
    }

    res.status(200).send(pendingRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


// View completed control requests along with their associated results
exports.getCompletedControlRequests = async (req, res) => {
  try {
    const results = await ControlResult.findAll({
        where: {
            archived: false,  // Results not archived yet
            decisionAQ: null, // Only show results where AQ has not yet made a decision
        },
        include: [{
            model: ControlRequest,
            as: 'controlRequest', // Use the alias defined in your model association
        }],
    });
    
    // Check if results are returned
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error retrieving results:', error.message); // More specific error logging
    res.status(500).json({ message: 'Error retrieving results' });
  }
};


// Make a decision on a control result
exports.updateControlResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateDecision, commentairesAQ, decisionAQ } = req.body;

    const controlResult = await ControlResult.findByPk(id);
    
    if (!controlResult) {
      return res.status(404).json({ message: 'Control result not found' });
    }

    // Update the decision and mark as archived
    controlResult.decisionAQ = decisionAQ;
    controlResult.dateDecision = dateDecision;
    controlResult.commentairesAQ = commentairesAQ;
    controlResult.archived = true; // Mark as archived

    await controlResult.save();

    res.status(200).json({ message: 'Decision submitted successfully' });
  } catch (error) {
    console.error('Error submitting decision:', error);
    res.status(500).json({ message: 'Error submitting decision' });
  }
};

exports.getArchivedResults = async (req, res) => {
  try {
    const archivedResults = await ControlResult.findAll({
      where: {
        decisionAQ: { 
          [Op.ne]: null,  // Ensure decisionAQ is not null
        },
        archived: true,  // Ensure the result is archived
      },
      include: [
        {
          model: ControlRequest,
          as: 'controlRequest', // Ensure the control request is included
        },
      ],
      order: [['updatedAt', 'DESC']], // Order by the most recent decision
    });

    res.status(200).json(archivedResults);
  } catch (error) {
    console.error('Error fetching archived results:', error);
    res.status(500).json({ message: 'Error fetching archived results' });
  }
};
