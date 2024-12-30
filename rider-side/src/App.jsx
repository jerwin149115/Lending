import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"  
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
              path="/dashboard/*"
              element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />
          <Route
            path="/logout"
            element={<Logout setIsAuthenticated={setIsAuthenticated}/>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;