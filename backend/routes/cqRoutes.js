const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const isCQ = require('../middlewares/isCQ');
const cqController = require('../controllers/cqController');


//CQ routes
router.get('/control-requests',authJwt.verifyToken,isCQ,cqController.getControlRequests);
router.put('/control-requests/:id/execute', authJwt.verifyToken, isCQ, cqController.markControlRequestInProgress);
router.get('/control-requests/in-progress',authJwt.verifyToken,isCQ,cqController.getInProgressControlsForUser);
router.post('/control-requests/:id/results', authJwt.verifyToken,isCQ,cqController.submitControlResult)
router.put('/control-requests/:id/refuse',authJwt.verifyToken,isCQ,cqController.refuseControlRequest)

module.exports = router;