const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/login/admin', adminController.login);
router.post('/register/admin', adminController.register);

module.exports = router;