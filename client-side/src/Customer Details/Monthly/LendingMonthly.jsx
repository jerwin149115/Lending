import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './LendingMonthly.css';
import { getCustomerById } from "../../api/CustomerAPI";

function LendingMonthly() {
    const { customer_id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [payments, setPayments] = useState([]);

    async function fetchCustomer() {
        try {
            const data = await getCustomerById(customer_id);
            setCustomer(data.customer[0]);
            setPayments(data.payments || []); 
        } catch (error) {
            console.error('Error in fetching the data for customer', error);
        }
    }

    useEffect(() => {
        fetchCustomer();
    }, [customer_id]);

    const firstTableRows = payments.slice(0, 30);
    const secondTableRows = payments.slice(30);

    const totalPayments = payments.reduce((sum, payment) => sum + payment.payment, 0);
    const remainingBalance = customer ? customer.amount - totalPayments : 0;

    if (!customer) {
        return <p>Loading...</p>;
    }

    return (
        <div className="receipt-container">
          <div className="header">
            <h2>3 BROTHERS DAILY LENDING</h2>
            <p>Zamboanga City</p>
            <p>Office No.: 09278735366</p>
          </div>
          <div className="form-row">
            <div className="form-group">
                <p className="form-control">Account No: {customer.account_no}</p>
                <p className="form-control">Account Name: {customer.name}</p>
                <p className="form-control">Address: {customer.address}</p>
                <p className="form-control">Loan Amount: {customer.amount}</p>
                <p className="form-control">Daily Pay: {customer.daily_pay} (Pesos)</p>
            </div>
            <div className="form-group">
                <p className="form-control">Loan Date: {new Date(customer.loan_date).toLocaleDateString()}</p>
                <p className="form-control">Due Date: {new Date(customer.due_date).toLocaleDateString()}</p>
                <p className="form-control">Terms: {customer.terms} (days)</p>
                <p className="form-control">Total Payments: {totalPayments} (Pesos)</p>
                <p className="form-control">Remaining Balance: {remainingBalance} (Pesos)</p>
            </div>
          </div>
          <div className="tables">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {firstTableRows.map((payment, index) => (
                  <tr key={payment.payment_id}>
                    <td>{index + 1}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
    
            <table className="payment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {secondTableRows.map((payment, index) => (
                  <tr key={payment.payment_id}>
                    <td>{index + 31}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
}

export default LendingMonthly;
