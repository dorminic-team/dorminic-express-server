const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const path = require('path');
//api
const { router: authRouter, requireLogin, setupSessionMiddleware } = require('./src/api/auth');
const { router: sysRouter} = require('./src/api/sys');
const { router: adminRouter} = require('./src/api/admin');

//views
const viewsRoutes = require('./src/routes/viewsRoutes');
const authRoutes = require('./src/routes/authRouters');
const bodyParser = require('body-parser');
const pool = require('./src/config/pool');

app.use(bodyParser.json());
app.use(setupSessionMiddleware());
//frontend routes
app.use('/' ,authRoutes);
//backend router
app.use('/api', authRouter);
app.use('/api', sysRouter);
app.use('/api', adminRouter);
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (connection) connection.release();
    });
    res.json({ message: 'Database connection successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error connecting to database' });
  }
});
app.use('/', requireLogin ,viewsRoutes);
app.use(express.static(path.join(__dirname, 'src', 'views')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
