const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');

router.post('/register/customer', customerController.create);
router.post('/register/customer/rider', customerController.create);
router.put('/update/customer/:id', customerController.update);
router.get('/get/customer', customerController.findAll);
router.get('/get/customer/rider/:rider_id', customerController.findByRiderId);
router.get('/get/customer/:customer_id', customerController.findByIdWithPayments);
router.delete('/delete/customer/:customer_id', customerController.delete);
router.get('/get/customer/rider/:rider_id', customerController.findByRiderId);

module.exports = router;