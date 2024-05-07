const express = require('express');
const router = express.Router();
const path = require('path');
const hasAuthority = require('../config/hasAuthority');
const {requireLogin} = require('../api/auth'); 
router.use(express.json());


router.get('/', requireLogin ,  (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});


module.exports = router;
