// backend/middleware/authJwt.js
const jwt = require("jsonwebtoken");
// const config = require("../config/auth.config.js"); // If you have a separate auth config for secret
// For now, directly use process.env.JWT_SECRET

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id; // Add the decoded user ID to the request object
    next();
  });
};

// Potential future roles-based authorization (not implemented in this subtask)
// isAdmin = (req, res, next) => { ... }
// isModerator = (req, res, next) => { ... }
// isModeratorOrAdmin = (req, res, next) => { ... }

const authJwt = {
  verifyToken: verifyToken,
  // isAdmin: isAdmin,
  // isModerator: isModerator,
  // isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;
