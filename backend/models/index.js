const config = require("../config/db.config");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port,
  logging: console.log,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.js")(sequelize, Sequelize);
db.controlRequest = require("./controlRequest.js")(sequelize, Sequelize);
db.controlResult = require("./controlResult.js")(sequelize, Sequelize);
db.notification = require("./notification.js")(sequelize, Sequelize);

// Associations

// ControlRequest and User (CQ users)
db.controlRequest.belongsToMany(db.user, {
  through: "ControlRequestCQUsers",
  as: "assignedCQUsers",
  foreignKey: "controlRequestId",
  otherKey: "userId",
});

// User and ControlRequest
db.user.belongsToMany(db.controlRequest, {
  through: "ControlRequestCQUsers",
  as: "assignedControlRequests",
  foreignKey: "userId",
  otherKey: "controlRequestId",
});

// ControlRequest and ControlResult
db.controlRequest.hasOne(db.controlResult, {
  foreignKey: "controlRequestId",
  as: "controlResult",
});

db.controlResult.belongsTo(db.controlRequest, {
  foreignKey: "controlRequestId",
  as: "controlRequest",
});

// ControlResult and User (Evaluator)
db.controlResult.belongsTo(db.user, {
  foreignKey: "evaluatorId",
  as: "evaluator",
});

// Notification and User
db.notification.belongsTo(db.user, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = db;
