const db = require('../config/db.js');

module.exports = {
    findAll: (cb) => db.query('SELECT * FROM area', cb),
    findByCompany: (company, cb) => db.query('SELECT * FROM area WHERE company = ?', [company], cb),
    create: (name, lending_company, cb) => db.query('INSERT INTO area (name, lending_company) VALUES (?, ?)', [name, lending_company], cb),
    update: (id, name, cb) => db.query('UPDATE area SET name = ? WHERE area_id = ?', [name, id], cb),
    delete: (id, cb) => db.query('DELETE FROM area WHERE area_id = ?', [id], cb)
};