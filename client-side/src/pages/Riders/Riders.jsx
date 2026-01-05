import { useState, useEffect } from "react";
import {
    register,
    getRiders,
    updateRiders,
    deleteRider
} from "../../api/RidersAPI";
import "./Riders.css";
import { getCompany } from "../../api/CompanyAPI";
import { getAreaByCompany } from "../../api/AreaAPI";

function Riders() {
    const [records, setRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);

    const [selectedRider, setSelectedRider] = useState(null);
    const [selectedRiderId, setSelectedRiderId] = useState(null);

    const [optionCompany, setOptionCompany] = useState([]);
    const [optionArea, setOptionArea] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [newRider, setNewRider] = useState({
        username: "",
        password: "",
        area: "",
        lending_company: "",
    });

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        fetchCompany();
        fetchArea();
        fetchRiders();
    }, []);

    const fetchCompany = async () => {
        try {
            const data = await getCompany();
            setOptionCompany(data);
        } catch {
            setError("Failed to fetch companies");
        }
    };

    const fetchArea = async () => {
        try {
            const data = await getAreaByCompany();
            setOptionArea(data?.data || data || []);
        } catch {
            setError("Failed to fetch areas");
        }
    };

    const fetchRiders = async () => {
        try {
            const data = await getRiders();
            setRecords(data);
        } catch (err) {
            setError(err.message);
        }
    };

    /* ================= HANDLERS ================= */

    const handleCompanyChange = (e) => {
        const companyName =
            e.target.options[e.target.selectedIndex].text;

        setNewRider(prev => ({
            ...prev,
            lending_company: companyName,
            area: ""
        }));

        const filtered = optionArea.filter(
            area => area.lending_company === companyName
        );

        setFilteredAreas(filtered);
    };

    const handleAreaChange = (e) => {
        setNewRider(prev => ({
            ...prev,
            area: e.target.value
        }));
    };

    const handleAddOrUpdateRider = async (e) => {
        e.preventDefault();

        const riderData = {
            username: newRider.username,
            area: newRider.area,
            lending_company: newRider.lending_company,
        };

        if (!isEditing) {
            riderData.password = newRider.password;
        }

        try {
            if (isEditing) {
                await updateRiders(selectedRider.rider_id, riderData);
                setSuccess("Rider updated successfully!");
            } else {
                await register(riderData);
                setSuccess("Rider added successfully!");
            }

            fetchRiders();
            resetForm();
            setShowAddModal(false);
            setShowMessageModal(true);
        } catch (err) {
            setError(err.message);
            setShowMessageModal(true);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRider(selectedRiderId);
            setSuccess("Rider deleted successfully!");
            fetchRiders();
        } catch (err) {
            setError(err.message);
        } finally {
            setShowDeleteModal(false);
            setShowMessageModal(true);
        }
    };

    const resetForm = () => {
        setNewRider({
            username: "",
            password: "",
            area: "",
            lending_company: "",
        });
        setFilteredAreas([]);
        setIsEditing(false);
        setSelectedRider(null);
    };

    const closeMessageModal = () => {
        setError(null);
        setSuccess(null);
        setShowMessageModal(false);
    };

    /* ================= RENDER ================= */

    return (
        <div className="table-container">
            <div className="text-end-rider">
                <button
                    className="add-button"
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                >
                    Add Rider
                </button>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Area</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(item => (
                        <tr key={item.rider_id}>
                            <td>{item.rider_id}</td>
                            <td>{item.username}</td>
                            <td>{item.area}</td>
                            <td>{item.lending_company}</td>
                            <td>
                                <button
                                    className="action-button-rider"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setSelectedRider(item);

                                        setNewRider({
                                            username: item.username,
                                            password: "",
                                            area: item.area,
                                            lending_company: item.lending_company,
                                        });

                                        setFilteredAreas(
                                            optionArea.filter(
                                                area =>
                                                    area.lending_company ===
                                                    item.lending_company
                                            )
                                        );

                                        setShowAddModal(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="action-button-rider"
                                    onClick={() => {
                                        setSelectedRiderId(item.rider_id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ADD / EDIT MODAL */}
            {showAddModal && (
                <div className="custom-modal-overlay-rider">
                    <div className="custom-modal-rider">
                        <h4>{isEditing ? "Edit Rider" : "Add Rider"}</h4>

                        <form onSubmit={handleAddOrUpdateRider}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={newRider.username}
                                onChange={(e) =>
                                    setNewRider(prev => ({
                                        ...prev,
                                        username: e.target.value
                                    }))
                                }
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={newRider.password}
                                onChange={(e) =>
                                    setNewRider(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }
                                required={!isEditing}
                                disabled={isEditing}
                            />

                            <select
                                value={newRider.lending_company}
                                onChange={handleCompanyChange}
                                required
                            >
                                <option value="">Select Company</option>
                                {optionCompany.map(company => (
                                    <option key={company.company_id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={newRider.area}
                                onChange={handleAreaChange}
                                required
                            >
                                <option value="">Select Area</option>
                                {filteredAreas.map(area => (
                                    <option
                                        key={area.area_id}
                                        value={area.name}
                                    >
                                        {area.name}
                                    </option>
                                ))}
                            </select>

                            <button type="submit" className="btn-action-rider">
                                {isEditing ? "Update" : "Save"}
                            </button>

                            <button
                                type="button"
                                className="btn-action-rider"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="custom-modal-overlay-rider">
                    <div className="custom-modal-rider">
                        <p>Are you sure you want to delete this rider?</p>
                        <button
                            className="btn-action-rider"
                            onClick={handleDelete}
                        >
                            Yes, Delete
                        </button>
                        <button
                            className="btn-action-rider"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* MESSAGE MODAL */}
            {showMessageModal && (
                <div className="custom-modal-overlay-company">
                    <div className="custom-modal-company">
                        {success && <p>{success}</p>}
                        {error && <p>{error}</p>}
                        <button
                            className="btn-action-company"
                            onClick={closeMessageModal}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Riders;
