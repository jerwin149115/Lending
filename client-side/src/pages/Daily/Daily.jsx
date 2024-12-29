import './Daily.css';
import { getCustomer } from "../../api/CustomerAPI";
import { useState, useEffect } from 'react';

function Daily() {
  const [customer, setCustomer] = useState([]);

  async function fetchCustomer() {
    try {
      const data = await getCustomer();
      setCustomer(data);
    } catch (error) {
      console.error(`Error in fetching the customer: ${error.message}`);
    }
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  const firstTableRows = customer.slice(0, 50);
  const secondTableRows = customer.slice(50, 100);
  const thirdTableRows = customer.slice(100, 150);

  return (
    <div className="receipt-container-daily">
      <div className="header-daily">
        <h2>3 BROTHERS</h2>
        <h3>DAILY LENDING</h3>
        <p>San Jose Gusu, Zamboanga City</p>
        <h2>AREA 4</h2>
      </div>
      <div className="form-row-daily">
        <div className="form-group-daily">
          <div className="tables-daily">
            {/* First Table */}
            <table className="payment-table-daily">
              <thead>
                <tr>
                  <th>A#</th>
                  <th>Account Name</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {firstTableRows.map((row) => (
                  <tr key={row.account_no}>
                    <td>{row.account_no}</td>
                    <td>{row.name}</td>
                    <td>{row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Second Table */}
            <table className="payment-table-daily">
              <thead>
                <tr>
                  <th>A#</th>
                  <th>Account Name</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {secondTableRows.map((row) => (
                  <tr key={row.account_no}>
                    <td>{row.account_no}</td>
                    <td>{row.account_name}</td>
                    <td>{row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Third Table */}
            <table className="payment-table-daily">
              <thead>
                <tr>
                  <th>A#</th>
                  <th>Account Name</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {thirdTableRows.map((row) => (
                  <tr key={row.account_no}>
                    <td>{row.account_no}</td>
                    <td>{row.account_name}</td>
                    <td>{row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Daily;
