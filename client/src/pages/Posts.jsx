import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Camera,
  MapPin,
  Tag,
  User,
  Clock,
  Eye,
  Trash2,
  Edit,
  Send,
  X,
  Plus,
  Image as ImageIcon,
  Video,
  Globe,
  Lock
} from 'lucide-react'
import { getPosts, toggleLike, addComment, deletePost, createPost } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

const Posts = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedPost, setSelectedPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch posts
  const { data: postsData, isLoading, error } = useQuery(
    ['posts'],
    () => getPosts({ limit: 20 }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false
    }
  )

  // Like/Unlike mutation
  const likeMutation = useMutation(toggleLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to like post')
    }
  })

  // Comment mutation
  const commentMutation = useMutation(
    ({ postId, content }) => addComment(postId, content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts'])
        setCommentText('')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add comment')
      }
    }
  )

  // Delete post mutation
  const deleteMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      toast.success('Post deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post')
    }
  })

  const handleLike = (postId) => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }
    likeMutation.mutate(postId)
  }

  const handleComment = (postId) => {
    if (!user) {
      toast.error('Please login to comment')
      return
    }
    if (!commentText.trim()) {
      toast.error('Please enter a comment')
      return
    }
    commentMutation.mutate({ postId, content: commentText.trim() })
  }

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId)
    }
  }

  const handleShare = (post) => {
    const shareData = {
      title: `Post by ${post.user?.username || 'Unknown User'}`,
      text: post.content,
      url: `${window.location.origin}/posts/${post._id}`
    }

    // Try to use native Web Share API first
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => {
          toast.success('Post shared successfully!')
        })
        .catch((error) => {
          console.log('Share failed:', error)
          // Fallback to clipboard copy
          copyToClipboard()
        })
    } else {
      // Fallback to clipboard copy
      copyToClipboard()
    }

    function copyToClipboard() {
      const shareUrl = `${window.location.origin}/posts/${post._id}`
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Post link copied to clipboard!')
        })
        .catch(() => {
          toast.error('Failed to copy link')
        })
    }
  }

  const PostCard = ({ post }) => {
    const [showComments, setShowComments] = useState(false)
    const [localComment, setLocalComment] = useState('')

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-4 sm:mb-6 overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user?.username || 'User'}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{post.user?.username || 'Unknown User'}</div>
              <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 sm:space-x-2">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {post.location?.city && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{post.location.city}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Post Actions Menu */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-button">
              <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
            {user && post.user?._id === user._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-3 sm:p-4">
          <p className="text-gray-900 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{post.content}</p>
          
          {/* Entity Link */}
          {post.entity && (
            <Link
              to={`/entity/${post.entity._id}`}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium truncate">{post.entity.name}</span>
            </Link>
          )}

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="mb-3 sm:mb-4">
              {post.media.length === 1 ? (
                <img
                  src={post.media[0]}
                  alt="Post media"
                  className="w-full rounded-xl object-cover max-h-64 sm:max-h-96"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {post.media.slice(0, 4).map((media, index) => (
                    <img
                      key={index}
                      src={media}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-24 sm:h-32 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.likeCount}</span>
              </button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.commentCount}</span>
              </button>
              
              <button 
                onClick={() => handleShare(post)}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{post.viewCount}</span>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* Comment Input */}
              {user && (
                <div className="flex items-center space-x-3 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={localComment}
                      onChange={(e) => setLocalComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          commentMutation.mutate({ postId: post._id, content: localComment })
                          setLocalComment('')
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        commentMutation.mutate({ postId: post._id, content: localComment })
                        setLocalComment('')
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3">
                {post.comments && post.comments.slice(0, 5).map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="font-medium text-sm text-gray-900">
                          {comment.user.username}
                        </div>
                        <div className="text-sm text-gray-700">{comment.content}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {post.comments && post.comments.length > 5 && (
                  <button className="text-sm text-blue-500 hover:text-blue-700">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load posts</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Posts</h1>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-button"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {postsData?.posts?.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500 mb-4">No posts yet</div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 touch-button"
              >
                Create the first post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {postsData?.posts?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

// Create Post Modal Component
const CreatePostModal = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [entityName, setEntityName] = useState('')
  const [tags, setTags] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      toast.success('Post created successfully!')
      handleClose()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('content', content.trim())
      
      if (entityName.trim()) {
        formData.append('entityName', entityName.trim())
      }
      
      if (tags.trim()) {
        formData.append('tags', tags.trim())
      }
      
      mediaFiles.forEach((file, index) => {
        formData.append('media', file)
      })

      await createPostMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Create post error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setContent('')
    setEntityName('')
    setTags('')
    setMediaFiles([])
    onClose()
  }

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + mediaFiles.length > 10) {
      toast.error('Maximum 10 media files allowed')
      return
    }
    setMediaFiles([...mediaFiles, ...files])
  }

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your experience..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-2 text-right">
              {content.length}/1000
            </div>
          </div>

          {/* Entity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Place/Entity (optional)
            </label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g., Starbucks, Netflix, etc."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="coffee, breakfast, goodvibes (comma separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos/Videos (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload media</p>
                <p className="text-sm text-gray-500">Max 10 files</p>
              </label>
            </div>
            
            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Posts