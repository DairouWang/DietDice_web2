// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Dice5, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// 动画变体
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-10 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* 装饰背景元素 */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                智能膳食搭配助手
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                让健康饮食 <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">变得简单有趣</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8 max-w-lg">
                DietDice 帮助您根据营养目标，智能搭配每日食谱。不再为"吃什么"而烦恼，轻松达成健康目标。
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/dice" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-green-600 rounded-full hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                  立即开始搭配
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link to="/recipes" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                  浏览食谱库
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>科学配比</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>个性化推荐</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>简单易用</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 flex justify-center lg:justify-end relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <motion.img 
                  src="/images/pexels-photo-1092730.jpeg" 
                  alt="DietDice App Interface" 
                  className="relative rounded-2xl shadow-2xl border-4 border-white object-cover z-10 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500"
                  whileHover={{ scale: 1.02 }}
                />
                
                {/* Floating Cards */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20 border border-gray-100"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">今日蛋白质摄入</p>
                      <p className="text-lg font-bold text-gray-800">68g <span className="text-green-500 text-xs">✓ 达标</span></p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">不仅仅是食谱，更是您的<span className="text-green-600">健康生活方式</span></h2>
            <p className="text-lg text-gray-600">DietDice 结合营养学原理与智能算法，为您提供全方位的饮食解决方案。</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <Utensils size={28} className="text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">自建专属食谱库</h3>
                <p className="text-gray-600 mb-6">轻松录入您喜爱的菜肴，自动计算并保存营养成分数据。打造属于您的个性化美食数据库。</p>
                <Link to="/recipes" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 group-hover:translate-x-1 transition-transform">
                  管理我的食谱
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                  <Dice5 size={28} className="text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">智能营养搭配</h3>
                <p className="text-gray-600 mb-6">只需输入您的营养目标，AI 算法即刻为您从食谱库中筛选出最佳组合，让每一餐都精准达标。</p>
                <Link to="/dice" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 group-hover:translate-x-1 transition-transform">
                  立即尝试搭配
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How it works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">简单三步，开启健康饮食</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: 1, title: "添加食谱", desc: "录入您喜欢的菜肴及营养信息" },
                { num: 2, title: "设定目标", desc: "输入每餐所需的碳水、蛋白质和脂肪" },
                { num: 3, title: "智能搭配", desc: "点击骰子，获取完美的食谱组合" }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
                  )}
                  <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 relative z-10 border-4 border-green-50">
                    <span className="text-3xl font-bold text-green-600">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 max-w-xs">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-600 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">准备好改变您的饮食习惯了吗？</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">加入 DietDice，让每一餐都成为对身体的投资。</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dice" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-green-900 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              <Dice5 size={20} className="mr-2" />
              立即开始
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}