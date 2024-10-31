const db = require("../models");
const config = require("../config/auth.config");

const User = db.user;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const { createNotification } = require("../utils/notificationUtils"); // Adjust the path based on your project structure
const { getOnlineUsers, getSocketInstance } = require("../socket");

exports.signup = (req, res) => {
  // Normalize email to lowercase
  const normalizedEmail = req.body.email.toLowerCase();

  // Validate email format
  if (!normalizedEmail.includes("@sanofi.com")) {
    return res
      .status(400)
      .send({ message: 'Email must contain "@sanofi.com"' });
  }

  // Validate password length
  if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be at least 8 characters long" });
  }

  // Check if user with the email already exists
  User.findOne({ where: { email: normalizedEmail } })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({ message: "Email is already in use." });
      }

      // Save User to Database
      return User.create({
        username: req.body.username,
        email: normalizedEmail, // Store normalized email
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
      });
    })
    .then(() => {
      res.send({ message: "L'utilisateur a été enregistré avec succès!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe incorrect!",
        });
      }

      let token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
        expiresIn: "365d", // 24 hours
      });
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ username: user.username });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the current password is provided and valid
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Current password is incorrect" });
      }
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Hash and update password if provided
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    console.log("Profile updated");
    res.status(200).send({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body; // Get email from request body

  try {
    // Check if the user with the given email exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Fetch all admin users
    const adminUsers = await User.findAll({ where: { role: "admin" } });

    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();

    // Create a notification for each admin user
    for (const admin of adminUsers) {
      const notification = await createNotification({
        recipientId: admin.id,
        type: "password_reset_request",
        message: `L'utilisateur avec l'email ${email} a demandé à réinitialiser son mot de passe.`,
        controlId: null, // No controlId is applicable here
      });

      console.log(`Notification created for admin ${admin.id}:`, notification);

      if (notification) {
        // Emit notification to the admin if they are online
        if (onlineUsers[admin.id]) {
          console.log(`Emitting notification to admin ${admin.id}`);
          io.to(onlineUsers[admin.id]).emit("newNotification", {
            ...notification.dataValues, // Spread the notification data
            createdAt: new Date(),
            read: false, // Assuming it's unread initially
          });
        } else {
          console.warn(`Admin ID ${admin.id} not found in onlineUsers.`);
        }
      } else {
        console.error(`Failed to create notification for admin ${admin.id}`);
      }
    }

    // Respond to the user
    res.status(200).send({
      message: "Password reset request processed. The admin has been notified.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send({ message: error.message });
  }
};
