const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect, authorize, requireApproval } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all service providers with filtering and pagination
// @route   GET /api/service-providers
// @access  Public
router.get('/', [
  query('category').optional().trim(),
  query('subcategory').optional().trim(),
  query('location').optional().trim(),
  query('country').optional().trim(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['rating', 'price', 'reviewCount', 'newest']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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
      category,
      subcategory,
      location,
      country,
      minRating = 0,
      maxPrice,
      sortBy = 'rating',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      isApproved: true
    };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = { $regex: subcategory, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (country) filter.country = country;
    if (minRating > 0) filter.rating = { $gte: parseFloat(minRating) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'price':
        sort = { price: 1 };
        break;
      case 'reviewCount':
        sort = { reviewCount: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { rating: -1, reviewCount: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const providers = await ServiceProvider.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email phone');

    const total = await ServiceProvider.countDocuments(filter);

    res.json({
      success: true,
      count: providers.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: providers
    });
  } catch (error) {
    console.error('Get service providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single service provider
// @route   GET /api/service-providers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Get recent reviews
    const reviews = await Review.find({ providerId: req.params.id, isVisible: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...provider.toObject(),
        reviews
      }
    });
  } catch (error) {
    console.error('Get service provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create service provider profile
// @route   POST /api/service-providers
// @access  Private (Provider role required)
router.post('/', protect, authorize('provider'), requireApproval, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('category').isIn(['healthcare', 'restaurants', 'education', 'beauty', 'automotive', 'home']).withMessage('Invalid category'),
  body('subcategory').trim().isLength({ min: 2 }).withMessage('Subcategory is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('country').trim().isLength({ min: 2 }).withMessage('Country is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('priceUnit').trim().isLength({ min: 1 }).withMessage('Price unit is required'),
  body('waitTime').trim().isLength({ min: 1 }).withMessage('Wait time is required'),
  body('bio').trim().isLength({ min: 10 }).withMessage('Bio must be at least 10 characters'),
  body('serviceHours').trim().isLength({ min: 1 }).withMessage('Service hours are required')
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

    // Check if provider profile already exists
    const existingProvider = await ServiceProvider.findOne({ userId: req.user.id });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Service provider profile already exists'
      });
    }

    const providerData = {
      ...req.body,
      userId: req.user.id,
      email: req.user.email
    };

    const provider = await ServiceProvider.create(providerData);

    res.status(201).json({
      success: true,
      message: 'Service provider profile created successfully',
      data: provider
    });
  } catch (error) {
    console.error('Create service provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update service provider profile
// @route   PUT /api/service-providers/:id
// @access  Private (Provider or Admin)
router.put('/:id', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('category').optional().isIn(['healthcare', 'restaurants', 'education', 'beauty', 'automotive', 'home']).withMessage('Invalid category'),
  body('subcategory').optional().trim().isLength({ min: 2 }).withMessage('Subcategory is required'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('country').optional().trim().isLength({ min: 2 }).withMessage('Country is required'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('priceUnit').optional().trim().isLength({ min: 1 }).withMessage('Price unit is required'),
  body('waitTime').optional().trim().isLength({ min: 1 }).withMessage('Wait time is required'),
  body('bio').optional().trim().isLength({ min: 10 }).withMessage('Bio must be at least 10 characters'),
  body('serviceHours').optional().trim().isLength({ min: 1 }).withMessage('Service hours are required')
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

    let provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if user owns the profile or is admin
    if (provider.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Service provider profile updated successfully',
      data: provider
    });
  } catch (error) {
    console.error('Update service provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete service provider profile
// @route   DELETE /api/service-providers/:id
// @access  Private (Provider or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if user owns the profile or is admin
    if (provider.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    await ServiceProvider.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service provider profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete service provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get provider's appointments
// @route   GET /api/service-providers/:id/appointments
// @access  Private (Provider or Admin)
router.get('/:id/appointments', protect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if user owns the profile or is admin
    if (provider.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these appointments'
      });
    }

    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ providerId: req.params.id })
      .populate('userId', 'name email phone')
      .sort({ date: -1, time: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get provider appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
