// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
        email: attributes.email,
        name: attributes.name || attributes.email?.split('@')[0] || 'User',
        picture: attributes.picture || null,
      });
      setAuthenticated(true);
    } catch (error) {
      console.log('用户未登录:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      authenticated, 
      loading, 
      logout: handleLogout, 
      setUser, 
      setAuthenticated,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);