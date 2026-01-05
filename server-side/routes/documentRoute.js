const express = require("express");
const router = express.Router();
const controller = require("../controllers/documentController");
const upload = require("../middleware/uploadDocument");

router.post("/document/upload", upload.single("document"), controller.uploadDocument);
router.get("/document/get", controller.getDocuments);
router.get("/document/download/:document_id", controller.downloadDocument);
router.delete("/document/delete/:document_id", controller.deleteDocument);

module.exports = router;
