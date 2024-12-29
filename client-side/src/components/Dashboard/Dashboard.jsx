import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import NavBar from '../Navigation/NavBar';
import { navData } from '../Navigation/NavData';
import Riders from '../../pages/Riders/Riders';
import Customer from '../../pages/Customer/Customer';
import Monthly from '../../pages/Monthly/Monthly';
import Daily from '../../pages/Daily/Daily';
import ManageCompany from '../../pages/Manage/Manage Company/ManageCompany';
import ManageArea from '../../pages/Manage/Manage Area/ManageArea';
import LendingMonthly from '../../Customer Details/Monthly/LendingMonthly';
import LendingDaily from '../../Customer Details/Daily/LendingDaily';
function Dashboard() {
    return (
        <>
            <NavBar navData={navData} />
            <div className="dashboard-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/riders' element={<Riders />}/>
                    <Route path='/riders/customer' element={<Customer />} />
                    <Route path='/monthly' element={<Monthly />}/>
                    <Route path='/daily' element={<Daily />}/>
                    <Route path='/manage/company' element={<ManageCompany />}/>
                    <Route path='/manage/area' element={<ManageArea />}/>
                    <Route path='/customer/daily/:name/:lending_company' element={<LendingDaily />}/>
                    <Route path='/customer/monthly/:customer_id' element={<LendingMonthly />}/>
                </Routes>
            </div>
        </>
    );
}

export default Dashboard;