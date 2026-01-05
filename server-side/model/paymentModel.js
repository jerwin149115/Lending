const db = require('../config/db.js');

module.exports = {
    insert: (payment, payment_date, customer_id, payment_status, cb) => {
        const q = 'INSERT INTO payments (payment, payment_date, customer_id, payment_status) VALUES (?, ?, ?, ?)';
        db.query(q, [payment, payment_date, customer_id, payment_status], cb);
    },
    insertMultiple: (values, cb) => {
        const q = `
            INSERT INTO payments
            (customer_id, rider_id, payment, payment_date, payment_status)
            VALUES ?
        `;
        db.query(q, [values], (err, result) => {
            if (err) {
                console.error("DB INSERT ERROR:", err);
                return cb(err, null);
            }
            cb(null, result);
        });
    },
    findByCustomerId: (customer_id, cb) => {
        const q = 'SELECT * FROM payments WHERE customer_id = ? ORDER BY payment_date ASC';
        db.query(q, [customer_id], cb);
    },
    deleteById: (payment_id, cb) => {
        const q = 'DELETE FROM payments WHERE payment_id = ?';
        db.query(q, [payment_id], cb);
    }
};