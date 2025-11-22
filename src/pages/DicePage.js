// src/pages/DicePage.js
import React, { useState, useEffect } from 'react';
import { Dice5, ChefHat, Flame, X, Info, Sparkles } from 'lucide-react';
import { getAllRecipes } from '../services/recipe-service';
import { motion, AnimatePresence } from 'framer-motion';

export default function DicePage() {
  const [recipes, setRecipes] = useState([]);
  const [userInput, setUserInput] = useState({
    carbs: '',
    protein: '',
    fat: ''
  });
  const [isRolling, setIsRolling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipeDetailsModal, setRecipeDetailsModal] = useState(false);
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState(null);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const recipesData = await getAllRecipes();
        setRecipes(recipesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("加载食谱失败，请稍后再试");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value
    });
  };

  const validateInputs = () => {
    if (!userInput.carbs || !userInput.protein || !userInput.fat) {
      return false;
    }
    return true;
  };

  const findCompatibleRecipePairs = () => {
    const targetCarbs = parseFloat(userInput.carbs);
    const targetProtein = parseFloat(userInput.protein);
    const targetFat = parseFloat(userInput.fat);
    
    const pairs = [];
    
    for (let i = 0; i < recipes.length; i++) {
      for (let j = i + 1; j < recipes.length; j++) {
        const recipe1 = recipes[i];
        const recipe2 = recipes[j];
        
        const totalCarbs = recipe1.carbs + recipe2.carbs;
        const totalProtein = recipe1.protein + recipe2.protein;
        const totalFat = recipe1.fat + recipe2.fat;
        
        const carbsInRange = Math.abs(totalCarbs - targetCarbs) <= 20;
        const proteinInRange = Math.abs(totalProtein - targetProtein) <= 10;
        const fatInRange = Math.abs(totalFat - targetFat) <= 10;
        
        if (carbsInRange && proteinInRange && fatInRange) {
          pairs.push([recipe1, recipe2]);
        }
      }
    }
    
    if (pairs.length > 0) {
      const randomIndex = Math.floor(Math.random() * pairs.length);
      return pairs[randomIndex];
    }
    
    return null;
  };

  const rollDice = () => {
    if (!validateInputs()) {
      alert("请输入所有营养素目标值");
      return;
    }
    
    setIsRolling(true);
    
    setTimeout(() => {
      const recipePair = findCompatibleRecipePairs();
      
      if (recipePair) {
        setSelectedRecipes(recipePair);
        setShowModal(true);
      } else {
        alert("没有找到符合条件的食谱组合，请尝试调整营养素目标值");
      }
      
      setIsRolling(false);
    }, 1500);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipes([]);
  };

  const viewRecipeDetails = (recipe) => {
    setSelectedRecipeDetails(recipe);
    setRecipeDetailsModal(true);
  };
  
  const closeRecipeDetailsModal = () => {
    setRecipeDetailsModal(false);
    setSelectedRecipeDetails(null);
  };

  const calculateTotalNutrients = () => {
    if (selectedRecipes.length !== 2) return { carbs: 0, protein: 0, fat: 0 };
    
    return {
      carbs: selectedRecipes[0].carbs + selectedRecipes[1].carbs,
      protein: selectedRecipes[0].protein + selectedRecipes[1].protein,
      fat: selectedRecipes[0].fat + selectedRecipes[1].fat
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          
          <motion.div 
            className="bg-white rounded-3xl shadow-xl overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Gradient */}
            <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600 absolute top-0 left-0 right-0"></div>
            
            <div className="relative px-8 pt-12 pb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center w-24 h-24 mx-auto flex items-center justify-center -mt-16 border-4 border-white">
                <ChefHat size={40} className="text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">智能膳食搭配</h2>
              <p className="text-center text-gray-500 mb-10">输入您的营养目标，让 AI 为您生成完美的每一餐</p>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
                  />
                  <p className="text-gray-500">正在加载食谱库...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                  <Info size={20} className="mr-2 flex-shrink-0" />
                  <div>
                    <p>{error}</p>
                    <button className="underline text-sm font-semibold mt-1" onClick={() => window.location.reload()}>重试</button>
                  </div>
                </div>
              )}

              {!isLoading && !error && (
                <>
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {[
                      { label: "碳水化合物", name: "carbs", color: "text-blue-600", bg: "bg-blue-50", border: "focus:ring-blue-500" },
                      { label: "蛋白质", name: "protein", color: "text-green-600", bg: "bg-green-50", border: "focus:ring-green-500" },
                      { label: "脂肪", name: "fat", color: "text-yellow-600", bg: "bg-yellow-50", border: "focus:ring-yellow-500" }
                    ].map((item) => (
                      <div key={item.name} className="relative group">
                        <label className={`block text-sm font-semibold mb-2 ${item.color}`}>{item.label} (g)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name={item.name}
                            value={userInput[item.name]}
                            onChange={handleInputChange}
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${item.border}`}
                            min="0"
                          />
                          <div className={`absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-gray-300 transition-colors`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <motion.button
                      onClick={rollDice}
                      disabled={isRolling}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                      <div className="relative px-8 py-4 bg-black rounded-full leading-none flex items-center divide-x divide-gray-600">
                        <motion.span 
                          className="flex items-center space-x-5"
                          animate={isRolling ? { rotate: 360 } : {}}
                          transition={isRolling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
                        >
                          <Dice5 size={28} className="text-green-400" />
                        </motion.span>
                        <span className="pl-6 text-green-100 group-hover:text-white transition duration-200 font-bold text-lg">
                          {isRolling ? '正在搭配...' : '随机生成食谱'}
                        </span>
                      </div>
                    </motion.button>
                    
                    {recipes.length === 0 && (
                      <p className="mt-6 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm">
                        提示: 食谱库为空，请先添加食谱。
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Results Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                <button 
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <Sparkles className="text-yellow-300" size={24} />
                  <h3 className="text-2xl font-bold text-white">今日完美搭配</h3>
                </div>
                <p className="text-green-100 mt-2">根据您的目标，为您精选了这两道美味佳肴。</p>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {selectedRecipes.map((recipe, index) => (
                    <motion.div 
                      key={index} 
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      onClick={() => viewRecipeDetails(recipe)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                          <span className="text-white font-medium text-sm">点击查看详情</span>
                        </div>
                        <img
                          src={recipe.image || '/api/placeholder/400/250'}
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                          {recipe.tag}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">{recipe.name}</h3>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "碳水", value: recipe.carbs, color: "bg-blue-50 text-blue-700" },
                            { label: "蛋白质", value: recipe.protein, color: "bg-green-50 text-green-700" },
                            { label: "脂肪", value: recipe.fat, color: "bg-yellow-50 text-yellow-700" }
                          ].map((nutrient) => (
                            <div key={nutrient.label} className={`${nutrient.color} rounded-lg p-2 text-center`}>
                              <p className="text-[10px] opacity-70 uppercase tracking-wider">{nutrient.label}</p>
                              <p className="text-sm font-bold">{nutrient.value}g</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Total Nutrition Summary */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center">
                      <Flame size={20} className="text-orange-500 mr-2" />
                      总营养摄入
                    </h4>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">对比目标差异</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "碳水", current: calculateTotalNutrients().carbs, target: userInput.carbs, color: "text-blue-600" },
                      { label: "蛋白质", current: calculateTotalNutrients().protein, target: userInput.protein, color: "text-green-600" },
                      { label: "脂肪", current: calculateTotalNutrients().fat, target: userInput.fat, color: "text-yellow-600" }
                    ].map((item) => {
                      const diff = item.current - item.target;
                      const isClose = Math.abs(diff) <= 10;
                      
                      return (
                        <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold ${item.color}`}>{item.current}</span>
                            <span className="text-sm text-gray-400">g</span>
                          </div>
                          <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block ${
                            isClose ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {diff > 0 ? '+' : ''}{diff}g
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={rollDice}
                    className="px-6 py-3 bg-white border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center"
                  >
                    <Dice5 size={20} className="mr-2" />
                    再试一次
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    满意，就这样吃！
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Details Modal */}
      <AnimatePresence>
        {recipeDetailsModal && selectedRecipeDetails && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRecipeDetailsModal}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={closeRecipeDetailsModal} 
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative h-64">
                <img
                  src={selectedRecipeDetails.image || '/api/placeholder/400/250'}
                  alt={selectedRecipeDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedRecipeDetails.name}</h3>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {selectedRecipeDetails.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "碳水", value: selectedRecipeDetails.carbs, unit: "g" },
                    { label: "蛋白质", value: selectedRecipeDetails.protein, unit: "g" },
                    { label: "脂肪", value: selectedRecipeDetails.fat, unit: "g" }
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{item.value}<span className="text-sm text-gray-400 ml-1">{item.unit}</span></p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <ChefHat size={20} className="mr-2 text-green-600" />
                    制作步骤
                  </h4>
                  <div className="space-y-4">
                    {selectedRecipeDetails.steps ? (
                      selectedRecipeDetails.steps.split('\n').map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">暂无制作步骤</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}