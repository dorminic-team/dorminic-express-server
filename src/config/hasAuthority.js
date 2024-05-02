const jwt = require('jsonwebtoken');

const hasAuthority = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    const { role } = decoded; // Assuming role is included in the token payload

    if (role !== requiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    req.user = decoded.userId; // Store user ID for further processing
    next();
  });
};

module.exports = hasAuthority;
