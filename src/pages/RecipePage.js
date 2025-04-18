import { useState, useEffect, useRef } from 'react';
import { Plus, X, Trash2, Edit, Upload } from 'lucide-react';
import { 
    getAllRecipes, 
    addRecipe as addRecipeToDB, 
    updateRecipe as updateRecipeInDB,
    deleteRecipe as deleteRecipeFromDB 
  } from '../services/recipe-service';
  import { uploadImageToS3 } from '../services/s3-service'; 



export default function RecipePage() {
  const [recipes, setRecipes] = useState([]);
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
      image: '/api/placeholder/400/250'
    });
  };

  const handleAddRecipe = () => {
    setIsAddingRecipe(true);
    setIsEditingRecipe(false);
    setShowModal(true);
  };

  // 处理编辑食谱
  const handleEditRecipe = (recipe) => {
    setNewRecipe(recipe);
    setIsEditingRecipe(true);
    setIsAddingRecipe(false);
    setShowModal(true);
    // 阻止事件冒泡，避免触发食谱详情
    // event.stopPropagation();
  };

  // 处理删除食谱
  const handleDeleteRecipe = async (id) => {
    if (window.confirm("确定要删除这个食谱吗？")) {
      try {
        await deleteRecipeFromDB(id);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        if (selectedRecipe && selectedRecipe.id === id) {
          closeModal();
        }
      } catch (err) {
        console.error("Failed to delete recipe:", err);
        alert("删除食谱失败，请稍后再试");
      }
    }
    // 阻止事件冒泡，避免触发食谱详情
    // event.stopPropagation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: name === 'carbs' || name === 'protein' || name === 'fat' ? parseFloat(value) : value
    });
  };

  // 文件选择处理器
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // 创建临时URL以预览图片
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

  // 保存食谱（添加或更新）
  const handleSaveRecipe = async () => {
    try {
      // 确保食谱有一个ID
      const recipeId = newRecipe.id || Date.now().toString();
      let imageKey = newRecipe.imageKey;
      
      // 如果有选择新的图片文件，上传到S3
      if (selectedFile) {
        imageKey = await uploadImageToS3(selectedFile, recipeId);
      }
      
      const { image, ...recipeData } = newRecipe;

      const recipeToSave = {
        ...recipeData,
        id: recipeId,
        imageKey
      };

      console.log("Saving recipe with size:", JSON.stringify(recipeToSave).length, "bytes");

      if (isEditingRecipe) {
        // 更新现有食谱
        const updatedRecipe = await updateRecipeInDB(recipeToSave.id, recipeToSave);
        setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
      } else {
        // 添加新食谱
        const addedRecipe = await addRecipeToDB(recipeToSave);
        setRecipes([...recipes, addedRecipe]);
      }
      setSelectedFile(null);
      closeModal();
    } catch (err) {
      console.error("Failed to save recipe:", err);
      alert("保存食谱失败，请稍后再试");
    }
  };

  // 图片上传UI部分 (替换现有的图片上传部分)
  const renderImageUpload = () => (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">图片</label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current.click()}
      >
        {newRecipe.image !== '/images/default-recipe.jpg' ? (
          <div className="relative">
            <img 
              src={newRecipe.image} 
              alt="Recipe preview" 
              className="max-h-40 mx-auto rounded-md"
            />
            <p className="mt-2 text-sm text-gray-500">点击更换图片</p>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">点击上传食谱图片</p>
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

  // 在表单中替换现有的图片上传部分
  // 将表单中的:
  /*
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">图片</label>
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
      <p className="text-gray-500">点击上传图片（功能尚未实现）</p>
    </div>
  </div>
  */
  // 替换为:
  /*
  {renderImageUpload()}
  */


  // 查看食谱详情
  const viewRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setIsAddingRecipe(false);
    setIsEditingRecipe(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-green-50">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-green-800">我的食谱</h2>
          <button
            onClick={handleAddRecipe}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors duration-300"
          >
            <Plus className="mr-1" size={20} />
            添加食谱
          </button>
        </div>

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

        {/* Empty State */}
        {!isLoading && !error && recipes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">您还没有添加任何食谱</p>
            <button
              onClick={handleAddRecipe}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
            >
              <Plus className="mr-1" size={20} />
              添加第一个食谱
            </button>
          </div>
        )}


        {/* Recipe Grid */}
        {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                viewRecipeDetails(recipe)
              }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-800">{recipe.name}</h3>
                <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm font-semibold mt-2">
                  {recipe.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Big Add Button for Mobile */}
        <div className="fixed bottom-8 right-8 md:hidden">
          <button
            onClick={handleAddRecipe}
            className="bg-green-500 hover:bg-green-600 text-white font-bold h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
          >
            <Plus size={32} />
          </button>
        </div>
      </main>

      {/* Modal for Recipe Details and Adding */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-green-800">
                {isAddingRecipe ? "添加新食谱" : 
                isEditingRecipe ? "编辑菜谱" :
                selectedRecipe.name}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {(isAddingRecipe || isEditingRecipe)? (
                // Add Recipe Form
                <form onSubmit={(e) => { e.preventDefault(); handleSaveRecipe(); }}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">食谱名称</label>
                    <input
                      type="text"
                      name="name"
                      value={newRecipe.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">菜系</label>
                    <input
                      type="text"
                      name="tag"
                      value={newRecipe.tag}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">碳水 (g)</label>
                      <input
                        type="number"
                        name="carbs"
                        value={newRecipe.carbs}
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
                        value={newRecipe.protein}
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
                        value={newRecipe.fat}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">制作步骤</label>
                    <textarea
                      name="steps"
                      value={newRecipe.steps}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                      required
                    />
                  </div>
                  
                  {renderImageUpload()}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                      {isEditingRecipe ? "更新" : "保存"}
                    </button>
                  </div>
                </form>
              ) : (
                // Recipe Details
                <div>
                  <div className="mb-6">
                    <img
                      src={selectedRecipe.image}
                      alt={selectedRecipe.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm font-semibold">
                      {selectedRecipe.tag}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRecipe(selectedRecipe)}
                        className="flex items-center text-green-600 hover:text-green-800"
                      >
                        <Edit size={16} className="mr-1" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(selectedRecipe.id)}
                        className="flex items-center text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} className="mr-1" />
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">碳水</p>
                      <p className="text-xl font-bold text-green-700">{selectedRecipe.carbs}g</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">蛋白质</p>
                      <p className="text-xl font-bold text-green-700">{selectedRecipe.protein}g</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">脂肪</p>
                      <p className="text-xl font-bold text-green-700">{selectedRecipe.fat}g</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">制作步骤</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedRecipe.steps.split('\n').map((step, index) => (
                        <p key={index} className="mb-2">{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}