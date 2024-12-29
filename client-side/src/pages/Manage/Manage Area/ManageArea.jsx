import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageArea.css";
import { addArea, deleteArea, getArea, updateArea } from "../../../api/AreaAPI";
import { getCompany } from "../../../api/CompanyAPI";

function ManageArea() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedAreaId, setSelectedAreaId] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [optionCompany, setOptionCompany] = useState([]);
    const [newArea, setNewArea] = useState({ name: "", lending_company: "" });

    async function fetchArea() {
        try {
            const data = await getArea();
            setRecords(data);
        } catch (error) {
            setError(`Failed to fetch areas: ${error.message}`);
        }
    }

    async function fetchCompany() {
        try {
            const data = await getCompany();
            setOptionCompany(data);
        } catch (error) {
            setError(`Failed to fetch companies: ${error.message}`);
        }
    }

    useEffect(() => {
        fetchArea();
        fetchCompany();
    }, []);

    async function handleFilter(event) {
        const searchText = event.target.value.toLowerCase();
        setIsSearch(!!searchText);

        try {
            const allArea = await getArea();
            const filteredArea = allArea.filter(area =>
                Object.values(area).some(value =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setRecords(filteredArea);
        } catch (error) {
            setError(`Error filtering areas: ${error.message}`);
        }
    }

    function resetAreaForm() {
        setNewArea({ name: "", lending_company: "" });
        setSelectedArea(null);
        setIsEditing(false);
    }

    function handleEdit(area) {
        setSelectedArea(area);
        setNewArea({ name: area.name, lending_company: area.lending_company });
        setIsEditing(true);
        setShowAddModal(true);
    }

    async function handleAddOrUpdateArea(event) {
        event.preventDefault();
        const { name, lending_company } = newArea;

        if (!name || !lending_company) {
            setError("All fields are required.");
            setShowMessageModal(true);
            return;
        }

        try {
            if (isEditing && selectedArea) {
                await updateArea(selectedArea.area_id, { name, lending_company });
                setSuccess("Area updated successfully!");
            } else {
                await addArea({ name, lending_company });
                setSuccess("Area added successfully!");
            }

            setShowAddModal(false);
            fetchArea();
            resetAreaForm();
        } catch (error) {
            setError(`Error saving area: ${error.message}`);
        } finally {
            setShowMessageModal(true);
        }
    }

    function handleDeleteModal(id) {
        setSelectedAreaId(id);
        setShowDeleteModal(true);
    }

    async function handleDelete() {
        try {
            if (selectedAreaId) {
                await deleteArea(selectedAreaId);
                setRecords(prevRecords => prevRecords.filter(area => area.area_id !== selectedAreaId));
                setSuccess("Area deleted successfully!");
            }
        } catch (error) {
            setError(`Error deleting area: ${error.message}`);
        } finally {
            setShowDeleteModal(false);
            setShowMessageModal(true);
        }
    }

    function handleCloseModal() {
        setShowMessageModal(false);
        setError(null);
        setSuccess(null);
    }

    function handleCompanyChange(event) {
        setNewArea({ ...newArea, lending_company: event.target.value });
    }

    return (
        <div className="table-container-area">
            <div className="text-end-area mb-3">
                <input
                    type="text"
                    onChange={handleFilter}
                    className="search-function"
                    placeholder="Search"
                />
                <button
                    className="add-button-area"
                    onClick={() => {
                        resetAreaForm();
                        setShowAddModal(true);
                    }}
                >
                    Add Area
                </button>
            </div>

            <table className="custom-table-area">
                <thead>
                    <tr>
                        <th>Area ID</th>
                        <th>Area Name</th>
                        <th>Lending Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                        records.map(area => (
                            <tr key={area.area_id}>
                                <td className="td-area" onClick={() => navigate(`/dashboard/customer/daily/${area.name}/${area.lending_company}`)}>{area.area_id}</td>
                                <td>{area.name}</td>
                                <td>{area.lending_company}</td>
                                <td>
                                    <div className="button-divs-area">
                                        <button
                                            className="action-button-area"
                                            onClick={() => handleEdit(area)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-button-area"
                                            onClick={() => handleDeleteModal(area.area_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No areas found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && (
                <div className="custom-modal-overlay-area">
                    <div className="custom-modal-area">
                        <h5 className="modal-title">
                            {isEditing ? "Edit Area" : "Add Area"}
                        </h5>
                        <form onSubmit={handleAddOrUpdateArea}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newArea.name}
                                    placeholder="Area Name"
                                    onChange={e => setNewArea({ ...newArea, name: e.target.value })}
                                    required
                                />
                            </div>
                            <select
                                value={newArea.lending_company}
                                onChange={handleCompanyChange}
                                required
                            >
                                <option value="">Select Company</option>
                                {optionCompany.map(company => (
                                    <option key={company.id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            <div className="modal-buttons-area">
                                <button type="submit" className="btn-action-area">
                                    {isEditing ? "Update" : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-action-area"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="custom-modal-overlay-area">
                    <div className="custom-modal-area">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <p>Are you sure you want to delete this area?</p>
                        <div className="modal-buttons">
                            <button className="btn-action-area" onClick={handleDelete}>
                                Yes
                            </button>
                            <button
                                className="btn-action-area"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMessageModal && (success || error) && (
                <div className="custom-modal-overlay-area">
                    <div className="custom-modal-area">
                        {success && <p>{success}</p>}
                        {error && <p>{error}</p>}
                        <button onClick={handleCloseModal} className="button-action-area">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageArea;
