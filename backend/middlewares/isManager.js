const isManager = (req, res, next) => {
    if (req.userrole !== 'manager') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
  
  module.exports = isManager;
  