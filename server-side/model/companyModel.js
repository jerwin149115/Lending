const db = require('../config/db.js');

module.exports = {
    findAll: (cb) => db.query('SELECT * FROM company', cb),
    create: (name, cb) => db.query('INSERT INTO company (name) VALUES (?)', [name], cb),
    update: (id, name, cb) => db.query('UPDATE company SET name = ? WHERE company_id = ?', [name, id], cb),
    delete: (id, cb) => db.query('DELETE FROM company WHERE company_id = ?', [id], cb)
};