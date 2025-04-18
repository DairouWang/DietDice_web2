import React, { useState, useEffect, useRef } from 'react';
import { Dice5 } from 'lucide-react';
import { getAllRecipes } from '../services/recipe-service';

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
  const diceRef = useRef(null);
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
    
    // 创建所有可能的食谱对组合
    const pairs = [];
    
    for (let i = 0; i < recipes.length; i++) {
      for (let j = i + 1; j < recipes.length; j++) {
        const recipe1 = recipes[i];
        const recipe2 = recipes[j];
        
        const totalCarbs = recipe1.carbs + recipe2.carbs;
        const totalProtein = recipe1.protein + recipe2.protein;
        const totalFat = recipe1.fat + recipe2.fat;
        
        // 检查是否符合条件范围
        const carbsInRange = Math.abs(totalCarbs - targetCarbs) <= 20;
        const proteinInRange = Math.abs(totalProtein - targetProtein) <= 10;
        const fatInRange = Math.abs(totalFat - targetFat) <= 10;
        
        if (carbsInRange && proteinInRange && fatInRange) {
          pairs.push([recipe1, recipe2]);
        }
      }
    }
    
    // 如果有匹配的组合，随机选择一个
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
    
    if (diceRef.current) {
      diceRef.current.classList.add('animate-spin');
    }
    
    setTimeout(() => {
      const recipePair = findCompatibleRecipePairs();
      
      if (recipePair) {
        setSelectedRecipes(recipePair);
        setShowModal(true);
      } else {
        alert("没有找到符合条件的食谱组合，请尝试调整营养素目标值");
      }
      
      setIsRolling(false);
      
      if (diceRef.current) {
        diceRef.current.classList.remove('animate-spin');
      }
    }, 2000); // 2秒后停止动画并显示结果
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
    <div className="min-h-screen bg-green-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">随机搭配今日食谱</h2>
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-2 text-green-800">加载中...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
                <button 
                  className="underline mt-2"
                  onClick={() => window.location.reload()}
                >
                  重试
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <div>
                <p className="text-gray-600 mb-6 text-center">输入您的营养目标，点击骰子随机搭配两个食谱</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">碳水 (g)</label>
                    <input
                      type="number"
                      name="carbs"
                      value={userInput.carbs}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">蛋白质 (g)</label>
                    <input
                      type="number"
                      name="protein"
                      value={userInput.protein}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">脂肪 (g)</label>
                    <input
                      type="number"
                      name="fat"
                      value={userInput.fat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                {/* Dice Button */}
                <div className="flex justify-center">
                  <button
                    onClick={rollDice}
                    disabled={isRolling}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <div ref={diceRef} className="transition-transform duration-1000 ease-in-out">
                      <Dice5 size={48} />
                    </div>
                  </button>
                </div>
                
                {recipes.length === 0 && (
                  <div className="text-center mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-amber-700">您的食谱库是空的。请先添加一些食谱，才能使用骰子功能。</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Recipe Pair */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-green-800">今日食谱搭配</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedRecipes.map((recipe, index) => (
                  <div 
                    key={index} 
                    className="bg-green-50 rounded-lg overflow-hidden shadow-md"
                    onClick={() => viewRecipeDetails(recipe)}
                    >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={recipe.image || '/api/placeholder/400/250'}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-green-800">{recipe.name}</h3>
                      <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm font-semibold mt-2">
                        {recipe.tag}
                      </span>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600">碳水</p>
                          <p className="text-sm font-bold text-green-700">{recipe.carbs}g</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600">蛋白质</p>
                          <p className="text-sm font-bold text-green-700">{recipe.protein}g</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600">脂肪</p>
                          <p className="text-sm font-bold text-green-700">{recipe.fat}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Nutrition */}
              <div className="bg-green-100 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-green-800 mb-3">总营养成分</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">碳水</p>
                    <p className="text-xl font-bold text-green-700">{calculateTotalNutrients().carbs}g</p>
                    <p className="text-xs text-gray-500">
                      目标: {userInput.carbs}g 
                      <span className={`ml-1 ${Math.abs(calculateTotalNutrients().carbs - userInput.carbs) <= 10 ? 'text-green-600' : 'text-amber-600'}`}>
                        ({calculateTotalNutrients().carbs > userInput.carbs ? '+' : ''}{calculateTotalNutrients().carbs - userInput.carbs}g)
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">蛋白质</p>
                    <p className="text-xl font-bold text-green-700">{calculateTotalNutrients().protein}g</p>
                    <p className="text-xs text-gray-500">
                      目标: {userInput.protein}g
                      <span className={`ml-1 ${Math.abs(calculateTotalNutrients().protein - userInput.protein) <= 5 ? 'text-green-600' : 'text-amber-600'}`}>
                        ({calculateTotalNutrients().protein > userInput.protein ? '+' : ''}{calculateTotalNutrients().protein - userInput.protein}g)
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">脂肪</p>
                    <p className="text-xl font-bold text-green-700">{calculateTotalNutrients().fat}g</p>
                    <p className="text-xs text-gray-500">
                      目标: {userInput.fat}g
                      <span className={`ml-1 ${Math.abs(calculateTotalNutrients().fat - userInput.fat) <= 5 ? 'text-green-600' : 'text-amber-600'}`}>
                        ({calculateTotalNutrients().fat > userInput.fat ? '+' : ''}{calculateTotalNutrients().fat - userInput.fat}g)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={rollDice}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
                >
                  <Dice5 size={20} className="mr-2" />
                  重新骰一次
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
        {recipeDetailsModal && selectedRecipeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-semibold text-green-800">{selectedRecipeDetails.name}</h3>
                <button onClick={closeRecipeDetailsModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            
            <div className="p-6">
                <div className="mb-6">
                <img
                    src={selectedRecipeDetails.image || '/api/placeholder/400/250'}
                    alt={selectedRecipeDetails.name}
                    className="w-full h-64 object-cover rounded-lg"
                />
                </div>
                
                <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm font-semibold">
                    {selectedRecipeDetails.tag}
                </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">碳水</p>
                    <p className="text-xl font-bold text-green-700">{selectedRecipeDetails.carbs}g</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">蛋白质</p>
                    <p className="text-xl font-bold text-green-700">{selectedRecipeDetails.protein}g</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">脂肪</p>
                    <p className="text-xl font-bold text-green-700">{selectedRecipeDetails.fat}g</p>
                </div>
                </div>
                
                <div>
                <h4 className="text-lg font-semibold text-green-800 mb-2">制作步骤</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                    {selectedRecipeDetails.steps ? (
                    selectedRecipeDetails.steps.split('\n').map((step, index) => (
                        <p key={index} className="mb-2">{step}</p>
                    ))
                    ) : (
                    <p className="text-gray-500">暂无制作步骤</p>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}