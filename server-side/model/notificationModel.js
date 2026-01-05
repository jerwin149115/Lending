const db = require('../config/db');

module.exports = {

    insertMultiple(notifications) {
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO notifications
                (admin_id, rider_id, title, message)
                VALUES ?
            `;
            db.query(q, [notifications], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    },

    getByAdmin() {
        return new Promise((resolve, reject) => {
            const q = `
            SELECT 
                n.notification_id,
                n.title,
                n.message,
                n.is_read,
                n.created_at,
                a.username AS admin_user
            FROM notifications n
            JOIN admin_user a ON a.admin_id = n.admin_id
            WHERE n.admin_id = 1
            ORDER BY n.created_at DESC
            `;

            db.query(q, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
            });
        });
    },

    getByRider(rider_id) {
        return new Promise((resolve, reject) => {
            const q = `
                SELECT *
                FROM notifications
                WHERE rider_id = ?
                ORDER BY created_at DESC
            `;
            db.query(q, [rider_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    markAsRead(notification_id) {
        return new Promise((resolve, reject) => {
            const q = `
                UPDATE notifications
                SET is_read = 1
                WHERE notification_id = ?
            `;
            db.query(q, [notification_id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
};
