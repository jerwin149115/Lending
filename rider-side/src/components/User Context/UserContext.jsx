import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: '', lending_company: '' };
    });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier use of the context
export const useUserContext = () => {
  return useContext(UserContext);
};
