import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LendingDaily.css";

async function fetchUserDetails() {
  const response = await fetch("http://localhost:3000/api/get/rider/username", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch rider details");
  return response.json();
}

async function fetchCustomersByRider(rider_id) {
  const response = await fetch(
    `http://localhost:3000/api/get/customer/rider/${rider_id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch customers");
  return response.json();
}

function LendingDaily({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const rider = await fetchUserDetails();
        setUser(rider);

        const data = await fetchCustomersByRider(rider.rider_id);
        const mapped = data.map((c) => ({
          customer_id: c.customer_id,
          account_no: c.account_no,
          name: c.name,
          daily_pay: Number(c.daily_pay) || 0,
        }));

        setCustomers(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load daily lending data");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);


  const calculateTotal = (rows) =>
    rows.reduce((sum, r) => sum + (Number(r.daily_pay) || 0), 0);

  const renderTableRows = (rows, startIndex) => {
    const fixedRows = Array(50)
      .fill(null)
      .map((_, i) => rows[i] || {});

    return fixedRows.map((row, idx) => (
      <tr key={startIndex + idx}>
        <td
          className="td-daily clickable"
          onClick={() =>
            row.customer_id &&
            navigate(`/dashboard/monthly/${row.customer_id}`)
          }
        >
          {row.account_no || ""}
        </td>
        <td>{row.name || ""}</td>
        <td className="amount">
          {row.daily_pay ? row.daily_pay.toFixed(2) : ""}
        </td>
      </tr>
    ));
  };

  const table1 = customers.slice(0, 50);
  const table2 = customers.slice(50, 100);
  const table3 = customers.slice(100, 150);

  const overallTotal =
    calculateTotal(table1) +
    calculateTotal(table2) +
    calculateTotal(table3);

  if (loading) return <p>Loading daily lending...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="receipt-container-daily">
      <div className="header-daily">
        <h2>{user.lending_company}</h2>
        <h3>DAILY LENDING</h3>
        <p>{user.area}</p>
        <p>Rider: {user.username}</p>
      </div>

      <div className="overall-total-daily">
        <strong>Overall Daily Pay:</strong> {overallTotal.toFixed(2)}
      </div>

      <div className="tables-daily">
        {[table1, table2, table3].map((rows, i) => (
          <table key={i} className="payment-table-daily">
            <thead>
              <tr>
                <th>A#</th>
                <th>Account Name</th>
                <th>Daily Pay</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(rows, i * 50)}</tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="table-total-label">
                  Table Total
                </td>
                <td className="table-total">
                  {calculateTotal(rows).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        ))}
      </div>
    </div>
  );
}

export default LendingDaily;
