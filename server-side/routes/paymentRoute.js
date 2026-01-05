const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');

router.post('/payment/add/:customer_id', paymentController.addPayment);
router.post('/payment/multiple/:customer_id', paymentController.addMultiple);
router.get('/payment/get/:customer_id', paymentController.getPayments);
router.delete('/payment/delete/:payment_id', paymentController.deletePayment);

module.exports = router;
