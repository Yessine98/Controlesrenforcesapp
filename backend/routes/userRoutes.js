const express = require('express');
const verifySignUp = require('../middlewares/verifySignUp');
const controllers = require('../controllers/userControllers');
const authJwt = require('../middlewares/authJwt');


const router = express.Router();

router.route('/signup').post(
  verifySignUp.checkDuplicateUsernameOrEmail,
  controllers.signup
);

router.route('/signin').post(controllers.signin);





module.exports = router;