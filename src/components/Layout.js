// src/components/Layout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Utensils, Dice5, LogIn, LogOut } from 'lucide-react';

export default function Layout() {
  const { authenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/" className="text-3xl font-bold flex items-center">
            DietDice
          </NavLink>
          <nav className="hidden md:flex space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "text-white font-bold flex items-center" : "text-green-100 hover:text-white flex items-center"
              }
              end
            >
              <Home size={20} className="mr-2" />
              首页
            </NavLink>
            <NavLink 
              to="/recipes" 
              className={({ isActive }) => 
                isActive ? "text-white font-bold flex items-center" : "text-green-100 hover:text-white flex items-center"
              }
            >
              <Utensils size={20} className="mr-2" />
              食谱库
            </NavLink>
            <NavLink 
              to="/dice" 
              className={({ isActive }) => 
                isActive ? "text-white font-bold flex items-center" : "text-green-100 hover:text-white flex items-center"
              }
            >
              <Dice5 size={20} className="mr-2" />
              搭配骰子
            </NavLink>

            {authenticated ? (
              <div className="flex items-center">
                <span className="text-green-100 mr-4">{user?.name || '用户'}</span>
                <button 
                  onClick={logout}
                  className="text-green-100 hover:text-white flex items-center"
                >
                  <LogOut size={20} className="mr-2" />
                  退出
                </button>
              </div>
            ) : (
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  isActive ? "text-white font-bold flex items-center" : "text-green-100 hover:text-white flex items-center"
                }
              >
                <LogIn size={20} className="mr-2" />
                登录
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30">
        <div className="grid grid-cols-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive 
                ? "flex flex-col items-center justify-center py-3 text-green-600" 
                : "flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600"
            }
            end
          >
            <Home size={24} />
            <span className="text-xs mt-1">首页</span>
          </NavLink>
          <NavLink 
            to="/recipes" 
            className={({ isActive }) => 
              isActive 
                ? "flex flex-col items-center justify-center py-3 text-green-600" 
                : "flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600"
            }
          >
            <Utensils size={24} />
            <span className="text-xs mt-1">食谱库</span>
          </NavLink>
          <NavLink 
            to="/dice" 
            className={({ isActive }) => 
              isActive 
                ? "flex flex-col items-center justify-center py-3 text-green-600" 
                : "flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600"
            }
          >
            <Dice5 size={24} />
            <span className="text-xs mt-1">搭配骰子</span>
          </NavLink>
          
          {authenticated ? (
            <button 
              onClick={logout}
              className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600"
            >
              <LogOut size={24} />
              <span className="text-xs mt-1">退出</span>
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                isActive 
                  ? "flex flex-col items-center justify-center py-3 text-green-600" 
                  : "flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600"
              }
            >
              <LogIn size={24} />
              <span className="text-xs mt-1">登录</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 md:flex md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">DietDice</h2>
            <p className="text-green-200">轻松搭配健康膳食</p>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">快速链接</h3>
            <ul>
              <li><NavLink to="/" className="text-green-200 hover:text-white">首页</NavLink></li>
              <li><NavLink to="/recipes" className="text-green-200 hover:text-white">食谱库</NavLink></li>
              <li><NavLink to="/dice" className="text-green-200 hover:text-white">搭配骰子</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-6 pt-6 border-t border-green-700 text-center text-green-300 text-sm">
          <p>© {new Date().getFullYear()} DietDice. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}