module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notifications", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipientId: {
      type: Sequelize.INTEGER, // This will store either AQ or CQ's ID
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING, // E.g., "control_assigned", "result_submitted"
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING, // A short message explaining the notification
      allowNull: false,
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set to true when the user reads the notification
    },
    controlId: {
      type: Sequelize.INTEGER, // Link to the control or result involved
      allowNull: true,
    },
    createdAt: Sequelize.DATE,
  });

  return Notification;
};
