const db = require('../config/db.js');

module.exports = {
    findByUsername: (username, cb) => {
        const q = 'SELECT * FROM rider_user WHERE username = ?';
        db.query(q, [username], cb);
    },
    create: (username, hashedPassword, area, lending_company, cb) => {
        const q = 'INSERT INTO rider_user (username, password, area, lending_company) VALUES (?, ?, ?, ?)';
        db.query(q, [username, hashedPassword, area, lending_company], cb);
    },
    updateById: (rider_id, username, password, area, lending_company, cb) => {
        let q;
        let params;

        if (password) {
            q = `
                UPDATE rider_user
                SET username = ?, password = ?, area = ?, lending_company = ?
                WHERE rider_id = ?
            `;
            params = [username, password, area, lending_company, rider_id];
        } else {
            q = `
                UPDATE rider_user
                SET username = ?, area = ?, lending_company = ?
                WHERE rider_id = ?
            `;
            params = [username, area, lending_company, rider_id];
        }

        db.query(q, params, cb);
    },
    deleteById: (rider_id, cb) => {
        const q = 'DELETE FROM rider_user WHERE rider_id = ?';
        db.query(q, [rider_id], cb);
    },
    findById: (id, cb) => {
        const q = 'SELECT rider_id, username, area, lending_company, created_at FROM rider_user WHERE rider_id = ?';
        db.query(q, [id], cb);
    },
    findAll: (cb) => {
        const q = 'SELECT * FROM rider_user';
        db.query(q, cb);
    },
    getStats: (rider_id, cb) => {
        const stats = {};

        const totalCustomers = `
            SELECT COUNT(*) AS totalCustomers
            FROM customer_user
            WHERE rider_id = ?
        `;

        const totalCollectibles = `
            SELECT 
                SUM(c.amount - IFNULL(p.totalPayments, 0)) AS totalCollectibles
            FROM customer_user c
            LEFT JOIN (
                SELECT customer_id, SUM(payment) AS totalPayments
                FROM payments
                GROUP BY customer_id
            ) p ON c.customer_id = p.customer_id
            WHERE c.rider_id = ?
        `;

        const todayCollection = `
            SELECT SUM(payment) AS todayCollection
            FROM payments
            WHERE DATE(payment_date) = CURDATE()
            AND customer_id IN (
                SELECT customer_id FROM customer_user WHERE rider_id = ?
            )
        `;

        const monthlyCollection = `
            SELECT SUM(payment) AS monthlyCollection
            FROM payments
            WHERE MONTH(payment_date) = MONTH(CURDATE())
            AND YEAR(payment_date) = YEAR(CURDATE())
            AND customer_id IN (
                SELECT customer_id FROM customer_user WHERE rider_id = ?
            )
        `;
        db.query(totalCustomers, [rider_id], (err, r1) => {
            if (err) return cb(err);
            stats.totalCustomers = r1[0].totalCustomers;

            db.query(totalCollectibles, [rider_id], (err, r2) => {
                if (err) return cb(err);
                stats.totalCollectibles = r2[0].totalCollectibles || 0;

                db.query(todayCollection, [rider_id], (err, r3) => {
                    if (err) return cb(err);
                    stats.todayCollection = r3[0].todayCollection || 0;

                    db.query(monthlyCollection, [rider_id], (err, r4) => {
                        if (err) return cb(err);
                        stats.monthlyCollection = r4[0].monthlyCollection || 0;

                        cb(null, stats);
                    });
                });
            });
        });
    },
    getRecentPayments: (rider_id, cb) => {
        const q = `
            SELECT p.*, c.name
            FROM payments p
            JOIN customer_user c ON p.customer_id = c.customer_id
            WHERE c.rider_id = ?
            ORDER BY p.payment_date DESC
            LIMIT 10
        `;
        db.query(q, [rider_id], cb);
    },
    getRecentPaymentsAll: (cb) => {
        const q = `
            SELECT *
            FROM payments
            ORDER BY payment_date DESC
        `;
        db.query(q, (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return cb(err);
            }
            cb(null, results);
        });
    },
    getMissedPayments: (rider_id, cb) => {
        const q = `
            SELECT 
                p.customer_id,
                c.name,
                p.payment AS amount,
                IF(
                    p.payment_date IS NULL,
                    0,
                    DATEDIFF(CURDATE(), p.payment_date)
                ) AS days_overdue
            FROM payments p
            INNER JOIN customer_user c
                ON p.customer_id = c.customer_id
            WHERE p.rider_id = ?
            AND p.payment_status = 'unpaid';
        `;
        db.query(q, [rider_id], cb);
    },
};