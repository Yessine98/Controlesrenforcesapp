const isAQManager = (req, res, next) => {
    const user = req.user;
  
    if (!user) {
      return res.status(403).send({ message: "No user found." });
    }
  
    if (user.role !== 'AQ' && user.role !== 'manager') {
      return res.status(403).send({ message: "Require AQ or Manager Role!" });
    }
  
    next(); 
  };
  

  module.exports = isAQManager;

  