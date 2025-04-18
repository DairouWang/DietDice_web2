// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-6xl font-bold text-green-600 mb-6">404</h1>
        <h2 className="text-3xl font-semibold text-green-800 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移除。</p>
        <Link to="/" className="inline-flex items-center justify-center bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition duration-300">
          <Home size={20} className="mr-2" />
          返回首页
        </Link>
      </div>
    </div>
  );
}