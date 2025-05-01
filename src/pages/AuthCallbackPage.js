// src/pages/AuthCallbackPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForTokens, getUserInfo, storeUser, storeTokens } from '../services/auth-service';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 从URL中获取授权码
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        
        if (!code) {
          setError("授权码缺失");
          return;
        }
        
        // 交换授权码获取令牌
        const tokens = await exchangeCodeForTokens(code);
        
        // 使用访问令牌获取用户信息
        const userInfo = await getUserInfo(tokens.access_token);
        
        // 将用户信息和令牌存储到DynamoDB
        await storeUser(userInfo);
        await storeTokens(userInfo.sub || userInfo.id, tokens);
        
        // 存储信息到本地存储
        localStorage.setItem('auth_tokens', JSON.stringify({
          ...tokens,
          expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in
        }));
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        
        // 更新认证状态
        setUser(userInfo);
        setAuthenticated(true);
        
        // 重定向到首页或仪表板
        navigate('/');
      } catch (err) {
        console.error("认证回调处理失败:", err);
        setError("认证失败，请稍后再试");
      }
    };

    handleCallback();
  }, [location, navigate, setUser, setAuthenticated]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold text-red-600 mb-4 text-center">认证错误</h1>
          <p className="text-gray-600 text-center">{error}</p>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      <p className="mt-2 text-green-800">认证中，请稍候...</p>
    </div>
  );
}