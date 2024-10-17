// userRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');
const authJwt = require('../middlewares/authJwt');


// Admin reset password route
router.get('/users',authJwt.verifyToken,isAdmin,adminController.getAllUsers);
router.post('/reset-password', authJwt.verifyToken, isAdmin, adminController.adminResetPassword);

module.exports = router;
