const db = require("../models");
const { createNotification } = require("../utils/notificationUtils");
const { getOnlineUsers, getSocketInstance } = require("../socket");

const ControleRequest = db.controlRequest;
const ControleResult = db.controlResult;
const User = db.user;

// Fetch all control requests
exports.getControlRequests = async (req, res) => {
  try {
    const cqUserId = req.userId; // Assuming userId is populated by the token middleware

    const controlRequests = await ControleRequest.findAll({
      include: [
        {
          model: User,
          as: "assignedCQUsers", // Use the alias from your association
          where: { id: cqUserId }, // Filter by logged-in CQ user
          attributes: [], // We only care about the control request data
        },
      ],
    });

    if (controlRequests.length === 0) {
      return res
        .status(404)
        .send({ message: "No control requests found for this user." });
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
          as: "assignedCQUsers", // Use the correct alias defined in associations
          where: { id: cqUserId }, // Filter by the current logged-in CQ user
          attributes: [], // Don't return the user details, only filter by them
        },
      ],
      where: {
        status: "in progress", // Only return requests with this status
      },
    });

    if (controlRequests.length === 0) {
      return res
        .status(404)
        .send({ message: "No control requests found for this user." });
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
      return res.status(404).send({ message: "Control request not found." });
    }

    controlRequest.status = "in progress";
    await controlRequest.save();

    // Create a notification record
    const notification = await createNotification({
      recipientId: controlRequest.requesterId,
      type: "control_in_progress",
      message: `La demande de contrôle pour ${controlRequest.produit} est en cours.`,
      controlId: controlRequest.id,
    });

    // Emit notification to the requester via socket
    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();

    if (onlineUsers[controlRequest.requesterId]) {
      console.log(`Emitting notification to ${controlRequest.requesterId}`);
      io.to(onlineUsers[controlRequest.requesterId]).emit("newNotification", {
        ...notification.dataValues, // Spread the notification data
        createdAt: new Date(),
        read: false, // Assuming it's unread initially
      });
    } else {
      console.warn(
        `User ID ${controlRequest.requesterId} not found in onlineUsers.`
      );
    }

    res.status(200).send({
      message: "Control request marked as in progress",
      controlRequest,
    });
  } catch (error) {
    console.error("Error in markControlRequestInProgress:", error);
    res.status(500).send({ message: error.message });
  }
};

// Submit control result
exports.submitControlResult = async (req, res) => {
  try {
    const controlRequest = await ControleRequest.findByPk(req.params.id);
    if (!controlRequest) {
      console.log("Control request not found");
      return res.status(404).send({ message: "Control request not found." });
    }

    const existingResult = await ControleResult.findOne({
      where: { controlRequestId: req.params.id },
    });

    if (existingResult) {
      console.log("Result already exists for this control request");
      return res
        .status(400)
        .send({ message: "Result already exists for this control request." });
    }

    // Create the ControlResult
    const controlResult = await ControleResult.create({
      code: controlRequest.code,
      lot: req.body.lot || controlRequest.lot,
      controlesDemandes:
        req.body.controleAFaire || controlRequest.controleAFaire,
      dateControle: new Date(),
      numero: req.body.numero || controlRequest.numero,
      designation: req.body.produit || controlRequest.produit,
      secteur: req.body.secteur || controlRequest.secteur,
      numeroSeau: req.body.numeroSeau || null,
      eventNumber: req.body.eventNumber || null,
      commentaires: req.body.commentaires || "",
      dateTransmission: new Date(),
      conformite: req.body.conformite || "conforme",
      visa: req.body.visa,
      decisionAQ: null,
      dateDecision: null,
      commentairesAQ: null,
      archived: false,
      controlRequestId: req.params.id,
      evaluatorId: req.userId,
    });

    // Update control request status
    controlRequest.status = "completed";
    await controlRequest.save();

    console.log("Control result created and request marked as completed");

    // Notify AQ user about the submitted result
    const notification = await createNotification({
      recipientId: controlRequest.requesterId, // AQ user who requested the control
      type: "result_submitted",
      message: `Le résultat de contrôle pour ${controlRequest.produit} a été soumis.`,
      controlId: controlRequest.id,
    });

    console.log("Notification created:", notification);
    console.log("recipientId", controlRequest.recipientId);

    // Get Socket.io instance
    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();

    // Log online users
    console.log("Online users:", onlineUsers);

    // Emit notification to the requester if they are online
    if (onlineUsers[controlRequest.requesterId]) {
      console.log(`Emitting notification to ${controlRequest.requesterId}`);
      io.to(onlineUsers[controlRequest.requesterId]).emit("newNotification", {
        ...notification.dataValues, // Spread the notification data
        createdAt: new Date(),
        read: false, // Assuming it's unread initially
      });
    } else {
      console.warn(
        `User ID ${controlRequest.requesterId} not found in onlineUsers.`
      );
    }

    res.status(201).send({
      message:
        "Control result submitted successfully and request marked as completed",
      controlResult: controlResult,
    });
  } catch (error) {
    console.error("Error submitting control result:", error);
    res.status(500).send({ message: error.message });
  }
};

//Refuse control request
exports.refuseControlRequest = async (req, res) => {
  try {
    // Find the control request by ID
    const controlRequest = await ControleRequest.findByPk(req.params.id);
    if (!controlRequest) {
      console.log("Control request not found");
      return res.status(404).send({ message: "Control request not found." });
    }

    // Ensure the request hasn't already been refused or completed
    if (
      controlRequest.status === "completed" ||
      controlRequest.status === "refused"
    ) {
      console.log("Control request has already been processed");
      return res.status(400).send({
        message: "Control request has already been completed or refused.",
      });
    }

    // Update the control request with the refusal details
    controlRequest.status = "refused";
    controlRequest.justification =
      req.body.justification || "No justification provided";
    controlRequest.requestMoreInfo = req.body.requestMoreInfo || false; // Whether more info is requested

    await controlRequest.save(); // Save the updated control request

    console.log(
      "Control request refused and updated with justification and requestMoreInfo."
    );

    // Create a notification for the AQ user (requester)
    const notification = await createNotification({
      recipientId: controlRequest.requesterId, // AQ user who requested the control
      type: "control_refused",
      message: `La demande de contrôle pour ${controlRequest.produit} a été refusée.`,
      controlId: controlRequest.id,
    });

    console.log("Notification created:", notification);

    // Get Socket.io instance and online users
    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();

    // Log online users
    console.log("Online users:", onlineUsers);

    // Emit the refusal notification to the AQ (requester) if they are online
    if (onlineUsers[controlRequest.requesterId]) {
      console.log(
        `Emitting refusal notification to ${controlRequest.requesterId}`
      );
      io.to(onlineUsers[controlRequest.requesterId]).emit("newNotification", {
        ...notification.dataValues, // Spread the notification data
        createdAt: new Date(),
        read: false, // Assuming it's unread initially
      });
    } else {
      console.warn(
        `User ID ${controlRequest.requesterId} not found in onlineUsers.`
      );
    }

    res.status(200).send({
      message: "Control request refused successfully and notification sent",
      controlRequest: controlRequest,
    });
  } catch (error) {
    console.error("Error refusing control request:", error);
    res.status(500).send({ message: error.message });
  }
};
