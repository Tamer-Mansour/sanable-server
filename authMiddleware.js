const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: Missing or invalid Authorization header');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your-secret-key');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
