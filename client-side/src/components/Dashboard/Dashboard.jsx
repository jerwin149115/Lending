import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from '../../pages/Home/Home';
import NavBar from '../Navigation/NavBar';
import { navData } from '../Navigation/NavData';

import Riders from '../../pages/Riders/Riders';
import Customer from '../../pages/Customer/Customer';
import ManageCompany from '../../pages/Manage/Manage Company/ManageCompany';
import ManageArea from '../../pages/Manage/Manage Area/ManageArea';

import LendingMonthly from '../../Customer Details/Monthly/LendingMonthly';
import LendingDaily from '../../Customer Details/Daily/LendingDaily';

import DailyAnalytics from '../../pages/Analytics/Daily/DailyAnalytics';
import MonthlyAnalytics from '../../pages/Analytics/Monthly/MonthlyAnalytics';

import Logout from '../../pages/Logout/Logout';
import Notification from '../../pages/Notification/Notification';
import Document from '../../pages/Documents/Document.jsx';

import { getAdminNotifications } from '../../api/notificationAPI.js';

function Dashboard({ setIsAuthenticated }) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const location = useLocation();

  const checkUnreadNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setHasUnreadNotifications(data.some(n => !n.is_read));
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (location.pathname === '/dashboard/notification/admin') {
      setHasUnreadNotifications(false);
    } else {
      checkUnreadNotifications();
    }
  }, [location.pathname]);

  return (
    <>
      <NavBar
        navData={navData}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/riders/customer" element={<Customer />} />

          <Route path="/manage/company" element={<ManageCompany />} />
          <Route path="/manage/area" element={<ManageArea />} />

          <Route
            path="/customer/daily/:name/:lending_company"
            element={<LendingDaily />}
          />
          <Route
            path="/customer/monthly/:customer_id"
            element={<LendingMonthly />}
          />

          <Route path="/analytics/daily" element={<DailyAnalytics />} />
          <Route path="/analytics/monthly" element={<MonthlyAnalytics />} />

          <Route path='/documents/admin' element={<Document />}/>
          <Route
            path="/notification/admin"
            element={<Notification />}
          />

          <Route
            path="/logout"
            element={<Logout setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;
