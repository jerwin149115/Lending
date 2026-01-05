const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1245',
  database: 'lending',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL Pool Connection Error:', err);
  } else {
    console.log('MySQL Pool Connected Successfully!');
    connection.release(); 
  }
});

module.exports = db;
