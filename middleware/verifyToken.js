// verifyToken.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    // Extracted user ID
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
