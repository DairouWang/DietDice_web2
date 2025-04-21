// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, signOut } from '../services/auth-service';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 在组件挂载时检查用户认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const isAuth = await isAuthenticated();
        
        if (isAuth) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
        
        setError(null);
      } catch (err) {
        console.error("Authentication check failed:", err);
        setError("认证检查失败");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登出处理
  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      setError("登出失败");
    }
  };

  // 更新用户信息
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  // 提供的上下文值
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    updateUser,
    signOut: handleSignOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用认证的钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};