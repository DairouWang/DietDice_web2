// src/pages/LoginPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, ThemeProvider, useTheme, View, Image, Text, Heading, useAuthenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// 自定义 Amplify 主题
const theme = {
  name: 'diet-dice-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '{colors.green.10}',
          20: '{colors.green.20}',
          40: '{colors.green.40}',
          60: '{colors.green.60}',
          80: '{colors.green.80}',
          90: '{colors.green.90}',
          100: '{colors.green.100}',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '{colors.green.60}' },
          _hover: {
            backgroundColor: { value: '{colors.green.80}' },
          },
        },
        link: {
          color: { value: '{colors.green.80}' },
        }
      },
      tabs: {
        item: {
          _active: {
            color: { value: '{colors.green.80}' },
            borderColor: { value: '{colors.green.80}' },
          },
        },
      },
    },
  },
};

const components = {
  Header() {
    return (
      <View textAlign="center" padding="large">
        <Heading level={3} color="green.80">欢迎来到 DietDice</Heading>
        <Text color="gray.60">开启您的健康饮食之旅</Text>
      </View>
    );
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { authenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
        {/* Left Side - Image & Branding */}
        <motion.div 
          className="hidden md:flex md:w-1/2 bg-green-600 relative items-center justify-center overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543353071-087f9a7ce435?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-800/90"></div>
          
          <div className="relative z-10 p-12 text-white max-w-lg">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-6">DietDice</h1>
              <p className="text-xl text-green-50 mb-8 leading-relaxed">
                不仅是记录，更是智能规划。
                <br />
                让每一餐都成为对身体的投资。
              </p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <span className="block text-3xl font-bold mb-1">500+</span>
                  <span className="text-sm text-green-100">健康食谱</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <span className="block text-3xl font-bold mb-1">AI</span>
                  <span className="text-sm text-green-100">智能搭配</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </motion.div>

        {/* Right Side - Authenticator */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-12 bg-white relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-10 md:left-10 p-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            返回首页
          </button>

          <div className="w-full max-w-md">
             <div className="md:hidden text-center mb-8 mt-12">
                <h1 className="text-3xl font-bold text-green-700">DietDice</h1>
                <p className="text-gray-500">开启您的健康饮食之旅</p>
             </div>

            <Authenticator
              components={components}
              formFields={{
                signUp: {
                  email: {
                    label: '邮箱',
                    placeholder: '请输入您的邮箱',
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
                    placeholder: '请输入您的邮箱',
                  },
                  password: {
                    label: '密码',
                    placeholder: '请输入密码',
                  },
                },
              }}
            >
              {({ signOut, user }) => {
                if (user) {
                  checkAuth().then(() => {
                    navigate('/');
                  });
                }
                return null;
              }}
            </Authenticator>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}