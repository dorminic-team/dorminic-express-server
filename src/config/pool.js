require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_LOCAL_HOST,
  user: process.env.DB_LOCAL_USER,
  password: process.env.DB_LOCAL_PASSWORD,
  database: process.env.DB_LOCAL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed based on your application's requirements
  queueLimit: 0 // Unlimited queueing
});


// Export the pool for use in other parts of your application
module.exports = pool;
