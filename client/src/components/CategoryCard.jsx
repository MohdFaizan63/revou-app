const CategoryCard = ({ category, onClick }) => {
  const getCategoryIcon = (categoryName) => {
    const icons = {
      place: '🏢',
      app: '📱',
      website: '🌐',
      movie: '🎬',
      product: '📦',
      service: '🔧',
      restaurant: '🍽️',
      hospital: '🏥',
      government: '🏛️',
    }
    return icons[categoryName] || '📋'
  }

  const getCategoryColor = (categoryName) => {
    const colors = {
      place: 'bg-blue-50 text-blue-600',
      app: 'bg-green-50 text-green-600',
      website: 'bg-purple-50 text-purple-600',
      movie: 'bg-red-50 text-red-600',
      product: 'bg-orange-50 text-orange-600',
      service: 'bg-indigo-50 text-indigo-600',
      restaurant: 'bg-pink-50 text-pink-600',
      hospital: 'bg-teal-50 text-teal-600',
      government: 'bg-gray-50 text-gray-600',
    }
    return colors[categoryName] || 'bg-gray-50 text-gray-600'
  }

  return (
    <button
      onClick={onClick}
      className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-medium transition-all duration-200 text-center"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${getCategoryColor(category._id)}`}>
          {getCategoryIcon(category._id)}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 capitalize">
            {category._id}
          </h3>
          <p className="text-sm text-gray-500">
            {category.count} entities
          </p>
        </div>
      </div>
    </button>
  )
}

export default CategoryCard
