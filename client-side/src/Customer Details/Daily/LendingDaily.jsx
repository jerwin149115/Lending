import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './LendingDaily.css';
import { getCustomerDaily } from "../../api/CustomerAPI";
import { savePayments } from "../../api/paymentsAPI";

function LendingDaily() {
    const navigate = useNavigate();
    const { name, lending_company } = useParams();
    const [customer, setCustomer] = useState([]);

    async function fetchCustomer() {
        try {
            const data = await getCustomerDaily(name, lending_company);

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
            console.error(`Error fetching customers: ${error.message}`);
        }
    }

    useEffect(() => {
        fetchCustomer();
    }, []);

    const handlePaymentChange = (index, value) => {
        const updatedCustomer = [...customer];
        updatedCustomer[index].payment = parseFloat(value) || 0;
        setCustomer(updatedCustomer);
    };

    const handleSavePayments = async () => {
        try {
            const paymentsToSave = customer.map(cust => ({
                customer_id: cust.customer_id,
                payment: cust.payment,
            }));

            for (const paymentData of paymentsToSave) {
                if (paymentData.payment > 0) {
                    await savePayments(paymentData.customer_id, paymentData.payment);

                    const index = customer.findIndex(c => c.customer_id === paymentData.customer_id);
                    if (index !== -1) {
                        customer[index].disabled = true;
                        customer[index].last_payment_time = new Date().toISOString();
                    }
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

    const renderTableRows = (rows, startIndex) =>
        rows.map((row, index) => (
            <tr key={row.account_no}>
                <td className="td-daily" onClick={() => navigate(`/dashboard/customer/monthly/${row.customer_id}`)}>{row.account_no}</td>
                <td>{row.name}</td>
                <td>
                    <input
                        type="number"
                        value={row.payment}
                        onChange={(e) => handlePaymentChange(startIndex + index, e.target.value)}
                        disabled={row.disabled}
                        className="payment-input"
                    />
                </td>
            </tr>
        ));

    const firstTableRows = customer.slice(0, 50);
    const secondTableRows = customer.slice(50, 100);
    const thirdTableRows = customer.slice(100, 150);

    const firstTableTotal = calculateTotal(firstTableRows);
    const secondTableTotal = calculateTotal(secondTableRows);
    const thirdTableTotal = calculateTotal(thirdTableRows);
    const overallTotal = firstTableTotal + secondTableTotal + thirdTableTotal;

    const isButtonDisabled = customer.every(cust => cust.disabled) || 
                             customer.every(cust => cust.payment === 0);

    return (
        <div className="receipt-container-daily">
            <div className="header-daily">
                <h2>{lending_company}</h2>
                <h3>DAILY LENDING</h3>
                <p>San Jose Gusu, Zamboanga City</p>
                <h2>{name}</h2>
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
                title={isButtonDisabled ? "No payments to save or all inputs are disabled" : ""}
            >
                Save All Payments
            </button>
        </div>
    );
}

export default LendingDaily;
