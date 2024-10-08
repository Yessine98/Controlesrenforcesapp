const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const ControlRequest = db.controlRequest;
const ControlResult = db.controlResult;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
  // Save User to Database
 User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role:req.body.role
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
      return res.status(404).send({ message: 'User not found' });
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
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if the current password is provided and valid
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: 'Current password is incorrect' });
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
    res.status(200).send({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


