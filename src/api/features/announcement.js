const express = require('express');
const router = express.Router();
const pool = require('../../config/pool');

// READ all announcements by org_code
router.get('/:org_code', async (req, res) => {
    try {
        const org_code = req.params.org_code;
        const announcementTableName = `${org_code}_announcement`;
        const query = `SELECT * FROM ${announcementTableName}`;
        const [results] = await pool.promise().query(query);

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving announcements by org_code:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// CREATE new announcement
router.post('/', async (req, res) => {
    const { title, description, is_expired, informant_id } = req.body;

    try {
        const query = `INSERT INTO announcements (title, description, is_expired, informant_id) VALUES (?, ?, ?, ?)`;
        await pool.query(query, [title, description, is_expired, informant_id]);

        return res.status(201).json({ message: 'Announcement created successfully' });
    } catch (err) {
        console.error('Error creating announcement:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE announcement
router.put('/:announcement_id', async (req, res) => {
    const { title, description, is_expired } = req.body;
    const announcement_id = req.params.announcement_id;

    try {
        const query = `UPDATE announcements SET title = ?, description = ?, is_expired = ? WHERE id = ?`;
        await pool.query(query, [title, description, is_expired, announcement_id]);

        return res.status(200).json({ message: 'Announcement updated successfully' });
    } catch (err) {
        console.error('Error updating announcement:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// DELETE announcement
router.delete('/:announcement_id', async (req, res) => {
    const announcement_id = req.params.announcement_id;

    try {
        const query = `DELETE FROM announcements WHERE id = ?`;
        await pool.query(query, [announcement_id]);

        return res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        console.error('Error deleting announcement:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

module.exports = { router };
