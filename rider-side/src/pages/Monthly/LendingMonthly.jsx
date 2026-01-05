import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./LendingMonthly.css";
import { getCustomerById } from "../../api/CustomerApi.js";
import { savePayments } from "../../api/paymentApi.js";
import { fetchMissedPayments } from "../../api/riderApi.js";
import { fetchRiderFromToken } from "../../api/riderApi.js";

function LendingMonthly() {
    const { customer_id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [payments, setPayments] = useState([]);
    const [missedPayments, setMissedPayments] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [rider, setRider] = useState(null);


    async function fetchCustomer() {
        try {
            const data = await getCustomerById(customer_id);
            setCustomer(data.customer[0]);
            setPayments(data.payments || []);
        } catch (error) {
            console.error("Error fetching customer data", error);
        }
    }
    async function fetchRider() {
        try {
            const data = await fetchRiderFromToken();
            setRider(data);
        } catch (error) {
            console.error("Error fetching rider from token", error);
        }
    }

    async function loadMissedPayments() {
        if (!rider || !customer_id) return;

        try {
            const data = await fetchMissedPayments(
                rider.rider_id,
                customer_id
            );
            setMissedPayments(data || []);
        } catch (error) {
            console.error("Error fetching missed payments", error);
        }
    }

    useEffect(() => {
        fetchCustomer();
    }, [customer_id]);

    useEffect(() => {
        fetchRider();
    }, []);

    useEffect(() => {
        loadMissedPayments();
    }, [rider, customer_id]);

    /* =========================
       CALCULATIONS
    ========================== */
    const firstTableRows = payments.slice(0, 30);
    const secondTableRows = payments.slice(30);

    const totalPayments = payments.reduce(
        (sum, payment) => sum + Number(payment.payment || 0),
        0
    );

    const remainingBalance = customer
        ? customer.amount - totalPayments
        : 0;

    const handleSubmitPayment = async () => {
        if (!paymentAmount || !paymentDate || !paymentStatus || !rider) return;

        const newPayment = {
            customer_id,
            payment: Number(paymentAmount),
            payment_date: paymentDate,
            payment_status: paymentStatus,
            rider_id: rider.rider_id
        };

        try {
            const response = await savePayments(customer_id, newPayment);

            setPayments(prev => [
                ...prev,
                {
                    ...newPayment,
                    payment_id: response.payment_id || Date.now()
                }
            ]);
            loadMissedPayments();
            setPaymentAmount("");
            setPaymentDate("");
            setPaymentStatus("");
            setShowModal(false);
        } catch (error) {
            console.error("Error saving payment:", error);
        }
    };

    if (!customer) return <p>Loading...</p>;

    return (
        <div className="receipt-container-monthly">
            <div className="header-monthly">
                <h2>{customer.lending_company}</h2>
                <p>Zamboanga City</p>
                <p>Office No.: 09278735366</p>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <p className="form-control-monthly">
                        <span className="label">Account No</span>
                        <span className="value">{customer.account_no}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Account Name</span>
                        <span className="value">{customer.name}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Area</span>
                        <span className="value">{customer.area}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Address</span>
                        <span className="value">{customer.address}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Loan Amount</span>
                        <span className="value">{customer.amount}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Daily Pay</span>
                        <span className="value">
                            {customer.daily_pay} (Pesos)
                        </span>
                    </p>
                </div>

                <div className="form-group">
                    <p className="form-control-monthly">
                        <span className="label">Loan Date</span>
                        <span className="value">
                            {new Date(customer.loan_date).toLocaleDateString()}
                        </span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Due Date</span>
                        <span className="value">
                            {new Date(customer.due_date).toLocaleDateString()}
                        </span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Terms</span>
                        <span className="value">{customer.terms} days</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Total Payments</span>
                        <span className="value">{totalPayments}</span>
                    </p>

                    <p className="form-control-monthly">
                        <span className="label">Remaining Balance</span>
                        <span className="value">{remainingBalance}</span>
                    </p>

                    <p className="form-control-monthly missed">
                        <span className="label">Missed Payments</span>
                        <span className="value">{missedPayments.length}</span>
                    </p>
                </div>
            </div>
            <button
                className="add-payment-btn"
                onClick={() => setShowModal(true)}
                disabled={!rider}
            >
                Add Payment
            </button>
            <div className="tables">
                {[firstTableRows, secondTableRows].map((rows, tableIndex) => (
                    <table
                        className="payment-table-monthly"
                        key={tableIndex}
                    >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((payment, index) => (
                                <tr
                                    key={payment.payment_id}
                                    className={
                                        payment.payment_status === "unpaid" ||
                                        payment.payment_status === "overdue"
                                            ? "missed-payment"
                                            : ""
                                    }
                                >
                                    <td>
                                        {tableIndex === 0
                                            ? index + 1
                                            : index + 31}
                                    </td>
                                    <td>
                                        {new Date(
                                            payment.payment_date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{payment.payment}</td>
                                    <td>{payment.payment_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))}
            </div>
            {showModal && (
                <div className="modal-overlay-monthly">
                    <div className="modal-content-monthly">
                        <h3>Add Payment</h3>

                        <label>Payment Date:</label>
                        <input
                            type="date"
                            value={paymentDate}
                            onChange={e =>
                                setPaymentDate(e.target.value)
                            }
                        />

                        <label>Payment Amount:</label>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={e =>
                                setPaymentAmount(e.target.value)
                            }
                        />

                        <label>Payment Status:</label>
                        <select
                            value={paymentStatus}
                            onChange={e =>
                                setPaymentStatus(e.target.value)
                            }
                        >
                            <option value="">-- Select Status --</option>
                            <option value="paid">PAID</option>
                            <option value="unpaid">UNPAID</option>
                            <option value="partial">PARTIAL</option>
                            <option value="overdue">OVER DUE</option>
                        </select>

                        <div className="modal-buttons-monthly">
                            <button
                                className="submit-btn"
                                onClick={handleSubmitPayment}
                            >
                                Submit Payment
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LendingMonthly;
