const db = require('../config/db.js');

module.exports = {
    findByUsername: (username, cb) => {
        const q = 'SELECT * FROM admin_user WHERE username = ?';
        db.query(q, [username], cb);
    },
    create: (username, hashedPassword, cb) => {
        const q = 'INSERT INTO admin_user (username, password) VALUES (?, ?)';
        db.query(q, [username, hashedPassword], cb);
    }
};