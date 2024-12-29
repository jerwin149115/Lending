import { useState, useEffect } from "react";
import { register, getRiders, updateRiders, deleteRider } from "../../api/RidersAPI";
import './Riders.css';
import { getCompany } from "../../api/CompanyAPI";
import { getAreaByCompany } from "../../api/AreaAPI";

function Riders() {
    const [records, setRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRiderId, setSelectedRiderId] = useState(null);
    const [selectedRider, setSelectedRider] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [optionArea, setOptionArea] = useState([]);
    const [optionCompany, setOptionCompany] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [newRider, setNewRider] = useState({
        username: '',
        password: '',
        area: '',
        lending_company: '',
    });

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
            setError('Error fetching companies.');
        }
    };

    const fetchArea = async () => {
        try {
            const data = await getAreaByCompany();
            setOptionArea(data);
        } catch {
            setError('Error fetching areas.');
        }
    };

    const fetchRiders = async () => {
        try {
            const data = await getRiders();
            setRecords(data);
        } catch (error) {
            setError(`Failed to fetch riders: ${error.message}`);
        }
    };

    function handleCompanyChange(event) {
        const selectedCompany = event.target.value;
        setNewRider({ ...newRider, lending_company: selectedCompany, area: '' });

        if (!selectedCompany) {
            setFilteredAreas([]);
            return;
        }

        const filtered = optionArea?.data?.filter(area => area.lending_company === selectedCompany) || [];
        setFilteredAreas(filtered);

        if (filtered.length === 0) {
            setError('No areas available for the selected company.');
        } else {
            setError(null);
        }
    }

    function handleAreaChange(event) {
        const selectedArea = event.target.value;
        setNewRider((prev) => ({ ...prev, area: selectedArea }));
    }

    const handleAddOrUpdateRider = async (event) => {
        event.preventDefault();
        const riderData = {
            username: newRider.username,
            password: newRider.password,
            area: newRider.area,
            lending_company: newRider.lending_company,
        };

        try {
            if (isEditing) {
                await updateRiders(selectedRider.rider_id, riderData);
                setSuccess('Rider updated successfully.');
            } else {
                await register(riderData);
                setSuccess('Rider added successfully.');
            }
            fetchRiders();
            resetRiderForm();
            setShowAddModal(false);
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const resetRiderForm = () => {
        setNewRider({
            username: '',
            password: '',
            area: '',
            lending_company: '',
        });
        setSelectedRider(null);
        setIsEditing(false);
    };

    async function handleDelete() {
        try {
            if (selectedRiderId) {
                await deleteRider(selectedRiderId);
                setRecords((prevRecords) => prevRecords.filter((company) => company.company_id !== selectedRiderId));
                setSuccess('Company deleted successfully!');
                fetchRiders();
            } 
        } catch (error) {
            setError(`Error in deleting the company: ${error.message}`);
        } finally {
            setShowDeleteModal(false)
            setShowMessageModal(true);
        }
    }

    function handleCloseModal() {
        setShowMessageModal(false);
        setError(null);
        setSuccess(null);
    }

    return (
        <div className="table-container">
            <div className="text-end-rider mb-3">
                <input
                    type="text"
                    onChange={(e) => setIsEditing(e.target.value)}
                    className="search-function"
                    placeholder="Search by name"
                />
                <button
                    className="add-button"
                    onClick={() => {
                        resetRiderForm();
                        setShowAddModal(true);
                    }}
                >
                    Add Rider
                </button>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Rider ID</th>
                        <th>Rider Username</th>
                        <th>Rider Area</th>
                        <th>Lending Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((item) => (
                        <tr key={item.rider_id}>
                            <td>{item.rider_id}</td>
                            <td>{item.username}</td>
                            <td>{item.area}</td>
                            <td>{item.lending_company}</td>
                            <td>
                                <button className="action-button-rider" onClick={() => {
                                    setSelectedRider(item);
                                    setIsEditing(true);
                                    setShowAddModal(true);
                                    setNewRider({
                                        username: item.username,
                                        password: item.password,
                                        area: item.area,
                                        lending_company: item.lending_company,
                                    });
                                }}>
                                    Edit
                                </button>
                                <button className="action-button-rider" onClick={() => {setSelectedRiderId(item.rider_id); setShowDeleteModal(true);}}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="custom-modal-overlay-rider">
                    <div className="custom-modal-rider">
                        <h5>{isEditing ? 'Edit Rider' : 'Add Rider'}</h5>
                        <form onSubmit={handleAddOrUpdateRider}>
                            <input
                                type="text"
                                value={newRider.username}
                                onChange={(e) => setNewRider((prev) => ({ ...prev, username: e.target.value }))}
                                placeholder="Rider Username"
                                required
                            />
                            <input
                                type="password"
                                value={newRider.password}
                                onChange={(e) => setNewRider((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="Rider Password"
                                required={!isEditing}
                                disabled={isEditing}
                            />
                            <select
                                value={newRider.lending_company}
                                onChange={handleCompanyChange}
                                required
                            >
                                <option value="">Select Company</option>
                                {optionCompany.map((company) => (
                                    <option key={company.id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newRider.area}
                                onChange={handleAreaChange}
                                required
                            >
                                <option value="">Select an Area</option>
                                {filteredAreas.map((area) => (
                                    <option key={area.area_id} value={area.name}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                            <button className="btn-action-rider" type="submit">{isEditing ? 'Update' : 'Save'}</button>
                            <button className="btn-action-rider" type="button" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            { showDeleteModal && (
                <div className="custom-modal-overlay-rider">
                    <div className="custom-modal-rider">
                        <h5 className="modal-title">Comfirm Delete</h5>
                        <p>Area you sure you want to delete this Company?</p>
                        <div className="modal-buttons">
                            <button className="btn-action-rider" onClick={handleDelete}>Yes, Delete</button>
                            <button className="btn-action-rider" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            { showMessageModal && (success || error) && (
                <div className='custom-modal-overlay-company'>
                    <div className='custom-modal-company' aria-live="polite">
                        { success && <p>{success}</p> }
                        { error && <p>{error}</p> }
                        <button onClick={handleCloseModal} className='btn-action-company'>X</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Riders;
