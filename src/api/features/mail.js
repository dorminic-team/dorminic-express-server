const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');

// Create a mail (POST /mail)
router.post('/', async (req, res) => {
    const { org_code, title, description, is_received, informant_id, room_id } = req.body;
    const mailTableName = `${org_code}_mail`;
    try {
        const createMailQuery = `
            INSERT INTO ${mailTableName} (title, description, is_received, informant_id, room_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [title, description, is_received, informant_id, room_id];
        await pool.query(createMailQuery, values);
        res.status(201).send('Mail created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating mail');
    }
});

// Read a mail by ID (GET /mail/:id)
router.get('/:id', async (req, res) => {
    const { org_code } = req.body;
    const mailId = req.params.id;
    const mailTableName = `${org_code}_mail`;
    try {
        const getMailQuery = `
            SELECT * FROM ${mailTableName}
            WHERE id = ?
        `;
        const [rows, fields] = await pool.query(getMailQuery, [mailId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Mail not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching mail');
    }
});

router.get('/:org_code/:userId/findByNotExpired', async (req, res) => {
    try {
        const org_code = req.params.org_code;
        const userId = req.params.userId;

        const roomTableName = `${org_code}_room`;
        const roomquery = `SELECT * FROM ${roomTableName} WHERE tenant_id = '${userId}'`
        const [roomresults] = await pool.promise().query(roomquery);
        const roomIds = roomresults.map((room) => room.id);

        const announcementTableName = `${org_code}_mail`;
        const query = `SELECT * FROM ${announcementTableName} WHERE room_id = '${roomIds}' AND is_received != 'yes'`;
        const [results] = await pool.promise().query(query);

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving announcements by org_code:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Update a mail (PUT /mail/:id)
router.put('/:id', async (req, res) => {
    const { org_code } = req.body;
    const mailId = req.params.id;
    const { title, description, is_received, informant_id, room_id } = req.body;
    const mailTableName = `${org_code}_mail`;
    try {
        const updateMailQuery = `
            UPDATE ${mailTableName}
            SET title = ?, description = ?, is_received = ?, informant_id = ?, room_id = ?
            WHERE id = ?
        `;
        const values = [title, description, is_received, informant_id, room_id, mailId];
        await pool.query(updateMailQuery, values);
        res.send('Mail updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating mail');
    }
});

// Delete a mail by ID (DELETE /mail/:id)
router.delete('/:id', async (req, res) => {
    const { org_code } = req.body;
    const mailId = req.params.id;
    const mailTableName = `${org_code}_mail`;
    try {
        const deleteMailQuery = `
            DELETE FROM ${mailTableName}
            WHERE id = ?
        `;
        await pool.query(deleteMailQuery, [mailId]);
        res.send('Mail deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting mail');
    }
});

// Get all mails (GET /mails)
router.get('/', async (req, res) => {
    const { org_code } = req.body;
    const mailTableName = `${org_code}_mail`;
    try {
        const getAllMailsQuery = `
            SELECT * FROM ${mailTableName}
        `;
        const [rows, fields] = await pool.query(getAllMailsQuery);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching mails');
    }
});

module.exports = { router };
