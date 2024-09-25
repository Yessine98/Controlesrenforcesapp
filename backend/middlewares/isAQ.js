const isAQ = (req, res, next) => {
    if (req.userrole !== 'AQ') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
  
  module.exports = isAQ;
  