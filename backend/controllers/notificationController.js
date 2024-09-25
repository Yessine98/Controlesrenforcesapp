const db = require('../models');
const Notification = db.notification;

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
