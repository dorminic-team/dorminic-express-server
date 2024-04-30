const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust according to your needs
  host: '34.87.162.93',
  user: 'root',
  password: '{TcVK9Fc]F4+8pVX',
  database: 'dorminic-data',
});

// Helper function to handle database queries
function executeQuery(query, params, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }
    connection.query(query, params, (error, results) => {
      connection.release(); // Release the connection
      callback(error, results);
    });
  });
}

// Create a bill for a specific organization
router.post('/:org_code', (req, res) => {
  const { org_code } = req.params;
  const { water_fee, electric_fee, rental_fee, month, year, isPaid, user_id, room_number } = req.body;
  const insertBillQuery = `
    INSERT INTO bill_organization_${org_code} (org_code, water_fee, electric_fee, rental_fee, month, year, isPaid, user_id, room_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [org_code, water_fee, electric_fee, rental_fee, month, year, isPaid, user_id, room_number];
  executeQuery(insertBillQuery, values, (error, result) => {
    if (error) {
      console.error('Error creating bill:', error);
      res.status(500).send('Error creating bill');
    } else {
      res.status(201).send('Bill created successfully');
    }
  });
});

// Read all bills for a specific organization
router.get('/:org_code', (req, res) => {
  const { org_code } = req.params;
  const selectAllBillsQuery = `SELECT * FROM bill_organization_${org_code}`;
  executeQuery(selectAllBillsQuery, [], (error, results) => {
    if (error) {
      console.error('Error retrieving bills:', error);
      res.status(500).send('Error retrieving bills');
    } else {
      res.status(200).json(results);
    }
  });
});

// Read bills for a specific organization and specific user ID
router.get('/:org_code/user/:user_id', (req, res) => {
  const { org_code, user_id } = req.params;
  const selectUserBillsQuery = `
    SELECT * FROM bill_organization_${org_code}
    WHERE user_id = ?
  `;
  executeQuery(selectUserBillsQuery, [user_id], (error, results) => {
    if (error) {
      console.error('Error retrieving user bills:', error);
      res.status(500).send('Error retrieving user bills');
    } else {
      res.status(200).json(results);
    }
  });
});

// Update a bill for a specific organization
router.put('/:org_code/:id', (req, res) => {
  const { org_code, id } = req.params;
  const { water_fee, electric_fee, rental_fee, month, year, isPaid, user_id, room_number } = req.body;
  const updateBillQuery = `
    UPDATE bill_organization_${org_code}
    SET org_code = ? water_fee=?, electric_fee=?, rental_fee=?, month=?, year=?, isPaid=?, user_id=?, room_number=?
    WHERE bill_id=?
  `;
  const values = [org_code ,water_fee, electric_fee, rental_fee, month, year, isPaid, user_id, room_number, id];
  executeQuery(updateBillQuery, values, (error, result) => {
    if (error) {
      console.error('Error updating bill:', error);
      res.status(500).send('Error updating bill');
    } else {
      res.status(200).send('Bill updated successfully');
    }
  });
});

// Delete a bill from a specific organization
router.delete('/:org_code/:id', (req, res) => {
  const { org_code, id } = req.params;
  const deleteBillQuery = `DELETE FROM bill_organization_${org_code} WHERE bill_id=?`;
  executeQuery(deleteBillQuery, [id], (error, result) => {
    if (error) {
      console.error('Error deleting bill:', error);
      res.status(500).send('Error deleting bill');
    } else {
      res.status(200).send('Bill deleted successfully');
    }
  });
});

module.exports = router;
