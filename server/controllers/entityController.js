const Entity = require('../models/Entity');
const Bookmark = require('../models/Bookmark');
const { uploadFromUrl } = require('../middleware/upload');
const mongoose = require('mongoose');

// @desc    Get all entities with search and filters
// @route   GET /api/entities
// @access  Public
const getEntities = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        entities: [],
        pagination: {
          current: 1,
          pages: 1,
          total: 0,
          hasNext: false,
          hasPrev: false
        },
        trending: []
      });
    }

    const {
      search,
      category,
      sort = 'averageRating',
      order = 'desc',
      page = 1,
      limit = 12,
      minRating,
      location
    } = req.query;

    // Build optimized query
    const query = { isActive: true };

    // Search functionality - use text search for better performance
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Location filter - use case-insensitive regex
    if (location && location.trim()) {
      query['location.city'] = { $regex: location.trim(), $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build optimized sort object
    const sortObj = {};
    
    // Handle sort parameter that might include order (e.g., "viewCount:1", "rating:-1")
    let sortField = sort;
    let sortOrder = order === 'desc' ? -1 : 1;
    
    if (sort && sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortField = field;
      sortOrder = parseInt(order) || 1;
    }
    
    sortObj[sortField] = sortOrder;

    // OPTIMIZED: Execute queries in parallel for better performance
    const [entities, total, trending] = await Promise.all([
      // Main entities query with lean() for better performance
      Entity.find(query)
        .select('name description logo category averageRating totalReviews viewCount tags location website createdAt')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'username avatar')
        .lean(),

      // Count query for pagination
      Entity.countDocuments(query),

      // Trending entities query (cached separately)
      Entity.find({ isActive: true })
        .select('name averageRating totalReviews viewCount logo category')
        .sort({ viewCount: -1, averageRating: -1 })
        .limit(5)
        .lean()
    ]);

    // Add computed fields to entities
    const entitiesWithComputed = entities.map(entity => ({
      ...entity,
      ratingPercentage: entity.totalReviews > 0 ? Math.round((entity.averageRating / 5) * 100) : 0
    }));

    res.json({
      entities: entitiesWithComputed,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      },
      trending
    });
  } catch (error) {
    console.error('Get entities error:', error);
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please try again later.',
        entities: [],
        pagination: {
          current: 1,
          pages: 1,
          total: 0,
          hasNext: false,
          hasPrev: false
        },
        trending: []
      });
    }
    
    res.status(500).json({ message: 'Server error fetching entities' });
  }
};

// @desc    Get single entity
// @route   GET /api/entities/:id
// @access  Public
const getEntity = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('claimedBy', 'username avatar');

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Get reviews for this entity
    const Review = require('../models/Review');
    const Post = require('../models/Post');
    
    const [reviews, posts] = await Promise.all([
      Review.find({ entity: entity._id })
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(10),
      
      Post.find({ entity: entity._id, isPublic: true })
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Add reviews and posts to entity
    const entityWithContent = entity.toObject();
    entityWithContent.reviews = reviews;
    entityWithContent.posts = posts;

    // Increment view count
    await entity.incrementViewCount();

    res.json(entityWithContent);
  } catch (error) {
    console.error('Get entity error:', error);
    res.status(500).json({ message: 'Server error fetching entity' });
  }
};

// @desc    Create entity
// @route   POST /api/entities
// @access  Private
const createEntity = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    // Debug logging (remove in production)
    // console.log('CreateEntity - req.body:', req.body);
    // console.log('CreateEntity - req.file:', req.file);

    const {
      name,
      description,
      category,
      subcategory,
      website,
      location,
      contact,
      socialMedia,
      tags,
      logoUrl
    } = req.body;

    // Check if entity already exists
    const existingEntity = await Entity.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category
    });

    if (existingEntity) {
      return res.status(400).json({ message: 'Entity already exists' });
    }

    // Handle logo upload
    let logo = null;
    
    // If file was uploaded via multer
    if (req.file) {
      // For now, we'll store the file buffer as base64
      // In production, you'd want to upload to Cloudinary or another service
      logo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    // If logo URL was provided
    else if (logoUrl) {
      try {
        logo = await uploadFromUrl(logoUrl);
      } catch (error) {
        console.error('Error uploading logo from URL:', error);
        // Continue without logo if upload fails
        logo = logoUrl;
      }
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          // Try to parse as JSON first (from FormData)
          parsedTags = JSON.parse(tags);
        } catch (e) {
          // If not JSON, split by comma
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    const entity = await Entity.create({
      name,
      description,
      category,
      subcategory,
      website,
      location,
      contact,
      socialMedia,
      logo,
      tags: parsedTags,
      createdBy: req.user._id
    });

    const populatedEntity = await Entity.findById(entity._id)
      .populate('createdBy', 'username avatar');

    res.status(201).json(populatedEntity);
  } catch (error) {
    console.error('Create entity error:', error);
    res.status(500).json({ message: 'Server error creating entity' });
  }
};

// @desc    Update entity
// @route   PUT /api/entities/:id
// @access  Private
const updateEntity = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Check if user is owner or admin/moderator
    if (entity.createdBy.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to update this entity' });
    }

    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username avatar')
     .populate('claimedBy', 'username avatar');

    res.json(updatedEntity);
  } catch (error) {
    console.error('Update entity error:', error);
    res.status(500).json({ message: 'Server error updating entity' });
  }
};

// @desc    Delete entity
// @route   DELETE /api/entities/:id
// @access  Private
const deleteEntity = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Check if user is owner or admin
    if (entity.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this entity' });
    }

    await entity.remove();

    res.json({ message: 'Entity removed' });
  } catch (error) {
    console.error('Delete entity error:', error);
    res.status(500).json({ message: 'Server error deleting entity' });
  }
};

// @desc    Claim entity
// @route   POST /api/entities/:id/claim
// @access  Private
const claimEntity = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    if (entity.claimedBy) {
      return res.status(400).json({ message: 'Entity already claimed' });
    }

    entity.claimedBy = req.user._id;
    entity.claimedAt = new Date();
    await entity.save();

    const populatedEntity = await Entity.findById(entity._id)
      .populate('createdBy', 'username avatar')
      .populate('claimedBy', 'username avatar');

    res.json(populatedEntity);
  } catch (error) {
    console.error('Claim entity error:', error);
    res.status(500).json({ message: 'Server error claiming entity' });
  }
};

// @desc    Get categories
// @route   GET /api/entities/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const categories = await Entity.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// @desc    Toggle bookmark for entity
// @route   POST /api/entities/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const entityId = req.params.id;
    const userId = req.user.id;

    // Check if entity exists
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ user: userId, entity: entityId });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.removeBookmark(userId, entityId);
      res.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await Bookmark.addBookmark(userId, entityId);
      res.json({ bookmarked: true, message: 'Entity bookmarked' });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Server error toggling bookmark' });
  }
};

// @desc    Check if entity is bookmarked by user
// @route   GET /api/entities/:id/bookmark
// @access  Private
const checkBookmark = async (req, res) => {
  try {
    const entityId = req.params.id;
    const userId = req.user.id;

    const isBookmarked = await Bookmark.isBookmarked(userId, entityId);
    res.json({ bookmarked: isBookmarked });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({ message: 'Server error checking bookmark' });
  }
};

// @desc    Instant search for entities (optimized for real-time)
// @route   GET /api/entities/instant
// @access  Public
const instantSearch = async (req, res) => {
  try {
    const { q: query, limit = 8 } = req.query;

    if (!query || query.trim().length < 1) {
      return res.json({ results: [] });
    }

    const searchTerm = query.trim();
    const searchRegex = new RegExp(searchTerm, 'i');
    
    // OPTIMIZED: Use more efficient query with better indexing
    const results = await Entity.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ]
    })
    .select('name description logo category averageRating totalReviews viewCount tags')
    .sort({ 
      // Prioritize exact name matches first
      name: { $regex: new RegExp(`^${searchTerm}`, 'i') } ? 1 : 2,
      // Then by popularity and rating
      viewCount: -1,
      averageRating: -1,
      totalReviews: -1
    })
    .limit(parseInt(limit))
    .lean();

    // Add computed fields
    const resultsWithComputed = results.map(entity => ({
      ...entity,
      ratingPercentage: entity.totalReviews > 0 ? Math.round((entity.averageRating / 5) * 100) : 0
    }));

    res.json({ 
      results: resultsWithComputed,
      query: searchTerm,
      count: resultsWithComputed.length
    });
  } catch (error) {
    console.error('Instant search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

module.exports = {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  claimEntity,
  getCategories,
  toggleBookmark,
  checkBookmark,
  instantSearch
};