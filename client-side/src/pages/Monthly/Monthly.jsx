import "./Monthly.css";

const Monthly = () => {
  const rows = Array.from({ length: 60 }, (_, index) => ({
    date: index + 1,
    payment: 600,
    signature: ""
  }));

  const firstTableRows = rows.slice(0, 30); // Rows 1-30
  const secondTableRows = rows.slice(30); // Rows 31-60

  return (
    <div className="receipt-container">
      <div className="header">
        <h2>3 BROTHERS DAILY LENDING</h2>
        <p>Zamboanga City</p>
        <p>Office No.: 09278735366</p>
      </div>
      <div className="form-row">
        <div className="form-group">
            <label>Account No</label>
            <p className="form-control">A4-9</p>
        </div>
        <div className="form-group">
            <label>Loan Date: </label>
            <p className="form-control">10 - 30 - 24</p>
        </div>
      </div>
      <div className="tables">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {firstTableRows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.payment}</td>
                <td><input type="number"/></td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {secondTableRows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.payment}</td>
                <td><input type="number"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monthly;
