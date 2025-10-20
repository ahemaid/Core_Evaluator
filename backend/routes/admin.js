const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const QualityScore = require('../models/QualityScore');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalUsers,
      totalProviders,
      totalAppointments,
      totalReviews,
      pendingProviders,
      pendingComplaints,
      recentUsers,
      recentProviders
    ] = await Promise.all([
      User.countDocuments(),
      ServiceProvider.countDocuments(),
      Appointment.countDocuments(),
      Review.countDocuments(),
      ServiceProvider.countDocuments({ isApproved: 'pending' }),
      Complaint.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      ServiceProvider.find().sort({ createdAt: -1 }).limit(5).select('name email category createdAt')
    ]);

    // Get quality metrics
    const qualityStats = await QualityScore.aggregate([
      {
        $group: {
          _id: null,
          averageSQI: { $avg: '$sqi' },
          highQualityProviders: {
            $sum: { $cond: [{ $gte: ['$sqi', 80] }, 1, 0] }
          },
          lowQualityProviders: {
            $sum: { $cond: [{ $lt: ['$sqi', 60] }, 1, 0] }
          }
        }
      }
    ]);

    // Get monthly growth
    const monthlyGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProviders,
          totalAppointments,
          totalReviews,
          pendingProviders,
          pendingComplaints
        },
        quality: qualityStats[0] || {
          averageSQI: 0,
          highQualityProviders: 0,
          lowQualityProviders: 0
        },
        recent: {
          users: recentUsers,
          providers: recentProviders
        },
        growth: monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', [
  query('role').optional().isIn(['user', 'provider', 'admin', 'evaluator']),
  query('status').optional().isIn(['active', 'inactive', 'pending', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
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
      role,
      status,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) {
      if (status === 'active') filter.isActive = true;
      else if (status === 'inactive') filter.isActive = false;
      else filter.isApproved = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('isActive').optional().isBoolean(),
  body('isApproved').optional().isIn([true, false, 'pending', 'rejected']),
  body('role').optional().isIn(['user', 'provider', 'admin', 'evaluator'])
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

    const { isActive, isApproved, role } = req.body;
    const updateFields = {};

    if (isActive !== undefined) updateFields.isActive = isActive;
    if (isApproved !== undefined) updateFields.isApproved = isApproved;
    if (role !== undefined) updateFields.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notification to user about status change
    await Notification.createNotification({
      recipientId: user._id,
      senderId: req.user.id,
      type: user.isApproved === true ? 'provider_approved' : 'provider_rejected',
      title: 'Account Status Updated',
      message: `Your account status has been updated. Status: ${user.isApproved}`,
      relatedEntityType: 'user',
      relatedEntityId: user._id
    });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all service providers with filtering
// @route   GET /api/admin/providers
// @access  Private (Admin only)
router.get('/providers', [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('category').optional().trim(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
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
      status,
      category,
      minRating,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.isApproved = status;
    if (category) filter.category = category;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const providers = await ServiceProvider.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Approve/reject service provider
// @route   PUT /api/admin/providers/:id/approval
// @access  Private (Admin only)
router.put('/providers/:id/approval', [
  body('isApproved').isIn([true, false, 'pending', 'rejected']).withMessage('Invalid approval status'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
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

    const { isApproved, reason } = req.body;

    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Send notification to provider
    const notificationType = isApproved === true ? 'provider_approved' : 'provider_rejected';
    const message = isApproved === true 
      ? 'Congratulations! Your service provider application has been approved.'
      : `Your service provider application has been rejected.${reason ? ` Reason: ${reason}` : ''}`;

    await Notification.createNotification({
      recipientId: provider.userId._id,
      senderId: req.user.id,
      type: notificationType,
      title: 'Application Status Update',
      message,
      relatedEntityType: 'provider',
      relatedEntityId: provider._id,
      metadata: { reason }
    });

    res.json({
      success: true,
      message: `Provider ${isApproved === true ? 'approved' : 'rejected'} successfully`,
      data: provider
    });
  } catch (error) {
    console.error('Update provider approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
router.get('/reviews', [
  query('status').optional().isIn(['visible', 'hidden', 'reported']),
  query('rating').optional().isInt({ min: 1, max: 5 }),
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
      status,
      rating,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = {};
    if (status === 'visible') filter.isVisible = true;
    else if (status === 'hidden') filter.isVisible = false;
    else if (status === 'reported') filter.isReported = true;
    
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('providerId', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Moderate review
// @route   PUT /api/admin/reviews/:id/moderate
// @access  Private (Admin only)
router.put('/reviews/:id/moderate', [
  body('isVisible').isBoolean().withMessage('isVisible must be a boolean'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
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

    const { isVisible, reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isVisible },
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('providerId', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Send notification to review author
    await Notification.createNotification({
      recipientId: review.userId._id,
      senderId: req.user.id,
      type: 'admin_action_required',
      title: 'Review Moderation',
      message: `Your review has been ${isVisible ? 'approved' : 'hidden'} by an administrator.${reason ? ` Reason: ${reason}` : ''}`,
      relatedEntityType: 'review',
      relatedEntityId: review._id,
      metadata: { reason }
    });

    res.json({
      success: true,
      message: `Review ${isVisible ? 'approved' : 'hidden'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get quality scores and analytics
// @route   GET /api/admin/quality
// @access  Private (Admin only)
router.get('/quality', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  query('minSQI').optional().isFloat({ min: 0, max: 100 }),
  query('maxSQI').optional().isFloat({ min: 0, max: 100 })
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
      period = 'monthly',
      minSQI,
      maxSQI
    } = req.query;

    // Build filter
    const filter = { period, isActive: true };
    if (minSQI) filter.sqi = { ...filter.sqi, $gte: parseFloat(minSQI) };
    if (maxSQI) filter.sqi = { ...filter.sqi, $lte: parseFloat(maxSQI) };

    const qualityScores = await QualityScore.find(filter)
      .populate('providerId', 'name category rating')
      .sort({ sqi: -1 })
      .limit(100);

    // Get quality statistics
    const qualityStats = await QualityScore.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageSQI: { $avg: '$sqi' },
          minSQI: { $min: '$sqi' },
          maxSQI: { $max: '$sqi' },
          excellentProviders: { $sum: { $cond: [{ $gte: ['$sqi', 90] }, 1, 0] } },
          goodProviders: { $sum: { $cond: [{ $and: [{ $gte: ['$sqi', 70] }, { $lt: ['$sqi', 90] }] }, 1, 0] } },
          averageProviders: { $sum: { $cond: [{ $and: [{ $gte: ['$sqi', 50] }, { $lt: ['$sqi', 70] }] }, 1, 0] } },
          poorProviders: { $sum: { $cond: [{ $lt: ['$sqi', 50] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      count: qualityScores.length,
      data: qualityScores,
      statistics: qualityStats[0] || {
        averageSQI: 0,
        minSQI: 0,
        maxSQI: 0,
        excellentProviders: 0,
        goodProviders: 0,
        averageProviders: 0,
        poorProviders: 0
      }
    });
  } catch (error) {
    console.error('Get quality scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get complaints for management
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
router.get('/complaints', [
  query('status').optional().isIn(['pending', 'investigating', 'resolved', 'dismissed', 'escalated']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('category').optional().trim(),
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
      status,
      priority,
      category,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .populate('providerId', 'name category')
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      count: complaints.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Assign complaint to admin
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (Admin only)
router.put('/complaints/:id/assign', [
  body('assignedTo').isMongoId().withMessage('Valid admin ID is required')
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

    const { assignedTo } = req.body;

    // Verify the assigned user is an admin
    const admin = await User.findById(assignedTo);
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be an admin'
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        status: 'investigating'
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('providerId', 'name category')
     .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Send notification to assigned admin
    await Notification.createNotification({
      recipientId: assignedTo,
      senderId: req.user.id,
      type: 'admin_action_required',
      title: 'Complaint Assigned',
      message: `You have been assigned to investigate complaint: ${complaint.title}`,
      relatedEntityType: 'complaint',
      relatedEntityId: complaint._id,
      priority: 'high'
    });

    res.json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
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

    const { period = 'monthly', startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // User registration analytics
    const userAnalytics = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null
          },
          count: { $sum: 1 },
          roles: {
            $push: '$role'
          }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Appointment analytics
    const appointmentAnalytics = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null,
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Review analytics
    const reviewAnalytics = await Review.aggregate([
      { $match: { ...dateFilter, isVisible: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null,
            rating: '$rating'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Quality score trends
    const qualityTrends = await QualityScore.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null
          },
          averageSQI: { $avg: '$sqi' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        users: userAnalytics,
        appointments: appointmentAnalytics,
        reviews: reviewAnalytics,
        quality: qualityTrends
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
