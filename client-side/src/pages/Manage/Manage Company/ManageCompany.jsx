import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ManageCompany.css'
import { addCompany, deleteCompany, getCompany, updateCompany } from "../../../api/CompanyAPI";

function ManageCompany() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
    })

    async function fetchCompany() {
        try {
            const data = await getCompany();
            setRecords(data);
        } catch (error) {
            setError(`Failed to fetch the company due to ${error.message}`);
        }
    }

    useEffect(() => {
        fetchCompany();
    }, []);

    async function handleFilter(event) {
        const searchText = event.target.value.toLowerCase();
        setIsSearch(!!searchText);
    
        try {
          const allCompany = await getCompany();
          const filteredProducts = allCompany.filter(company => 
            Object.values(company).some(value =>
              String(value).toLowerCase().includes(searchText)
            )
          );
          setRecords(filteredProducts);
        } catch (error) {
          console.error('Error in filtering the company')
        }
    }
    

    function resetCompanyForm() {
        setNewCompany({
            name: '',
        });
        setSelectedCompany(null);
        setIsEditing(false);
    }

    function handleEdit(company) {
        setSelectedCompany(company);
        setNewCompany({
            name: '',
        })
        setIsEditing(true);
        setShowAddModal(true);
    }

    async function handleAddorUpdateCompany(event) {
        event.preventDefault();
        const companyData = {
            name: newCompany.name,
        }

        try {
            if (isEditing) {
                await updateCompany(selectedCompany.company_id, companyData);
                setSuccess('Company updated Successfully!');
                setShowMessageModal(true)
            } else {
                await addCompany(companyData);
                setSuccess('Company added successfully!');
                setShowMessageModal(true);
            }
            setShowAddModal(false);
            fetchCompany();
            resetCompanyForm();
        } catch (error) {
            setError (`Error: ${error.message}`);
        }
    }

    function handleDeleteModal(id) {
        setSelectedCompanyId(id);
        setShowDeleteModal(true);
    }

    async function handleDelete() {
        try {
            if (selectedCompanyId) {
                await deleteCompany(selectedCompanyId);
                setRecords((prevRecords) => prevRecords.filter((company) => company.company_id !== selectedCompanyId))
                setSuccess('Company successsfully deleted!');
            }
        } catch (error) {
            setError(`Failed to delete the company: ${error.message}`);
        } finally {
            setShowDeleteModal(false);
            setShowMessageModal(true)
        }
        
    }

    function handleCloseModal() {
        setShowMessageModal(false);
        setError(null);
        setSuccess(null);
    }

    return(
        <div className="table-container-company">
            <div className="text-end-company mb-3">
            <input type="text" onChange={handleFilter} className="search-function" placeholder="Search by name" />
                <button
                className="add-button-company" onClick={() => {
                    resetCompanyForm();
                    setShowAddModal(true);
                }}>Add Company</button>
            </div>
            <table className="custom-table-company">
                <thead>
                    <tr>
                        <th>Company ID</th>
                        <th>Company Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((company) => (
                        <tr key={company.company_id}>
                            <td>{company.company_id}</td>
                            <td>{company.name}</td>
                            <td>
                                <div className="button-divs-company">
                                    <button
                                    className="action-button-company"
                                    onClick={() => handleEdit(company)}>
                                        Edit
                                    </button>
                                    <button className="action-button-company"
                                    onClick={() => handleDeleteModal(company.company_id)}>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            { showAddModal && (
                <div className="custom-modal-overlay-company">
                    <div className="custom-modal-company">
                        <h5 className="modal-title">
                            { isEditing ? 'Edit Company' : 'Add Company'}
                        </h5>
                        <form onSubmit={handleAddorUpdateCompany}>
                            <div className="mb-3">
                                <input 
                                type="text"
                                className="form-control"
                                value={newCompany.name}
                                placeholder="Company Name"
                                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value})}
                                />
                            </div>
                            <div className="modal-buttons-company">
                                <button type="submit" className="btn-action">
                                    { isEditing ? 'Update' : 'Save'}
                                </button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-action">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            { showDeleteModal && (
                <div className="custom-modal-overlay-company">
                    <div className="custom-modal-company">
                        <h5 className="modal-title">Comfirm Delete</h5>
                        <p>Area you sure you want to delete this Company?</p>
                        <div className="modal-buttons">
                            <button className="btn-action" onClick={handleDelete}>Yes, Delete</button>
                            <button className="btnc-action" onClick={() => setShowDeleteModal(false)}>Cancel</button>
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
    )
}

export default ManageCompany;