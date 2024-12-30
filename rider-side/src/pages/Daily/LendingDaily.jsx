import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './LendingDaily.css';
import { getCustomerDaily } from "../../api/CustomerApi";
import { savePayments } from "../../api/paymentApi";

async function fetchUserDetails() {
    try {
        const response = await fetch("http://localhost:3000/api/rider", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        return await response.json();
    } catch (error) {
        console.error(`Error fetching user details: ${error.message}`);
        throw error;
    }
}

function LendingDaily({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [customer, setCustomer] = useState([]);

    useEffect(() => {
        async function initialize() {
            try {
                const userDetails = await fetchUserDetails();
                setUser(userDetails);

                const data = await getCustomerDaily(userDetails.area, userDetails.lending_company);
                const initializedData = data.map(customer => {
                    const lastPaymentDate = new Date(customer.last_payment_time);
                    const today = new Date();

                    const isSameDay =
                        lastPaymentDate.toDateString() === today.toDateString();

                    return {
                        ...customer,
                        payment: isSameDay ? customer.last_payment_amount || 0 : 0,
                        disabled: isSameDay && today.getHours() < 24,
                    };
                });

                setCustomer(initializedData);
            } catch (error) {
                console.error(`Error initializing data: ${error.message}`);
            }
        }

        initialize();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false); 
        navigate('/login');
    };

    const handlePaymentChange = (overallIndex, value) => {
        const updatedCustomer = [...customer];
        updatedCustomer[overallIndex].payment = parseFloat(value) || 0;
        setCustomer(updatedCustomer);
    };

    const handleSavePayments = async () => {
        try {
            const paymentsToSave = customer.map(cust => ({
                customer_id: cust.customer_id,
                payment: cust.payment,
            }));

            for (const paymentData of paymentsToSave) {
                await savePayments(paymentData.customer_id, paymentData.payment);

                const index = customer.findIndex(c => c.customer_id === paymentData.customer_id);
                if (index !== -1) {
                    customer[index].disabled = true;
                    customer[index].last_payment_time = new Date().toISOString();
                }
            }

            setCustomer([...customer]);
            alert("Payments saved successfully!");
        } catch (error) {
            console.error(`Error saving payments: ${error.message}`);
            alert("Failed to save payments. Please try again.");
        }
    };

    const calculateTotal = (rows) => rows.reduce((total, row) => total + (parseFloat(row.payment) || 0), 0);

    const renderTableRows = (rows, startIndex) => {
        const fixedRows = Array(50).fill(null).map((_, idx) => rows[idx] || { account_no: "", name: "", payment: 0, disabled: true });

        return fixedRows.map((row, index) => {
            const overallIndex = startIndex + index;
            return (
                <tr key={overallIndex}>
                    <td className="td-daily" onClick={() => navigate(`/dashboard/monthly/${row.customer_id}`)}>{row.account_no}</td>
                    <td>{row.name}</td>
                    <td>
                        <input
                            type="number"
                            value={row.payment}
                            onChange={(e) => handlePaymentChange(overallIndex, e.target.value)}
                            disabled={row.disabled}
                            className="payment-input"
                        />
                    </td>
                </tr>
            );
        });
    };

    const firstTableRows = customer.slice(0, 50);
    const secondTableRows = customer.slice(50, 100); 
    const thirdTableRows = customer.slice(100, 150);

    const firstTableTotal = calculateTotal(firstTableRows);
    const secondTableTotal = calculateTotal(secondTableRows);
    const thirdTableTotal = calculateTotal(thirdTableRows);
    const overallTotal = firstTableTotal + secondTableTotal + thirdTableTotal;

    const isButtonDisabled = customer.every(cust => cust.disabled);

    if (!user) return <p>Loading...</p>; 

    return (
        <div className="receipt-container-daily">
            <div className="header-daily">
                <h2>{user.lending_company}</h2>
                <h3>DAILY LENDING</h3>
                <p>San Jose Gusu, Zamboanga City</p>
                <h2>{user.area}</h2>
            </div>
            <div className="overall-total">
                <p><strong>Overall Total:</strong> {overallTotal.toFixed(2)}</p>
            </div>

            <div className="form-row-daily">
                <div className="form-group-daily">
                    <div className="tables-daily">
                        {[firstTableRows, secondTableRows, thirdTableRows].map((rows, idx) => (
                            <table key={idx} className="payment-table-daily">
                                <thead>
                                    <tr>
                                        <th>A#</th>
                                        <th>Account Name</th>
                                        <th>Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows(rows, idx * 50)}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'right' }}>
                                            <strong>Table Total:</strong>
                                        </td>
                                        <td>{calculateTotal(rows).toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSavePayments}
                className="add-button-daily"
                disabled={isButtonDisabled}
                title={isButtonDisabled ? "All inputs are disabled" : ""}
            >
                Save All Payments
            </button>
            <button
                onClick={handleLogout}
                className="add-button-daily"
            >
                Logout
            </button>
        </div>
    );
}

export default LendingDaily;
