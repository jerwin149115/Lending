const documentService = require("../services/documentService");

module.exports = {
  uploadDocument: async (req, res) => {
    try {
      const data = await documentService.upload(null, req.file);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.error });
    }
  },

  getDocuments: async (_, res) => {
    try {
      const rows = await documentService.getAll();
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  },

  downloadDocument: async (req, res) => {
    try {
      const data = await documentService.download(req.params.document_id);
      res.download(data.filePath, data.doc.original_name);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.error });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const data = await documentService.delete(req.params.document_id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.error });
    }
  },
};
