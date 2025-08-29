import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { X, Upload, Link, Globe, MapPin, Package, Monitor, Film, ShoppingBag, Coffee } from 'lucide-react'
import { createEntity } from '../services/entityService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AddToRevuoModal = ({ isOpen, onClose, initialData = null }) => {
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || 'website',
      subcategory: '',
      website: initialData?.website || '',
      location: '',
      tags: ''
    }
  })

  // Auto-fill form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '')
      setValue('description', initialData.description || '')
      setValue('category', initialData.category || 'website')
      setValue('website', initialData.website || '')
      
      // Auto-fill image if logoUrl is provided
      if (initialData.logoUrl) {
        setImageUrl(initialData.logoUrl)
        setImagePreview(initialData.logoUrl)
      }
    }
  }, [initialData, setValue])

  const selectedCategory = watch('category')

  // Create entity mutation
  const createEntityMutation = useMutation(createEntity, {
    onSuccess: (data) => {
      toast.success('Entity added successfully!')
      queryClient.invalidateQueries(['entities'])
      queryClient.invalidateQueries(['categories'])
      handleClose()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add entity')
    }
  })

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setImageFile(file)
      setImageUrl('')
      
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setImageUrl(url)
    setImageFile(null)
    setImagePreview(url || '')
  }

  // Handle form submission
  const onSubmit = async (data) => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please log in to add entities to Revuo')
      onClose()
      navigate('/login')
      return
    }

    if (!data.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!data.description.trim()) {
      toast.error('Description is required')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('name', data.name.trim())
      formData.append('description', data.description.trim())
      formData.append('category', data.category)
      formData.append('subcategory', data.subcategory.trim())
      formData.append('website', data.website.trim())
      formData.append('location', data.location.trim())
      
      // Add tags
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      formData.append('tags', JSON.stringify(tags))
      
      // Add image
      if (imageFile) {
        formData.append('logo', imageFile)
      } else if (imageUrl) {
        formData.append('logoUrl', imageUrl)
      }
      
      // Debug logging (remove in production)
      // console.log('Form data being sent:', {
      //   name: data.name.trim(),
      //   description: data.description.trim(),
      //   category: data.category,
      //   subcategory: data.subcategory.trim(),
      //   website: data.website.trim(),
      //   location: data.location.trim(),
      //   tags: tags
      // })
      
      await createEntityMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Error creating entity:', error)
      toast.error(error.message || 'Failed to add entity')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    reset()
    setImageFile(null)
    setImageUrl('')
    setImagePreview('')
    onClose()
  }

  // Category options with icons
  const categories = [
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'app', label: 'App', icon: Monitor },
    { value: 'place', label: 'Place', icon: MapPin },
    { value: 'product', label: 'Product', icon: Package },
    { value: 'service', label: 'Service', icon: ShoppingBag },
    { value: 'movie', label: 'Movie', icon: Film },
    { value: 'restaurant', label: 'Restaurant', icon: Coffee }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add to Revuo
            </h2>
            {!user && (
              <p className="text-sm text-red-600 mt-1">
                Please log in to add entities
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Entity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="input w-full"
              placeholder="Enter entity name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <label
                    key={category.value}
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === category.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={category.value}
                      {...register('category')}
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              {...register('subcategory')}
              className="input w-full"
              placeholder="e.g., Social Media, E-commerce, etc."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="input w-full resize-none"
              placeholder="Describe what this entity is about..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Website/Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                {...register('website')}
                className="input w-full"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="input w-full"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              {...register('tags')}
              className="input w-full"
              placeholder="tag1, tag2, tag3 (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add relevant tags to help others find this entity
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo/Image
            </label>
            
            {/* Upload Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* File Upload */}
              <div>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload from device</p>
                    <p className="text-xs text-gray-500">Max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Or import from URL</span>
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  className="input w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('')
                    setImageFile(null)
                    setImageUrl('')
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading || !user}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : !user ? (
                'Login Required'
              ) : (
                'Add to Revuo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddToRevuoModal