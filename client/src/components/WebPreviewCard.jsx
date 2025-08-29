import React from 'react'
import { ExternalLink, Plus } from 'lucide-react'

const WebPreviewCard = ({ data, onAddToRevuo }) => {
  const handleAddToRevuo = () => {
    if (onAddToRevuo) {
      onAddToRevuo({
        title: data.title,
        description: data.description,
        url: data.url,
        imageUrl: data.imageUrl
      })
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-start space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {data.title}
          </h3>
          {data.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {data.description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddToRevuo}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Revuo</span>
            </button>
            
            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebPreviewCard