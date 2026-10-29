import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('adminToken') || null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('adminUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to parse adminUser from localStorage', e);
      return null;
    }
  });

  const login = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider
      value={{
        adminToken,
        adminUser,
        isAuthenticated: Boolean(adminToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
