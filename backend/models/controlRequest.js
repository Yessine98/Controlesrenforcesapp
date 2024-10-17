module.exports = (sequelize, Sequelize) => {
  const ControlRequest = sequelize.define('controlRequest', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    produit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lot: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    controleAFaire: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    delaiExecution: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pending', 'in progress', 'completed','cancelled','refused'),
      defaultValue: 'pending',
    },
    justification: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    requestMoreInfo: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    requesterId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false,
    },
    secteur: {
      type: Sequelize.ENUM('Routine', 'Validation'),
      allowNull: false,
    },
    numero: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return ControlRequest;
};
