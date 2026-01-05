import { useEffect, useState } from "react";
import "./Document.css";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
} from "../../api/DocumentAPI.js";

function Document() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch {
      setError("Failed to fetch documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      await uploadDocument(formData);
      setSuccess("Document uploaded successfully");
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      a.remove();
    } catch {
      setError("Failed to download document");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(selectedDocumentId);
      setSuccess("Document deleted successfully");
      fetchDocuments();
    } catch {
      setError("Failed to delete document");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="table-container-document">
      <div className="text-end-document">
        <h2>Documents</h2>
        <button
          className="add-button-document"
          onClick={() => setShowUploadModal(true)}
        >
          Upload Document
        </button>
      </div>

      <table className="custom-table-document">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length ? (
            documents.map((doc) => (
              <tr key={doc.document_id}>
                <td>{doc.original_name}</td>
                <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="action-button-document"
                    onClick={() =>
                      handleDownload(doc.document_id, doc.original_name)
                    }
                  >
                    Download
                  </button>
                  <button
                    className="action-button-document"
                    onClick={() => {
                      setSelectedDocumentId(doc.document_id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No documents found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showUploadModal && (
        <div className="custom-modal-overlay-document">
          <div className="custom-modal-document">
            <h5>Upload Document</h5>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} required />
              <button type="submit">Upload</button>
              <button type="button" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="custom-modal-overlay-document">
          <div className="custom-modal-document">
            <p>Delete this document?</p>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {success && (
        <div className="custom-modal-overlay-document">
          <div className="custom-modal-document">
            <p>{success}</p>
            <button onClick={() => setSuccess(null)}>X</button>
          </div>
        </div>
      )}

      {error && (
        <div className="custom-modal-overlay-document">
          <div className="custom-modal-document">
            <p>{error}</p>
            <button onClick={() => setError(null)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Document;
