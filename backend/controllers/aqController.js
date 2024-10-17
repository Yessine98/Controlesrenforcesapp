const db = require('../models');
const { createNotification, notifyCQUsers } = require('../utils/notificationUtils');
const { Op } = require('sequelize');
const { getOnlineUsers, getSocketInstance } = require('../socket');



const ControlRequest = db.controlRequest;
const ControlResult = db.controlResult;
const User = db.user;


//Fetch CQ users
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
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const dayOfYear = Math.ceil((new Date() - new Date(year, 0, 0)) / 86400000);
      const numero = `CR-${dayOfYear}-${month}`;

      // Create control request
      const controlRequest = await ControlRequest.create({
          numero,
          code: req.body.code,
          produit: req.body.produit,
          lot: req.body.lot,
          motifControle: req.body.motifControle,
          controleAFaire: req.body.controleAFaire,
          delaiExecution: req.body.delaiExecution,
          secteur: req.body.secteur,
          status: 'pending',
          requesterId: req.userId,
      });

      // Assign CQ users if provided
      if (req.body.assignedCQUserIds) {
          await controlRequest.addAssignedCQUsers(req.body.assignedCQUserIds);
      }

      // Get the assigned CQ users
      const cqUsers = await controlRequest.getAssignedCQUsers();
      console.log("Assigned CQ Users:", cqUsers);

      const io = getSocketInstance(); // Get socket instance
      const onlineUsers = getOnlineUsers(); // Get online users
      const notifications = [];

      for (const user of cqUsers) {
          // Create notification for each CQ user
          const notification = await createNotification({
              recipientId: user.id,
              type: 'control_assigned',
              message: `New control request assigned for ${controlRequest.produit}.`,
              controlId: controlRequest.id,
          });

          // Emit notification via socket
          if (notification) {
              console.log("Created notification:", notification.dataValues);
              notifications.push(notification.dataValues);

              if (onlineUsers[user.id]) {
                  console.log(`Emitting notification to ${user.id}`);
                  io.to(onlineUsers[user.id]).emit('newNotification', {
                      ...notification.dataValues, // Send full notification data
                      createdAt: new Date(),
                      read: false, // Assuming the notification is unread initially
                  });
              } else {
                  console.warn(`User ID ${user.id} not found in onlineUsers. Notification not sent.`);
              }
          } else {
              console.error("Created notification is undefined.");
          }
      }

      res.status(201).send({ controlRequest, notifications });
  } catch (error) {
      console.error('Error creating control request:', error);
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

exports.getRefusedControlRequests = async (req, res) => {
  try {
    const refusedRequests = await ControlRequest.findAll({
      where: {
        status: 'refused' // Filter by 'refused' status
      },
      include: [{
        model: User, // Assuming the associated model is User
        as: 'assignedCQUsers', // Use the correct alias for the association
        attributes: ['id', 'username'] // Specify the fields you want to include
      }]
    });

    if (refusedRequests.length === 0) {
      return res.status(404).send({ message: 'No refused control requests found.' });
    }

    res.status(200).send(refusedRequests);
  } catch (error) {
    console.error("Error fetching refused control requests:", error);
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


// Cancel control request
// Cancel control request
exports.cancelControlRequest = async (req, res) => {
  try {
    const controlRequestId = req.params.id; // Extract control request ID from URL params
    const userId = req.userId; // The AQ user's ID from authentication

    // Debugging logs
    console.log('Request Params:', req.params);
    console.log('Control Request ID:', controlRequestId);

    if (!controlRequestId) {
      return res.status(400).json({ message: 'Control request ID is required.' });
    }

    // Find the control request
    const controlRequest = await ControlRequest.findOne({
      where: { id: controlRequestId, requesterId: userId, status: 'pending' } // Only allow cancellation if the status is pending and requester is the AQ user
    });

    if (!controlRequest) {
      return res.status(404).json({ message: 'Control request not found or already in progress.' });
    }

    // Update the status to cancelled
    controlRequest.status = 'cancelled';
    await controlRequest.save();

    // Notify the CQ users that the control request has been cancelled
    const cqUsers = await controlRequest.getAssignedCQUsers();
    const io = getSocketInstance(); // Get socket instance
    const onlineUsers = getOnlineUsers(); // Get online users

    for (const user of cqUsers) {
      // Create a cancellation notification
      const notification = await createNotification({
        recipientId: user.id,
        type: 'control_cancelled',
        message: `Control request for ${controlRequest.produit} has been cancelled.`,
        controlId: controlRequest.id,
      });

      // Emit the cancellation notification via socket if the user is online
      if (onlineUsers[user.id]) {
        io.to(onlineUsers[user.id]).emit('newNotification', {
          ...notification.dataValues,
          createdAt: new Date(),
          read: false,
        });
      }
    }

    res.status(200).json({ message: 'Control request cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling control request:', error);
    res.status(500).json({ message: error.message });
  }
};



