const express = require("express");
const verifySignUp = require("../middlewares/verifySignUp");
const controllers = require("../controllers/userControllers");
const authJwt = require("../middlewares/authJwt");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

router
  .route("/signup")
  .post(verifySignUp.checkDuplicateUsernameOrEmail, controllers.signup);

router.route("/signin").post(controllers.signin);

// Get user profile
router.get("/profile", authJwt.verifyToken, userControllers.getUserProfile);

// Update user profile
router.put("/profile", authJwt.verifyToken, userControllers.updateUserProfile);

router.post("/forgot-password", userControllers.forgotPassword);

module.exports = router;
