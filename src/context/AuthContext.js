// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, logout } from '../services/auth-service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);
        
        if (isAuth) {
          const userInfo = JSON.parse(localStorage.getItem('user_info'));
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, logout: handleLogout, setUser, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);