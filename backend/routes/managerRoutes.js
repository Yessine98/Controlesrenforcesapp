const express = require ('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');

const isManager = require('../middlewares/isManager');
const isAQManger = require('../middlewares/isAQManager')
const managerController = require('../controllers/managerController');

router.get('/users',authJwt.verifyToken,isManager,managerController.getAllUsers);
router.get('/archived-results', authJwt.verifyToken, isAQManger,managerController.getArchivedResults);
router.get('/controls',authJwt.verifyToken,managerController.getAllControlRequests);




module.exports = router;