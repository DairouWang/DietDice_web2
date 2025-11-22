// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-green-600">
            <AlertTriangle size={80} />
          </div>
        </div>
        
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">页面迷路了</h2>
        <p className="text-gray-500 mb-10 text-lg">看起来您想找的这道"菜"还没准备好，或者已经被吃掉了。</p>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition duration-300">
            <Home size={20} className="mr-2" />
            返回首页找吃的
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}