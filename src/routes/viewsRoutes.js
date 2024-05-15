const express = require('express');
const router = express.Router();
const path = require('path');
const hasAuthority = require('../config/hasAuthority');
const {requireLogin} = require('../api/auth'); 
router.use(express.json());


router.get('/'/*, requireLogin */,  (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/bills', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/functions/bills.html'));
});

router.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/functions/announcement.html'));
});

router.get('/maintenance', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/functions/maintenance.html'));
});

router.get('/room', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/functions/room.html'));
});

router.get('/mail', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/functions/mail.html'));
});

module.exports = router;
