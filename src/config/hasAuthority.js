const jwt = require('jsonwebtoken');

const hasAuthority = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized: Token is not valid' });
    }

    const { role } = decoded;

    if (!role || role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    req.user = decoded.userId; // Store user ID for further processing
    next();
  });
};

module.exports = hasAuthority;
