const multer = require('multer')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary (only if credentials are provided)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

// Configure storage - use memory storage for now
const storage = multer.memoryStorage()

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Middleware for single file upload
const uploadSingle = upload.single('logo')

// Middleware for multiple file uploads (for posts)
const uploadMultiple = upload.array('media', 10) // Allow up to 10 files

// Wrapper to handle multer errors for single upload
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' })
      }
      return res.status(400).json({ message: 'File upload error' })
    } else if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}

// Wrapper to handle multer errors for multiple uploads
const handleMultipleUpload = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed per file.' })
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Maximum 10 files allowed.' })
      }
      return res.status(400).json({ message: 'File upload error' })
    } else if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}

// Add array method to handleUpload for multiple file uploads
handleUpload.array = (fieldname, maxCount) => {
  const uploadArray = upload.array(fieldname, maxCount)
  return (req, res, next) => {
    uploadArray(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: `Too many files. Maximum ${maxCount} files allowed.` })
        }
        return res.status(400).json({ message: 'File upload error' })
      } else if (err) {
        return res.status(400).json({ message: err.message })
      }
      next()
    })
  }
}

// Middleware for avatar upload
const uploadAvatar = upload.single('avatar')

// Wrapper to handle avatar upload errors
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' })
      }
      return res.status(400).json({ message: 'File upload error' })
    } else if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}

// Helper function to upload image from URL
const uploadFromUrl = async (imageUrl) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('Cloudinary not configured, returning original URL')
      return imageUrl
    }
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'revuo',
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    })
    return result.secure_url
  } catch (error) {
    console.error('Error uploading from URL:', error)
    // Return original URL if upload fails
    return imageUrl
  }
}

// Helper function to upload file buffer to Cloudinary
const uploadBuffer = async (buffer, filename) => {
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid file buffer')
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('Cloudinary not configured, creating data URL')
      // Convert buffer to data URL for local development
      const base64 = buffer.toString('base64')
      const mimeType = 'image/jpeg' // Default mime type
      return `data:${mimeType};base64,${base64}`
    }
    
    // Upload to Cloudinary with promise wrapper
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: 'revuo',
        public_id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      })
      
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Error uploading buffer:', error)
    // Fallback to data URL
    const base64 = buffer.toString('base64')
    const mimeType = 'image/jpeg'
    return `data:${mimeType};base64,${base64}`
  }
}

module.exports = {
  handleUpload,
  handleMultipleUpload,
  handleAvatarUpload,
  uploadFromUrl,
  uploadBuffer,
  cloudinary
}