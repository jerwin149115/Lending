import { Routes, Route } from 'react-router-dom';
import LendingDaily from '../../pages/Daily/LendingDaily';
import LendingMonthly from '../../pages/Monthly/LendingMonthly';
import Customer from '../../pages/Customer/Customer';
import { Navdata } from '../Navigation/Navdata';
import Navbar from '../Navigation/Navbar';
import Home from '../../pages/Home/Home';
import Logout from '../Logout/Logout';

function Dashboard({ setIsAuthenticated }) {
    return (
        <>
        <Navbar Navdata={Navdata} />
        <div className="dashboard-content">
            <Routes>
                <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />
                <Route path='/customer' element={<Customer />}/>
                <Route path="/monthly/:customer_id" element={<LendingMonthly />} />
                <Route path='/payment/daily/:rider_id' element={<LendingDaily />}/>
                <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </div>
        </>
    );
}


export default Dashboard;