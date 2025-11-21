// src/pages/LoginPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { authenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-green-800 mb-6 text-center">登录到DietDice</h1>
        
        <Authenticator
          formFields={{
            signUp: {
              email: {
                label: '邮箱',
                placeholder: '请输入邮箱',
                isRequired: true,
                order: 1,
              },
              password: {
                label: '密码',
                placeholder: '请输入密码',
                isRequired: true,
                order: 2,
              },
              confirm_password: {
                label: '确认密码',
                placeholder: '请再次输入密码',
                isRequired: true,
                order: 3,
              },
            },
            signIn: {
              username: {
                label: '邮箱',
                placeholder: '请输入邮箱',
              },
              password: {
                label: '密码',
                placeholder: '请输入密码',
              },
            },
          }}
        >
          {({ signOut, user }) => {
            // 登录成功后，触发 checkAuth 并导航到首页
            if (user) {
              checkAuth().then(() => {
                navigate('/');
              });
            }
            return null;
          }}
        </Authenticator>
      </div>
    </div>
  );
}