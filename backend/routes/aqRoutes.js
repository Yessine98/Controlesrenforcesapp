const express = require ('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');

const isAQ = require('../middlewares/isAQ');
const isAQManger = require('../middlewares/isAQManager')
const aqController = require('../controllers/aqController');


//AQ routes
router.get('/cqusers', authJwt.verifyToken, isAQ, aqController.getCQUsers);
router.post('/control-requests', authJwt.verifyToken, isAQ, aqController.createControleRequest);
router.get('/control-requests/pending', authJwt.verifyToken, isAQ, aqController.getPendingControlRequests);
router.get('/completed-requests', authJwt.verifyToken, isAQ, aqController.getCompletedControlRequests);
router.put('/completed-requests/:id/decision', authJwt.verifyToken, isAQ, aqController.updateControlResult);
router.get('/archived-results', authJwt.verifyToken, isAQManger,aqController.getArchivedResults);
router.put('/controlRequest/cancel/:id', authJwt.verifyToken,isAQ, aqController.cancelControlRequest);
router.get('/controlRequest/refused', authJwt.verifyToken,isAQ, aqController.getRefusedControlRequests);




module.exports = router;