const express = require('express');
const app = express();
const port = 3000; // Choose a suitable port

// Import the connection pool
const pool = require('./src/config/pool');

// Test route
app.get('/test', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error connecting to database' });
        }
        connection.release();
        res.json({ message: 'Database connection successful!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
