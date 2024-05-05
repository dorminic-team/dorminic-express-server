const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config()
const {authRouter, requireLogin} = require('./src/api/auth');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 


const pool = require('./src/config/pool');
const hasAuthority = require('./src/config/hasAuthority');

app.get('/test', async (req, res) => {
    try {
        pool.getConnection((err, connection) => {
          if (connection) connection.release()
        });
        res.json({ message: 'Database connection successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error connecting to database' });
    }
});

  

app.get('/admin', hasAuthority('admin'), (req, res) => {
  const userId = req.user;
  res.json({ userId, message: 'Admin access granted' });
});

app.get('/owner', hasAuthority('owner'), (req, res) => {
  const userId = req.user;
  res.json({ userId, message: 'Owner access granted' });
});

app.get('/user', hasAuthority('user'), (req, res) => {
  const userId = req.user;
  res.json({ userId, message: 'User access granted' });
});

app.use('/api', authRouter);


// Start the server

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
module.exports = app;