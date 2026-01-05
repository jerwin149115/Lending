const db = require("../config/db");

module.exports = {
  insert: (data, cb) => {
    db.query(
      `INSERT INTO documents
      (customer_id, filename, original_name, mime_type, file_size)
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.customer_id,
        data.filename,
        data.original_name,
        data.mime_type,
        data.file_size,
      ],
      cb
    );
  },

  getAll: (cb) => {
    db.query("SELECT * FROM documents ORDER BY created_at DESC", cb);
  },

  findById: (id, cb) => {
    db.query("SELECT * FROM documents WHERE document_id = ?", [id], cb);
  },

  deleteById: (id, cb) => {
    db.query("DELETE FROM documents WHERE document_id = ?", [id], cb);
  },
};
