const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/pool');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.use(session({
  secret: '3196d840767f0dc21116ddd36a33f9ae928fa81f89c7fc3c877e5d2c1c72549f',
  resave: false,
  saveUninitialized: true
}));

function requireLogin(req, res, next) {
  const accessToken = req.session.accessToken;
  const refreshToken = req.session.refreshToken;

  if (!accessToken) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token verification failed, try refreshing the token
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send('Unauthorized');
        }
        // Refresh token is valid, generate new access token and continue
        generateAccessToken();
        next();
      });
    } else {
      // Access token is valid, continue to the next middleware or route handler
      next();
    }
  });
}


router.post('/register', async (req, res) => {
});

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '5m' });
};

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Generate a new access token
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});



module.exports = { router, requireLogin };