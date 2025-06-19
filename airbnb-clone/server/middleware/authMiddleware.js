const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Ensure .env from server directory is loaded

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token. Access denied.' });
      }
      // For other errors, it might still be a server-side issue or an unexpected error
      console.error("JWT Verification Error:", err);
      return res.status(500).json({ message: 'Could not verify token. Access denied.'});
    }

    // Token is valid, attach payload to request object
    req.user = decodedPayload;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;
