module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Please provide a username' },
        notEmpty: { args: true, msg: 'Username cannot be empty' }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Please provide an email' },
        isEmail: { args: true, msg: 'Please provide a valid email' },
        notEmpty: { args: true, msg: 'Email cannot be empty' }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a password' },
        notEmpty: { args: true, msg: 'Password cannot be empty' }
      }
    },
    role: {
      type: Sequelize.ENUM('AQ', 'CQ', 'manager'),
      allowNull: false,
      defaultValue: 'AQ',
      validate: {
        notNull: { msg: 'Please provide a role' },
        notEmpty: { args: true, msg: 'Role cannot be empty' }
      }
    }
  });

  return User;
}