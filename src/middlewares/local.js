// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
 
  const token = req.cookies.authToken

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'BCA');

    // Set the decoded token on the request object for further use
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
