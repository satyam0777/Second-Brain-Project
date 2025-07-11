// Authmiddleware
import jwt from 'jsonwebtoken';

   
import User from '../models/User.js';// Adjust the path as necessary

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;
