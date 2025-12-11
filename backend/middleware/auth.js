const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization || '';
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT secret not configured' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};
