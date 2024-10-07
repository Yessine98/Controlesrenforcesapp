const db = require('../models');
const Notification = db.notification;

// In your notifications controller
exports.getUserNotifications = async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  try {
      // Log the user ID being used
      console.log(`Fetching notifications for user ID: ${userId}`);

      // Find notifications for the specific user
      const notifications = await Notification.findAll({
          where: { recipientId: userId }, // Filter by recipientId
          order: [['createdAt', 'DESC']], // Optionally order by created date
      });
      res.json(notifications); // Send the notifications back as a response
  } catch (error) {
      console.error('Error fetching user notifications:', error);
      res.status(500).send({ message: error.message });
  }
};



// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).send({ message: 'Notification not found.' });
    }

    // Update notification status to read
    await notification.update({ read: true });

    res.status(200).send({ message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
      const { userId } = req.params;
      await Notification.update({ read: true }, { where: { recipientId: userId, read: false } });
      res.status(200).send({ message: 'All notifications marked as read.' });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};
