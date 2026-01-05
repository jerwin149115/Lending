const paymentService = require('../services/paymentService.js');

module.exports = {
    addPayment: async(req, res) => {
        const { customer_id } = req.params;
        const { payment, payment_date, payment_status } = req.body;
        console.log(customer_id, req.body)
        if (!payment_date) return res.status(400).json({ error: 'Server Error'});

        try {
            const data = await paymentService.addPayment(customer_id, payment, payment_date, payment_status);
            res.json(data);
        } catch(err) {
            res.status(err.status || 500).json({ error: err.error || 'Server Error'});
        }
    },
    addMultiple: async (req, res) => {
        const { customer_id } = req.params;
        const { payment } = req.body;

        if (!payment || !Array.isArray(payment) || payment.length === 0) {
            return res.status(400).json({ error: "Invalid payments array" });
        }

        try {
            const data = await paymentService.addMultiple(customer_id, payment);
            return res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(err.status || 500).json({ error: err.error || "Server Error" });
        }
    },
    getPayments: async(req, res) => {
        const { customer_id } = req.params;
        try {
            const rows = await paymentService.getPaymentsByCustomer(customer_id);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    deletePayment: async(req, res) => {
        const { payment_id } = req.body;
        try {
            await paymentService.deletePayment(payment_id);
            res.json({ message: 'Payment Deleted'});
        } catch(err) {
            res.status(500).json({ error: 'Server Error'});
        }
    }
}