// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Dice5, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl shadow-xl overflow-hidden my-6">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold text-white mb-4">营养均衡，轻松搭配</h1>
            <p className="text-green-100 text-lg mb-6">DietDice 帮助您根据营养目标，智能搭配每日食谱，让健康饮食变得简单。</p>
            <Link to="/dice" className="inline-flex items-center bg-white text-green-600 font-bold px-6 py-3 rounded-full shadow-md hover:bg-green-50 transition duration-300">
              立即开始搭配
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/images/pexels-photo-1092730.jpeg" 
              alt="DietDice App" 
              className="rounded-lg shadow-lg border-4 border-white w-96 h-64 object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-12">DietDice 特色功能</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Utensils size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">自建食谱库</h3>
            <p className="text-gray-600">添加、保存和管理您喜爱的食谱。记录每道菜的营养成分，方便后续搭配和查询。</p>
            <Link to="/recipes" className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700">
              管理我的食谱
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Dice5 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">营养智能搭配</h3>
            <p className="text-gray-600">根据您的碳水、蛋白质和脂肪需求，DietDice 智能推荐最适合的食谱组合。</p>
            <Link to="/dice" className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700">
              使用搭配骰子
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* How it works Section */}
      <section className="py-12 bg-green-50 rounded-xl my-12 px-6">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-8">如何使用</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6">1</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-800 mb-2">添加您喜欢的食谱</h3>
              <p className="text-gray-600">将您常做的菜肴添加到食谱库中，包括名称、类型和营养成分。</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-800 mb-2">设置您的营养目标</h3>
              <p className="text-gray-600">根据您的饮食需求，输入每餐所需的碳水、蛋白质和脂肪目标。</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl mb-4 md:mb-0 md:mr-6">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-800 mb-2">点击骰子获取推荐</h3>
              <p className="text-gray-600">DietDice 会为您智能匹配最适合的食谱组合，让您的一餐营养均衡。</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-green-800 mb-4">立即开始健康饮食之旅</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">加入 DietDice，让每一餐都营养均衡，健康美味。</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/recipes" className="inline-flex items-center justify-center bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition duration-300">
            <Utensils size={20} className="mr-2" />
            开始添加食谱
          </Link>
          <Link to="/dice" className="inline-flex items-center justify-center bg-white border-2 border-green-600 text-green-600 font-bold px-6 py-3 rounded-full shadow-md hover:bg-green-50 transition duration-300">
            <Dice5 size={20} className="mr-2" />
            尝试骰子搭配
          </Link>
        </div>
      </section>
    </div>
  );
}