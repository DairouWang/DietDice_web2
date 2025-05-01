// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import OAuth2Login from 'react-simple-oauth2-login';
import oauthConfig from '../config/oauth-config';

export default function LoginPage() {
  const [error, setError] = useState(null);

  const onSuccess = (response) => {
    console.log('认证成功:', response);
    // 获取到授权码后，页面会重定向到回调URL
    // 在回调页面处理后续逻辑
  };

  const onFailure = (response) => {
    console.error('认证失败:', response);
    setError('登录失败，请稍后再试');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-green-800 mb-6 text-center">登录到DietDice</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <OAuth2Login
            authorizationUrl={oauthConfig.authorizationEndpoint}
            responseType="code"
            clientId={oauthConfig.clientId}
            redirectUri={oauthConfig.redirectUri}
            scope={oauthConfig.scope}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText="使用OAuth2登录"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md"
          />
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-green-600 font-medium mt-2 hover:text-green-700">
            返回首页
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}