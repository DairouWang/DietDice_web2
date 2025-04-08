import { useState } from 'react';
import { Plus, X } from 'lucide-react';

// Sample initial recipe data
const initialRecipes = [
  {
    id: 1,
    name: '清蒸鲈鱼',
    tag: '粤菜',
    carbs: 5,
    protein: 22,
    fat: 3,
    steps: '1. 鲈鱼洗净，在鱼身上划几刀\n2. 放入姜丝和葱段\n3. 蒸锅中蒸8-10分钟\n4. 取出后淋上酱油和热油',
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    name: '西兰花炒牛肉',
    tag: '家常菜',
    carbs: 12,
    protein: 18,
    fat: 8,
    steps: '1. 牛肉切片，用料酒和淀粉腌制\n2. 西兰花切小朵，焯水\n3. 热锅热油，爆香蒜末\n4. 放入牛肉快速翻炒\n5. 加入西兰花，翻炒均匀',
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    name: '番茄鸡蛋面',
    tag: '面食',
    carbs: 45,
    protein: 15,
    fat: 7,
    steps: '1. 番茄切块，鸡蛋打散\n2. 热锅倒油，炒散鸡蛋\n3. 放入番茄翻炒出汁\n4. 加水煮沸后放入面条\n5. 面条煮熟后调味即可',
    image: '/api/placeholder/400/250'
  }
];

export default function RecipePage() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    tag: '',
    carbs: 0,
    protein: 0,
    fat: 0,
    steps: '',
    image: '/api/placeholder/400/250'
  });

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    setIsAddingRecipe(false);
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
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: name === 'carbs' || name === 'protein' || name === 'fat' ? parseFloat(value) : value
    });
  };

  const handleSaveRecipe = () => {
    const recipeToAdd = {
      ...newRecipe,
      id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1
    };
    setRecipes([...recipes, recipeToAdd]);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">DietDice</h1>
        </div>
      </header>

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

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                setSelectedRecipe(recipe);
                setShowModal(true);
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
                {isAddingRecipe ? "添加新食谱" : selectedRecipe.name}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {isAddingRecipe ? (
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
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">图片</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <p className="text-gray-500">点击上传图片（功能尚未实现）</p>
                    </div>
                  </div>
                  
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
                      保存
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
                  
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-sm font-semibold">
                      {selectedRecipe.tag}
                    </span>
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