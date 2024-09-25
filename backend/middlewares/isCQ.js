const isCQ = (req, res, next) => {
    if (req.userrole !== 'CQ') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
  
  module.exports = isCQ;
  