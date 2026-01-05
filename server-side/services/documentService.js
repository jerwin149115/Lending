const documentModel = require("../model/documentModel");
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "documents");

module.exports = {
  upload: (customer_id, file) =>
    new Promise((resolve, reject) => {
      if (!file)
        return reject({ status: 400, error: "No file uploaded" });

      documentModel.insert(
        {
          customer_id,
          filename: file.filename,
          original_name: file.originalname,
          mime_type: file.mimetype,
          file_size: file.size,
        },
        (err, result) => {
          if (err)
            return reject({ status: 500, error: "Database error" });

          resolve({ message: "Uploaded", id: result.insertId });
        }
      );
    }),

  getAll: () =>
    new Promise((resolve, reject) =>
      documentModel.getAll((err, res) =>
        err ? reject(err) : resolve(res)
      )
    ),

  download: (id) =>
    new Promise((resolve, reject) =>
      documentModel.findById(id, (err, rows) => {
        if (err || !rows.length)
          return reject({ status: 404, error: "Not found" });

        const filePath = path.join(UPLOAD_DIR, rows[0].filename);
        if (!fs.existsSync(filePath))
          return reject({ status: 404, error: "File missing" });

        resolve({ doc: rows[0], filePath });
      })
    ),

  delete: (id) =>
    new Promise((resolve, reject) =>
      documentModel.findById(id, (err, rows) => {
        if (rows?.length) {
          const filePath = path.join(UPLOAD_DIR, rows[0].filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        documentModel.deleteById(id, (err) =>
          err
            ? reject({ status: 500, error: "Delete failed" })
            : resolve({ message: "Deleted" })
        );
      })
    ),
};
