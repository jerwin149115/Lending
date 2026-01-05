const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController.js');
const { authenticate } = require('../middleware/auth.js');

router.get('/get/rider/username', authenticate, riderController.getRiderProfile);
router.post('/login/rider', riderController.login);
router.post('/register/rider', riderController.register);
router.put('/update/rider/:rider_id', riderController.update);
router.delete('/delete/rider/:rider_id', riderController.delete);
router.get('/get/all/rider', riderController.getAll);
router.get('/get/rider/:rider_id', riderController.getById);
router.get('/get/stats/:rider_id', riderController.getStats);
router.get('/get/payments/recent/:rider_id', riderController.getRecentPayments);
router.get('/get/payments/recent/all', riderController.getRecentPaymentsAll)
router.get('/get/payments/missed/:rider_id', riderController.getMissedPayments);

module.exports = router;