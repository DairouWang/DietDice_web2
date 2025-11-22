// src/pages/RecipePage.js
import { useState, useEffect, useRef } from 'react';
import { Plus, X, Trash2, Edit, Upload, Search, Filter, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getAllRecipes, 
    addRecipe as addRecipeToDB, 
    updateRecipe as updateRecipeInDB,
    deleteRecipe as deleteRecipeFromDB 
  } from '../services/recipe-service';
import { uploadImageToS3 } from '../services/s3-service'; 

export default function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    tag: '',
    carbs: 0,
    protein: 0,
    fat: 0,
    steps: '',
    image: '/images/default-recipe.jpg',
    imageKey: null
  });
  const [selectedFile, setSelectedFile] = useState(null); 
  const fileInputRef = useRef(null); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const recipesData = await getAllRecipes();
        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      setFilteredRecipes(recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerTerm) || 
        recipe.tag.toLowerCase().includes(lowerTerm)
      ));
    }
  }, [searchTerm, recipes]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    setIsAddingRecipe(false);
    setIsEditingRecipe(false);
    setNewRecipe({
      name: '',
      tag: '',
      carbs: 0,
      protein: 0,
      fat: 0,
      steps: '',
      image: '/images/default-recipe.jpg',
      imageKey: null
    });
    setSelectedFile(null);
  };

  const handleAddRecipe = () => {
    setIsAddingRecipe(true);
    setIsEditingRecipe(false);
    setShowModal(true);
  };

  const handleEditRecipe = (recipe) => {
    setNewRecipe(recipe);
    setIsEditingRecipe(true);
    setIsAddingRecipe(false);
    setShowModal(true);
  };

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("确定要删除这个食谱吗？")) {
      try {
        await deleteRecipeFromDB(id);
        const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
        setRecipes(updatedRecipes);
        if (selectedRecipe && selectedRecipe.id === id) {
          closeModal();
        }
      } catch (err) {
        console.error("Failed to delete recipe:", err);
        alert("删除食谱失败，请稍后再试");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: name === 'carbs' || name === 'protein' || name === 'fat' ? parseFloat(value) : value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setNewRecipe({
          ...newRecipe,
          image: e.target.result,
        });
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      const recipeId = newRecipe.id || Date.now().toString();
      let imageKey = newRecipe.imageKey;
      
      if (selectedFile) {
        imageKey = await uploadImageToS3(selectedFile, recipeId);
      }
      
      const { image, ...recipeData } = newRecipe;

      const recipeToSave = {
        ...recipeData,
        id: recipeId,
        imageKey
      };

      if (isEditingRecipe) {
        const updatedRecipe = await updateRecipeInDB(recipeToSave.id, recipeToSave);
        // Ensure we keep the displayed image (which might be a base64 preview or S3 URL)
        // The backend might return just the key, so we need to be careful
        const displayRecipe = { ...updatedRecipe, image: newRecipe.image };
        setRecipes(recipes.map(r => r.id === updatedRecipe.id ? displayRecipe : r));
      } else {
        const addedRecipe = await addRecipeToDB(recipeToSave);
        const displayRecipe = { ...addedRecipe, image: newRecipe.image };
        setRecipes([...recipes, displayRecipe]);
      }
      setSelectedFile(null);
      closeModal();
    } catch (err) {
      console.error("Failed to save recipe:", err);
      alert("保存食谱失败，请稍后再试");
    }
  };

  const renderImageUpload = () => (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">食谱图片</label>
      <div 
        className="group relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 hover:border-green-400 transition-all duration-300"
        onClick={() => fileInputRef.current.click()}
      >
        {newRecipe.image && newRecipe.image !== '/images/default-recipe.jpg' ? (
          <div className="relative overflow-hidden rounded-lg h-48 w-full">
            <img 
              src={newRecipe.image} 
              alt="Recipe preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <p className="text-white font-medium flex items-center">
                <Upload size={18} className="mr-2" /> 点击更换
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Upload size={24} />
            </div>
            <p className="text-gray-600 font-medium">点击上传食谱图片</p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG, WEBP</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );

  const viewRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setIsAddingRecipe(false);
    setIsEditingRecipe(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">我的食谱库</h2>
            <p className="text-gray-500 mt-1">管理您的 {recipes.length} 道美味佳肴</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索食谱..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRecipe}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full flex items-center shadow-lg shadow-green-200 transition-colors"
            >
              <Plus className="mr-1" size={20} />
              <span className="hidden sm:inline">添加食谱</span>
              <span className="sm:hidden">添加</span>
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
            />
            <p className="text-gray-500">正在加载美味食谱...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center justify-between"
          >
            <p>{error}</p>
            <button 
              className="text-sm font-semibold underline hover:text-red-800"
              onClick={() => window.location.reload()}
            >
              重试
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recipes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">还没有食谱</h3>
            <p className="text-gray-500 mb-8">开始添加您的第一道拿手好菜吧！</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRecipe}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center shadow-md transition-colors"
            >
              <Plus className="mr-2" size={20} />
              添加食谱
            </motion.button>
          </motion.div>
        )}

        {/* Recipe Grid */}
        {!isLoading && !error && filteredRecipes.length > 0 && (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredRecipes.map((recipe) => (
                <motion.div
                  layout
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => viewRecipeDetails(recipe)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={recipe.image || '/images/default-recipe.jpg'}
                      alt={recipe.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {recipe.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{recipe.name}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
                       <div className="flex gap-3">
                          <span title="碳水" className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>{recipe.carbs}</span>
                          <span title="蛋白质" className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>{recipe.protein}</span>
                          <span title="脂肪" className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>{recipe.fat}</span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Mobile Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddRecipe}
          className="md:hidden fixed bottom-20 right-6 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-green-300 z-30"
        >
          <Plus size={28} />
        </motion.button>
      </main>

      {/* Modal */}
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
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-gray-100 px-8 py-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isAddingRecipe ? "添加新食谱" : 
                  isEditingRecipe ? "编辑食谱" :
                  selectedRecipe.name}
                </h3>
                <button 
                  onClick={closeModal} 
                  className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                {(isAddingRecipe || isEditingRecipe) ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveRecipe(); }}>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">食谱名称</label>
                          <input
                            type="text"
                            name="name"
                            value={newRecipe.name}
                            onChange={handleInputChange}
                            placeholder="例如：牛油果鸡胸肉沙拉"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">分类/标签</label>
                          <input
                            type="text"
                            name="tag"
                            value={newRecipe.tag}
                            onChange={handleInputChange}
                            placeholder="例如：减脂餐、早餐"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                         <label className="block text-gray-700 font-semibold mb-3">营养成分 (每份)</label>
                         <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: "碳水", name: "carbs", color: "text-blue-600" },
                            { label: "蛋白质", name: "protein", color: "text-green-600" },
                            { label: "脂肪", name: "fat", color: "text-yellow-600" }
                          ].map((item) => (
                            <div key={item.name} className="relative">
                              <label className={`text-xs font-bold uppercase tracking-wider mb-1 block ${item.color}`}>{item.label}</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name={item.name}
                                  value={newRecipe[item.name]}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                  min="0"
                                  required
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">制作步骤</label>
                        <textarea
                          name="steps"
                          value={newRecipe.steps}
                          onChange={handleInputChange}
                          placeholder="每行一个步骤..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all h-32 resize-none"
                          required
                        />
                      </div>
                      
                      {renderImageUpload()}
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8 border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors duration-300"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {isEditingRecipe ? "更新食谱" : "保存食谱"}
                      </button>
                    </div>
                  </form>
                ) : (
                  // Recipe Details View
                  <div>
                    <div className="mb-8 relative rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={selectedRecipe.image || '/images/default-recipe.jpg'}
                        alt={selectedRecipe.name}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur text-green-700 font-bold px-4 py-1.5 rounded-full shadow-sm">
                          {selectedRecipe.tag}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { label: "碳水", value: selectedRecipe.carbs, color: "bg-blue-50 text-blue-700" },
                        { label: "蛋白质", value: selectedRecipe.protein, color: "bg-green-50 text-green-700" },
                        { label: "脂肪", value: selectedRecipe.fat, color: "bg-yellow-50 text-yellow-700" }
                      ].map((item) => (
                        <div key={item.label} className={`${item.color} rounded-xl p-4 text-center`}>
                          <p className="text-xs opacity-70 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-2xl font-bold">{item.value}<span className="text-sm opacity-70 ml-1">g</span></p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <ChefHat size={20} className="mr-2 text-green-600" />
                        制作步骤
                      </h4>
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                        {selectedRecipe.steps ? (
                          selectedRecipe.steps.split('\n').map((step, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-xs mt-0.5">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 leading-relaxed">{step}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic text-center py-4">暂无制作步骤</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => handleDeleteRecipe(selectedRecipe.id)}
                        className="flex items-center px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="mr-2" />
                        删除
                      </button>
                      <button
                        onClick={() => handleEditRecipe(selectedRecipe)}
                        className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                      >
                        <Edit size={18} className="mr-2" />
                        编辑
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}