const customerService = require('../services/customerService.js');

function calcDate(loan_date, terms) {
    const loanDate = new Date(loan_date);
    const due = new Date(loanDate);
    due.setDate(loanDate.getDate() + parseInt(terms));
    return due.toISOString().split('T')[0];
}

module.exports = {
    create: async(req, res) => {
        try {
            const payload = req.body;
            const loanDate = new Date(payload.loan_date);
            if (isNaN(loanDate)) return res.status(404).json({ error: 'Invalid Loan Date Format. Expected YYYY-MM-DD'});

            payload.due_date = calcDate(payload.loan_date, payload.terms);
            const result = await customerService.createCustomer(payload);
            res.json({ success: true, result});
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error || 'Server Error'})
        }
    },
    update: async(req, res) => {
        try {
            const id = req.params.customer_id;
            const payload = req.body;
            const loanDate = new Date(payload.loan_date);
            if (isNaN(loanDate)) return res.status(400).json({ error: 'Invalid Loan Date format. Expected YYYY-MM-MM'});
            payload.due_date = calcDate(payload.loan_date, payload.terms);
            const result = await customerService.updateCustomer(id, payload);
            res.json({ message: 'Customer details successfully updated!'});
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error || 'Server Error'});
        }
    },
    findAll: async(req, res) => {
        try {
            const data = await customerService.findAll();
            res.json(data);
        } catch(err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    findByRider: async (req, res) => {
        const { rider_id } = req.params;
        const db = require('../config/db.js');

        const query = `
            SELECT 
                customer_id,
                account_no,
                name,
                daily_pay
            FROM customer_user
            WHERE rider_id = ?
            ORDER BY account_no ASC;
        `;

        db.query(query, [rider_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server Error' });
            }
            res.json(result);
        });
    },
    findByIdWithPayments: async(req, res) => {
        const { customer_id } = req.params;
        const db = require('../config/db.js');
        const searchQuery = `SELECT * FROM customer_user WHERE customer_id = ?`;
        const paymentQuery = `SELECT * FROM payments WHERE customer_id = ?`;

        try {
            const customerResult = await new Promise((resolve, reject) => db.query(searchQuery, [customer_id], (e, r) => e ? reject(e) : resolve(r)));
            const paymentResult = await new Promise((resolve, reject) => db.query(paymentQuery, [customer_id], (e, r) => e ? reject(e) : resolve(r)));
            res.json({ customer: customerResult, payments: paymentResult });
        } catch(error) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    delete: async(req, res) => {
        const { customer_id } = req.params;
        const customerModel = require('../model/customerModel.js');
        customerModel.deleteById(customer_id, (err, res) => {
            if (err) return res.status(500).json({ error: 'Server Error'});
            res.json(res);
        })
    },
    findByRiderId: async(req, res) => {
        const { rider_id } = req.params;
        try {
            const result = await customerService.findByRiderId(rider_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Server Error'});
        }
    }
}