const db = require('../models');
const { Op } = require('sequelize'); 


const ControlRequest = db.controlRequest;
const ControlResult = db.controlResult;
const User = db.user;


//fetch all users
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

    exports.getArchivedResults = async (req, res) => {
        try {
          const archivedResults = await ControlResult.findAll({
            where: {
              decisionAQ: { 
                [Op.ne]: null, 
              },
              archived: true,  
            },
            include: [
              {
                model: ControlRequest,
                as: 'controlRequest', 
              },
            ],
            order: [['updatedAt', 'DESC']], 
          });
      
          res.status(200).json(archivedResults);
        } catch (error) {
          console.error('Error fetching archived results:', error);
          res.status(500).json({ message: 'Error fetching archived results' });
        }
      };
      
      exports.getAllControlRequests = async (req, res) => {
        try {
          const pendingRequests = await ControlRequest.findAll({
            include: [{
              model: User, 
              as: 'assignedCQUsers', 
              attributes: ['id', 'username']
            }]
          });
      
          if (pendingRequests.length === 0) {
            return res.status(404).send({ message: 'No control requests found.' });
          }
      
          res.status(200).send(pendingRequests);
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      };