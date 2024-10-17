const db = require("../models");
const { Op } = require('sequelize'); 
const bcrypt = require('bcryptjs');



const User = db.user;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
          where: {
            role: {
              [Op.or]: ['AQ', 'CQ'], 
            },
          },
        });
        
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching AQ or CQ users:', error);
        res.status(500).json({ message: error.message });
      }
    };

exports.adminResetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error ressetting password:',error)
      res.status(500).json({ message: 'Error resetting password.', error: error.message });
    }
  };