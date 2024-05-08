const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const uuid = require('uuid'); 
const pool = require('../config/pool');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mysql = require('mysql2/promise'); 

const setupSessionMiddleware = () => {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  });
};

router.use(express.json());

const requireLogin = (req, res, next) => {
  const accessToken = req.session.accessToken;
  const refreshToken = req.session.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.redirect('/login');
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (accessTokenErr, decoded) => {
    if (accessTokenErr) {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (refreshTokenErr, decoded) => {
        if (refreshTokenErr) {
          return res.status(401).send('Unauthorized');
        }
        const newAccessToken = generateAccessToken(decoded.userId);
        req.session.accessToken = newAccessToken; // Update session with new access token
        next();
      });
    } else {
      next();
    }
  });
};

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});



router.post('/register', async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let userId;
    let uniqueIdFound = false;
    // Loop until a unique UUID is found
    while (!uniqueIdFound) {
      userId = uuid.v4(); // Generate a new UUID
      const checkQuery = 'SELECT COUNT(*) AS count FROM _User WHERE id = ?';
      const [rows] = await pool.promise().query(checkQuery, [userId]);
      if (rows[0].count === 0) {
        uniqueIdFound = true; // Set flag to exit loop
      }
    }

    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Run your SQL query to insert the new user into the database
      const query = 'INSERT INTO _User (id, firstname, lastname, username, password) VALUES (?, ?, ?, ?, ?)';
      connection.query(query, [userId, firstname, lastname, username, hashedPassword], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          // Handle query error
          console.error('Error executing SQL query:', queryErr);
          return res.status(500).json({ error: 'Database error' });
        }

        // User registration successful
        return res.status(200).json({ message: 'User registered successfully'});
      });
    });
  } catch (err) {
    console.error('Error in user registration:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists in the database
    const [rows] = await pool.promise().query('SELECT * FROM _User WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify the password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store tokens in session or response headers as needed
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;

    // Send tokens in the response
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Error in user login:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

router.use(setupSessionMiddleware()); 

module.exports = { router, setupSessionMiddleware, requireLogin };