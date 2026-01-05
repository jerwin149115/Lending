const db = require('../config/db.js');

module.exports = {
    create: (data, cb) => {
        const q = `INSERT INTO customer_user (account_no, name, address, area, lending_company, amount, daily_pay, loan_date, terms, due_date, rider_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(q, [
            data.account_no,
            data.name,
            data.address,
            data.area,
            data.lending_company,
            data.amount,
            data.daily_pay,
            data.loan_date,
            data.terms,
            data.due_date,
            data.rider_id || null
        ], cb);
    },
    updateById: (id, data, cb) => {
        const q = `UPDATE customer_user SET account_no = ?, name = ?, address = ?, area = ?, lending_company = ?, amount = ?, daily_pay = ?, loan_date = ?, terms = ?, due_date = ? WHERE customer_id = ?`;
        db.query(q, [
            data.account_no,
            data.name,
            data.address,
            data.area,
            data.lending_company,
            data.amount,
            data.daily_pay,
            data.loan_date,
            data.terms,
            data.due_date,
            id
        ], cb);
    },
    findAll: (cb) => {
        const q = 'SELECT * FROM customer_user';
        db.query(q, cb);
    },
    findById: (id, cb) => {
        const q = 'SELECT * FROM customer_user WHERE customer_id = ?';
        db.query(q, [id], cb);
    },
    findByRiderId: (rider_id, cb) => {
        const q = 'SELECT * FROM customer_user WHERE rider_id = ?';
        db.query(q, [rider_id], cb);
    },
    deleteById: (id, cb) => {
        const q = 'DELETE FROM customer_user WHERE customer_id = ?';
        db.query(q, [id], cb);
    }
};