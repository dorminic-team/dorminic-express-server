const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const pool = require('../config/pool');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.RESET_PASSWORD_SENDER_EMAIL,
    pass: process.env.RESET_PASSWORD_SENDER_PASSWORD,
  },
});

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
  const { firstname, lastname, username, email, password } = req.body;

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
      const query = 'INSERT INTO _User (id, firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(query, [userId, firstname, lastname, username, email, hashedPassword], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          // Handle query error
          console.error('Error executing SQL query:', queryErr);
          return res.status(500).json({ error: 'Database error' });
        }

        // User registration successful
        return res.status(200).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.error('Error in user registration:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const identifier = username || email;

  try {
    // Check if the username exists in the database
    const [rows] = await pool.promise().query('SELECT * FROM _User WHERE username = ? OR email = ?', [identifier, identifier]);
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
    // Fetch organization details based on org_code
    const [orgRows] = await pool.promise().query('SELECT name, description, street_address, city, state_province, postal_code, country, phone FROM _Organization WHERE org_code = ?', [user.org_code]);
    const org = orgRows[0];

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Assign organization details to variables
    const { name: org_name, description: org_description, street_address: org_street_address, city: org_city, state_province: org_state_province, postal_code: org_postal_code, country: org_country, phone: org_phone } = org;
    const { firstname: firstname, lastname: lastname, username: username, email: email, id: userId } = user;

    // Store tokens and organization details in session or response headers as needed
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.org_code = user.org_code;

    // Send tokens and organization details in the response
    return res.status(200).json({
      accessToken,
      refreshToken,
      org_code: user.org_code,
      org_name,
      org_description,
      org_street_address,
      org_city,
      org_state_province,
      org_postal_code,
      org_country,
      org_phone,
      userId,
      firstname,
      lastname,
      username,
      email
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

const generateResetToken = () => {
  const tokenLength = 16; // Length of the token
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

router.post('/reset-email', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user exists in your database
    const [rows] = await pool.promise().query('SELECT * FROM _User WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = generateResetToken();
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours
    const query = 'INSERT INTO _User_reset_tokens (user_id, token, expiry_date) VALUES (?, ?, ?)';
    await pool.promise().query(query, [user.id, token, expiryDate]);
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Reset Your Password',
      text: `You requested to reset your password. Click the link below to reset your password:
          ${process.env.BASE_URL}/reset-password/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ error: 'Error sending reset password email' });
      }
      console.log('Reset password email sent:', info.response);
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Validate the token and reset the user's password in the database
    const [rows] = await pool.promise().query('SELECT * FROM _User_reset_tokens WHERE token = ?', [token]);
    const resetToken = rows[0];

    if (!resetToken) {
      // Token not found or expired
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    const currentDate = new Date();
    if (currentDate > resetToken.expiry_date) {
      // Token expired
      return res.status(404).json({ error: 'Token expired' });
    }

    // Update the user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.promise().query('UPDATE _User SET password = ? WHERE id = ?', [hashedPassword, resetToken.user_id]);

    // Delete the reset token from the database
    await pool.promise().query('DELETE FROM _User_reset_tokens WHERE token = ?', [token]);

    res.json({ success: true }); // Password reset successful

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
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