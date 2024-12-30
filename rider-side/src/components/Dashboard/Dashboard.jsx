import { Routes, Route } from 'react-router-dom';
import LendingDaily from '../../pages/Daily/LendingDaily';
import LendingMonthly from '../../pages/Monthly/LendingMonthly';
import Logout from '../Logout/Logout';

function Dashboard({ setIsAuthenticated }) {
    return (
        <div className="dashboard-content">
            <Routes>
                <Route path="/" element={<LendingDaily setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/monthly/:customer_id" element={<LendingMonthly />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </div>
    );
}


export default Dashboard;