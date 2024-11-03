// streaming-site/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Accès refusé, veuillez fournir un jeton.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Jeton invalide.' });
    }
    req.user = user;
    next();
  });
};
