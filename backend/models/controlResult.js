module.exports = (sequelize, Sequelize) => {
  const ControlResult = sequelize.define('controlResult', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lot: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    controlesDemandes: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateControle: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    numero: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    designation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secteur: {
      type: Sequelize.ENUM('validation', 'routine'),
      allowNull: false,
    },
    datePrelevement: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    anomalie: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numeroSeau: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tempsPrelevement: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    tempsControleHeures: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    eventNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    preleveur: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    controleur: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commentaires: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    dateTransmission: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    conformite: {
      type: Sequelize.ENUM('conforme', 'non-conforme'),
      allowNull: false,
    },
    visa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    decisionAQ: {
      type: Sequelize.ENUM('liberable', 'en quarantaine', 'refuser'),
      allowNull: true,
    },
    dateDecision: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    commentairesAQ: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    controlRequestId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'controlRequests',  // The name of the ControlRequest table
        key: 'id'
      },
      allowNull: false
    },
    evaluatorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',  // The name of the User table
        key: 'id'
      },
      allowNull: false
    }
  });


  return ControlResult;
};
