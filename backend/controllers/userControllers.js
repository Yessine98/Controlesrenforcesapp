const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

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
