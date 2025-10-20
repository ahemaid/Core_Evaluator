const express = require('express');
const { body, validationResult, query } = require('express-validator');
const BlogPost = require('../models/BlogPost');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all blog posts with filtering and pagination
// @route   GET /api/blog-posts
// @access  Public
router.get('/', [
  query('status').optional().isIn(['draft', 'published', 'archived']),
  query('category').optional().isIn(['healthcare', 'lifestyle', 'tips', 'news', 'education', 'general']),
  query('featured').optional().isBoolean(),
  query('author').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('language').optional().isIn(['en', 'de', 'ar'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      status = 'published',
      category,
      featured,
      author,
      page = 1,
      limit = 10,
      language = 'ar'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured !== undefined) filter.isFeatured = featured === 'true';
    if (author) filter.author = { $regex: author, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title titleAr titleDe excerpt excerptAr excerptDe author image category tags publishedAt viewCount likeCount slug');

    const total = await BlogPost.countDocuments(filter);

    // Transform posts to include localized content
    const transformedPosts = posts.map(post => ({
      id: post._id,
      title: post.getLocalizedTitle(language),
      excerpt: post.getLocalizedExcerpt(language),
      author: post.author,
      image: post.image,
      category: post.category,
      tags: post.tags,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      slug: post.slug
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: transformedPosts
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured blog posts
// @route   GET /api/blog-posts/featured
// @access  Public
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 20 }),
  query('language').optional().isIn(['en', 'de', 'ar'])
], async (req, res) => {
  try {
    const { limit = 5, language = 'ar' } = req.query;

    const posts = await BlogPost.getFeaturedPosts(language, parseInt(limit));

    // Transform posts to include localized content
    const transformedPosts = posts.map(post => ({
      id: post._id,
      title: post.getLocalizedTitle(language),
      excerpt: post.getLocalizedExcerpt(language),
      author: post.author,
      image: post.image,
      category: post.category,
      tags: post.tags,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      slug: post.slug
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts
    });
  } catch (error) {
    console.error('Get featured blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single blog post
// @route   GET /api/blog-posts/:id
// @access  Public
router.get('/:id', [
  query('language').optional().isIn(['en', 'de', 'ar'])
], async (req, res) => {
  try {
    const { language = 'ar' } = req.query;
    
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    const transformedPost = {
      id: post._id,
      title: post.getLocalizedTitle(language),
      content: post.getLocalizedContent(language),
      excerpt: post.getLocalizedExcerpt(language),
      author: post.author,
      image: post.image,
      category: post.category,
      tags: post.tags,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount + 1, // +1 because we just incremented
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      slug: post.slug,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription
    };

    res.json({
      success: true,
      data: transformedPost
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get blog post by slug
// @route   GET /api/blog-posts/slug/:slug
// @access  Public
router.get('/slug/:slug', [
  query('language').optional().isIn(['en', 'de', 'ar'])
], async (req, res) => {
  try {
    const { language = 'ar' } = req.query;
    
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    const transformedPost = {
      id: post._id,
      title: post.getLocalizedTitle(language),
      content: post.getLocalizedContent(language),
      excerpt: post.getLocalizedExcerpt(language),
      author: post.author,
      image: post.image,
      category: post.category,
      tags: post.tags,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount + 1, // +1 because we just incremented
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      slug: post.slug,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription
    };

    res.json({
      success: true,
      data: transformedPost
    });
  } catch (error) {
    console.error('Get blog post by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create blog post
// @route   POST /api/blog-posts
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('titleAr').trim().isLength({ min: 5, max: 200 }).withMessage('Arabic title must be between 5 and 200 characters'),
  body('titleDe').trim().isLength({ min: 5, max: 200 }).withMessage('German title must be between 5 and 200 characters'),
  body('content').isLength({ min: 50, max: 10000 }).withMessage('Content must be between 50 and 10000 characters'),
  body('contentAr').isLength({ min: 50, max: 10000 }).withMessage('Arabic content must be between 50 and 10000 characters'),
  body('contentDe').isLength({ min: 50, max: 10000 }).withMessage('German content must be between 50 and 10000 characters'),
  body('author').trim().isLength({ min: 2 }).withMessage('Author name is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('category').isIn(['healthcare', 'lifestyle', 'tips', 'news', 'education', 'general']).withMessage('Invalid category'),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('isFeatured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      titleAr,
      titleDe,
      content,
      contentAr,
      contentDe,
      excerpt,
      excerptAr,
      excerptDe,
      author,
      image,
      category,
      tags,
      status = 'draft',
      isFeatured = false,
      seoTitle,
      seoDescription
    } = req.body;

    const postData = {
      title,
      titleAr,
      titleDe,
      content,
      contentAr,
      contentDe,
      excerpt,
      excerptAr,
      excerptDe,
      author,
      authorId: req.user.id,
      image,
      category,
      tags: tags || [],
      status,
      isFeatured,
      seoTitle,
      seoDescription
    };

    // Set published date if status is published
    if (status === 'published') {
      postData.publishedAt = new Date();
    }

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog-posts/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('titleAr').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Arabic title must be between 5 and 200 characters'),
  body('titleDe').optional().trim().isLength({ min: 5, max: 200 }).withMessage('German title must be between 5 and 200 characters'),
  body('content').optional().isLength({ min: 50, max: 10000 }).withMessage('Content must be between 50 and 10000 characters'),
  body('contentAr').optional().isLength({ min: 50, max: 10000 }).withMessage('Arabic content must be between 50 and 10000 characters'),
  body('contentDe').optional().isLength({ min: 50, max: 10000 }).withMessage('German content must be between 50 and 10000 characters'),
  body('author').optional().trim().isLength({ min: 2 }).withMessage('Author name is required'),
  body('image').optional().isURL().withMessage('Valid image URL is required'),
  body('category').optional().isIn(['healthcare', 'lifestyle', 'tips', 'news', 'education', 'general']).withMessage('Invalid category'),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('isFeatured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    let post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Set published date if status is being changed to published
    if (req.body.status === 'published' && post.status !== 'published') {
      req.body.publishedAt = new Date();
    }

    post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog-posts/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Like blog post
// @route   POST /api/blog-posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    post.likeCount += 1;
    await post.save();

    res.json({
      success: true,
      message: 'Blog post liked successfully',
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error('Like blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
