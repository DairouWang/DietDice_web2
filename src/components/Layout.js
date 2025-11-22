// src/components/Layout.js
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Utensils, Dice5, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { authenticated, user, logout } = useAuth();
  const location = useLocation();

  const navLinkClasses = ({ isActive }) => 
    isActive 
      ? "relative px-3 py-2 text-green-600 font-semibold flex items-center transition-colors" 
      : "relative px-3 py-2 text-gray-600 hover:text-green-600 flex items-center transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-green-200 selection:text-green-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center tracking-tight">
            DietDice
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {[
              { to: "/", icon: Home, label: "首页" },
              { to: "/recipes", icon: Utensils, label: "食谱库" },
              { to: "/dice", icon: Dice5, label: "搭配骰子" },
            ].map((item) => (
              <NavLink 
                key={item.to}
                to={item.to} 
                className={navLinkClasses}
                end={item.to === "/"}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className="mr-2" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2 self-center" />

            {authenticated ? (
              <div className="flex items-center gap-4 pl-2">
                <span className="text-sm font-medium text-gray-700">{user?.name || '用户'}</span>
                <button 
                  onClick={logout}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="退出登录"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                  }`
                }
              >
                <LogIn size={18} className="mr-2" />
                登录
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content with Page Transitions */}
      <main className="flex-grow relative">
        {/* 
           AnimatePresence mode="wait" ensures the exiting component 
           finishes its animation before the new one starts.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30 pb-safe">
        <div className="grid grid-cols-4 h-16">
          {[
            { to: "/", icon: Home, label: "首页" },
            { to: "/recipes", icon: Utensils, label: "食谱" },
            { to: "/dice", icon: Dice5, label: "搭配" },
          ].map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center transition-colors ${
                  isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                }`
              }
              end={item.to === "/"}
            >
              <item.icon size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {authenticated ? (
            <button 
              onClick={logout}
              className="flex flex-col items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">退出</span>
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center transition-colors ${
                  isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              <LogIn size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">登录</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="md:flex md:justify-between md:items-start">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">DietDice</h2>
              <p className="text-gray-500 max-w-xs">让健康饮食变得简单有趣。智能搭配，均衡营养，开启活力每一天。</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">导航</h3>
                <ul className="space-y-3">
                  <li><NavLink to="/" className="text-gray-500 hover:text-green-600 transition-colors">首页</NavLink></li>
                  <li><NavLink to="/recipes" className="text-gray-500 hover:text-green-600 transition-colors">食谱库</NavLink></li>
                  <li><NavLink to="/dice" className="text-gray-500 hover:text-green-600 transition-colors">搭配骰子</NavLink></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">关于</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-500 hover:text-green-600 transition-colors">关于我们</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-green-600 transition-colors">隐私政策</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-green-600 transition-colors">服务条款</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} DietDice. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}