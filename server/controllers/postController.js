const Post = require('../models/Post');
const Entity = require('../models/Entity');
const { uploadFromUrl, uploadBuffer } = require('../middleware/upload');
const mongoose = require('mongoose');

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user: userId,
      entity: entityId,
      tag
    } = req.query;

    const query = { isPublic: true, user: { $exists: true, $ne: null } };

    // Filter by user if specified
    if (userId) {
      query.user = userId;
    }

    // Filter by entity if specified
    if (entityId) {
      query.entity = entityId;
    }

    // Filter by tag if specified
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'username avatar')
        .populate('entity', 'name logo category')
        .populate('likes.user', 'username avatar')
        .populate('comments.user', 'username avatar')
        .lean(),

      Post.countDocuments(query)
    ]);

    // Add computed fields
    const postsWithComputed = posts.map(post => ({
      ...post,
      isLiked: req.user ? post.likes.some(like => like.user && like.user._id && like.user._id.toString() === req.user._id.toString()) : false,
      likeCount: post.likes.length,
      commentCount: post.comments.length
    }));

    res.json({
      posts: postsWithComputed,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('entity', 'name logo category')
      .populate('likes.user', 'username avatar')
      .populate('comments.user', 'username avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    await post.incrementViewCount();

    // Add computed fields
    const postWithComputed = {
      ...post.toObject(),
      isLiked: req.user ? post.likes.some(like => like.user && like.user._id && like.user._id.toString() === req.user._id.toString()) : false,
      likeCount: post.likes.length,
      commentCount: post.comments.length
    };

    res.json(postWithComputed);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error fetching post' });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const {
      content,
      entityName,
      entityId,
      tags,
      location,
      isPublic = true
    } = req.body;

    // Handle media uploads
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      // Handle multiple file uploads
      for (const file of req.files) {
        try {
          let mediaUrl;
          if (file.buffer) {
            // Handle file buffer upload
            mediaUrl = await uploadBuffer(file.buffer, file.originalname);
          } else if (file.path) {
            // Handle file path upload
            mediaUrl = await uploadFromUrl(file.path);
          } else {
            console.error('No file buffer or path found');
            continue;
          }
          mediaUrls.push(mediaUrl);
        } catch (error) {
          console.error('Media upload error:', error);
        }
      }
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Extract entity mentions from content and tags
    const entityMentions = [...parsedTags, entityName].filter(Boolean);
    
    // Try to find existing entity or create new one
    let linkedEntity = null;
    if (entityId) {
      linkedEntity = await Entity.findById(entityId);
    } else if (entityName) {
      // Search for existing entity
      linkedEntity = await Entity.findOne({
        name: { $regex: new RegExp(`^${entityName}$`, 'i') }
      });

      // If not found, create new entity
      if (!linkedEntity) {
        linkedEntity = await Entity.create({
          name: entityName,
          description: `Created from post about ${entityName}`,
          category: 'place', // Default category
          createdBy: req.user._id
        });
      }
    }

    // Handle location data
    let processedLocation = null;
    if (location && location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      processedLocation = {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address,
        city: location.city,
        country: location.country
      };
    }

    const postData = {
      user: req.user._id,
      content,
      media: mediaUrls,
      entity: linkedEntity?._id,
      entityName: linkedEntity?.name || entityName,
      tags: parsedTags,
      isPublic
    };

    // Only add location if it's properly formatted
    if (processedLocation) {
      postData.location = processedLocation;
    }

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username avatar')
      .populate('entity', 'name logo category');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('user', 'username avatar')
    .populate('entity', 'name logo category');

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error updating post' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.remove();

    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.some(like => like.user.toString() === req.user._id.toString());

    if (isLiked) {
      await post.removeLike(req.user._id);
      res.json({ liked: false, message: 'Post unliked' });
    } else {
      await post.addLike(req.user._id);
      res.json({ liked: true, message: 'Post liked' });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error toggling like' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.addComment(req.user._id, content.trim());

    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('entity', 'name logo category')
      .populate('likes.user', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.json(updatedPost);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { userId } = req.params;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { user: userId, isPublic: true, user: { $exists: true, $ne: null } };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'username avatar')
        .populate('entity', 'name logo category')
        .populate('likes.user', 'username avatar')
        .populate('comments.user', 'username avatar')
        .lean(),

      Post.countDocuments(query)
    ]);

    // Add computed fields
    const postsWithComputed = posts.map(post => ({
      ...post,
      isLiked: req.user ? post.likes.some(like => like.user && like.user._id && like.user._id.toString() === req.user._id.toString()) : false,
      likeCount: post.likes.length,
      commentCount: post.comments.length
    }));

    res.json({
      posts: postsWithComputed,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error fetching user posts' });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
};