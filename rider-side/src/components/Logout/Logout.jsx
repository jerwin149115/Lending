import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
  useEffect(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  return <Navigate to="/login" />;
};

export default Logout;
