// notificationUtils.js
const db = require('../models');
const Notification = db.notification;

const createNotification = async ({ recipientId, type, message, controlId }) => {
    try {
        await Notification.create({
            recipientId,
            type,
            message,
            controlId,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};

// Function to create notifications for all CQ users associated with a control request
const notifyCQUsers = async (controlRequest, type, message) => {
    try {
        console.log("Fetching CQ users for control request:", controlRequest.id);
        const cqUsers = await controlRequest.getAssignedCQUsers();
        console.log("CQ Users:", cqUsers); // Log CQ users for debugging
        for (const user of cqUsers) {
            await createNotification({
                recipientId: user.id,
                type,
                message,
                controlId: controlRequest.id,
            });
        }
    } catch (error) {
        console.error("Error notifying CQ users:", error.message);
    }
};

module.exports = {
    createNotification,
    notifyCQUsers,
};
