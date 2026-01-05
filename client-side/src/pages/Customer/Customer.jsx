import { useState, useEffect } from "react";
import { registerCustomer, getCustomer, updateCustomer, deleteCustomer } from "../../api/CustomerAPI";
import './Customer.css'
import { useNavigate } from "react-router-dom";
import { getCompany } from "../../api/CompanyAPI";
import { getAreaByCompany } from "../../api/AreaAPI";

function Customer() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState(null);
    const [optionArea, setOptionArea] = useState([]);
    const [optionCompany, setOptionCompany] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [success, setSuccess] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        account_no: '',
        name: '',
        address: '',
        area: '',
        lending_company: '',
        amount: '',
        daily_pay: '',
        loan_date: '',
        terms: '',
    });

    async function fetchCustomer() {
        try {
            const data = await getCustomer();
            setRecords(data);
        } catch (error) {
            setError(`Failed to fetch the customer: ${error.message}`);
        }
    }

    const fetchCompany = async () => {
        try {
            const data = await getCompany();
            setOptionCompany(data);
        } catch (error) {
            console.error('error in fetching the company data', error);
            setError(`Error in fetching the company data`);
        }
    }

    const fetchArea = async () => {
        try {
            const data = await getAreaByCompany();
            setOptionArea(data);
            console.log(data);
        } catch (error) {
            setError('Error in fetching the areas');
            console.error('Error in fetching the area data', error);
        }
    }

    useEffect(() => {
        fetchArea();
        fetchCompany();
        fetchCustomer();
    }, []);

    async function handleFilter(event) {
        const searchText = event.target.value.toLowerCase();
        setIsSearch(!!searchText);
        
        try {
            const allCustomer = await getCustomer(riderId);
            const filteredProducts = allCustomer.filter(customer => 
            Object.values(customer).some(value =>
                String(value).toLowerCase().includes(searchText)
            )
        );
        setRecords(filteredProducts);
        } catch (error) {
            console.error('Error in filtering the products')
        }
    }

    function handleCompanyChange(event) {
        const selectedCompany = event.target.value;
        setNewCustomer({ ...newCustomer, lending_company: selectedCompany, area: ''});

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
        setNewCustomer((prev) => ({ ...prev, area: selectedArea }));
    }

    function resetCustomerForm() {
        setNewCustomer({
            account_no: '',
            name: '',
            address: '',
            area: '',
            lending_company: '',
            amount: '',
            daily_pay: '',
            loan_date: '',
            terms: '',
        });
        setSelectedCustomer(null);
        setIsEditing(false);
    }

    function handleEdit(customer) {
        setSelectedCustomer(customer);

        let formattedLoanDate = '';
        if (customer.loan_date) {
            try {
                const date = new Date(customer.loan_date);
                formattedLoanDate = date.toISOString().split('T')[0]; 
            } catch (error) {
                console.error("Error formatting loan_date:", error);
                formattedLoanDate = '';
            }
        }
    
        setNewCustomer({
            account_no: customer.account_no,
            name: customer.name,
            address: customer.address,
            area: customer.area,
            lending_company: customer.lending_company,
            amount: customer.amount,
            daily_pay: customer.daily_pay,
            loan_date: formattedLoanDate,
            terms: customer.terms,
        });
    
        setIsEditing(true);
        setShowAddModal(true);
    }
     
    
    async function handleAddOrUpdateLoan(event) {
        event.preventDefault();
        const customerData = {
            account_no: newCustomer.account_no,
            name: newCustomer.name,
            address: newCustomer.address,
            area: newCustomer.area,
            lending_company: newCustomer.lending_company,
            amount: newCustomer.amount,
            daily_pay: newCustomer.daily_pay,
            loan_date: newCustomer.loan_date,
            terms: newCustomer.terms,
        };

        try {
            if (isEditing) {
                await updateCustomer(selectedCustomer.customer_id, customerData)
                setSuccess('Customer updated successfully');
                setShowMessageModal(true)
            } else {
                await registerCustomer(customerData);
                setSuccess('Customer added successfully');
                setShowMessageModal(true)
            }
            setShowAddModal(false);
            fetchCustomer();
            resetCustomerForm();
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    }

    async function handleDelete() {
        try {
            if (selectedCustomerId) {
                await deleteCustomer(selectedCustomerId);
                setRecords((prevRecords) => prevRecords.filter((customer) => customer.customer_id !== selectedCustomerId))
                setSuccess('Company deleted Successfully!');
                fetchCustomer();
            }
        } catch (error) {
            setError(`Error in deleting the customer ${error.message}`);
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

    return(
        <div className="table-container-customer">
            <div className="text-end-customer">
                <input type="text" onChange={handleFilter} className="search-function-customer" placeholder="Search"/>
                <button className="add-button-customer" onClick={() => {
                    resetCustomerForm();
                    setShowAddModal(true);
                }}>
                    Add Customer
                </button>
            </div>

            <table className="custom-table-customer">
                <thead>
                    <tr>
                        <th>Account No</th>
                        <th>Customer Name</th>
                        <th>Customer Address</th>
                        <th>Customer Area</th>
                        <th>Lending Company</th>
                        <th>Amount</th>
                        <th>Loan Date</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {records.length > 0 ? (
                        records.map((customer) => (
                            <tr key={customer.customer_id}>
                                <td onClick={() => navigate(`/dashboard/customer/monthly/${customer.customer_id}`)}>{customer.account_no}</td>
                                <td>{customer.name}</td>
                                <td>{customer.address}</td>
                                <td>{customer.area}</td>
                                <td>{customer.lending_company}</td>
                                <td>{customer.amount}</td>
                                <td>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(customer.loan_date))}</td>
                                <td>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(customer.due_date))}</td>
                                <td>
                                    <button
                                        className="action-button-customer"
                                        onClick={() => handleEdit(customer)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="action-button-customer"
                                        onClick={() => {setSelectedCustomerId(customer.customer_id); setShowDeleteModal(true)}}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                {error ? error : "No customers found."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showAddModal && (
                        <div className="custom-modal-overlay-customer">
                            <div className="custom-modal-customer">
                                <h5 className="modal-title">
                                    {isEditing ? 'Edit Customer Details' : 'Add Customer Details'}
                                </h5>
                                <form onSubmit={handleAddOrUpdateLoan}>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newCustomer.account_no}
                                                placeholder="Account No."
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, account_no: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group-customer">
                                            <input
                                                type="date"
                                                className="form-control date-picker-input"
                                                value={newCustomer.loan_date}
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, loan_date: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newCustomer.name}
                                                placeholder="Full Name"
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, name: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <select
                                            value={newCustomer.lending_company}
                                            onChange={handleCompanyChange}
                                            required>
                                                <option value="">Select Company</option>
                                                {optionCompany.map((company) => (
                                                    <option key={company.company_id} value={company.name}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <select
                                            value={newCustomer.area}
                                            onChange={handleAreaChange}
                                            required>
                                                <option value="">Select an Area</option>
                                                {filteredAreas.map((area) => (
                                                    <option key={area.area_id}
                                                    value={area.area_id}>
                                                        {area.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newCustomer.address}
                                                placeholder="Address"
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, address: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newCustomer.amount}
                                                placeholder="Amount"
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, amount: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row-customer">
                                        <div className="form-group-customer">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newCustomer.daily_pay}
                                                placeholder="Daily Pay"
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, daily_pay: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group-customer">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newCustomer.terms}
                                                placeholder="Terms"
                                                onChange={(e) =>
                                                    setNewCustomer({ ...newCustomer, terms: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-buttons">
                                        <button type="submit" className="action-button-customer">
                                            {isEditing ? 'Update' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="action-button-customer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
            { showDeleteModal && (
                <div className="custom-modal-overlay-customer">
                    <div className="custom-modal-customer">
                        <h5 className="modal-title">Comfirm Delete</h5>
                        <p>Area you sure you want to delete this Customer?</p>
                        <div className="modal-buttons">
                            <button className="btn-action" onClick={handleDelete}>Yes, Delete</button>
                            <button className="btn-action" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            { showMessageModal && (success || error) && (
                <div className='custom-modal-overlay-customer'>
                    <div className='custom-modal-customer' aria-live="polite">
                        { success && <p>{success}</p> }
                        { error && <p>{error}</p> }
                        <button onClick={handleCloseModal} className='btn-action-customer'>X</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Customer;