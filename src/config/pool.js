require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_LOCAL_HOST,
  user: process.env.DB_LOCAL_USER,
  password: process.env.DB_LOCAL_PASSWORD,
  database: process.env.DB_LOCAL_DATABASE,
  connectionLimit: 10,
});

// Export the pool for use in other parts of your application
module.exports = pool;
