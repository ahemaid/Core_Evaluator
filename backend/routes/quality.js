const express = require('express');
const { body, validationResult, query } = require('express-validator');
const QualityScore = require('../models/QualityScore');
const ServiceProvider = require('../models/ServiceProvider');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Complaint = require('../models/Complaint');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get quality scores for providers
// @route   GET /api/quality/scores
// @access  Private
router.get('/scores', [
  query('providerId').optional().isMongoId(),
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  query('minSQI').optional().isFloat({ min: 0, max: 100 }),
  query('maxSQI').optional().isFloat({ min: 0, max: 100 }),
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
      providerId,
      period = 'monthly',
      minSQI,
      maxSQI,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = { period, isActive: true };
    if (providerId) filter.providerId = providerId;
    if (minSQI) filter.sqi = { ...filter.sqi, $gte: parseFloat(minSQI) };
    if (maxSQI) filter.sqi = { ...filter.sqi, $lte: parseFloat(maxSQI) };

    // If user is not admin, only show their own provider's scores
    if (req.user.role !== 'admin' && req.user.role === 'provider') {
      const userProvider = await ServiceProvider.findOne({ userId: req.user.id });
      if (userProvider) {
        filter.providerId = userProvider._id;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Provider profile not found'
        });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const qualityScores = await QualityScore.find(filter)
      .populate('providerId', 'name category rating')
      .sort({ sqi: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QualityScore.countDocuments(filter);

    res.json({
      success: true,
      count: qualityScores.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: qualityScores
    });
  } catch (error) {
    console.error('Get quality scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get current SQI for a provider
// @route   GET /api/quality/scores/current/:providerId
// @access  Private
router.get('/scores/current/:providerId', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
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

    const { period = 'monthly' } = req.query;
    const { providerId } = req.params;

    // Check if user has access to this provider's data
    if (req.user.role !== 'admin') {
      const userProvider = await ServiceProvider.findOne({ userId: req.user.id });
      if (!userProvider || userProvider._id.toString() !== providerId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this provider\'s quality scores'
        });
      }
    }

    const currentSQI = await QualityScore.getCurrentSQI(providerId, period);

    if (!currentSQI) {
      return res.status(404).json({
        success: false,
        message: 'No quality score found for the specified period'
      });
    }

    res.json({
      success: true,
      data: currentSQI
    });
  } catch (error) {
    console.error('Get current SQI error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Calculate and save SQI for a provider
// @route   POST /api/quality/scores/calculate/:providerId
// @access  Private (Admin or Provider)
router.post('/scores/calculate/:providerId', [
  body('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
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

    const { period = 'monthly' } = req.body;
    const { providerId } = req.params;

    // Check if user has access to this provider's data
    if (req.user.role !== 'admin') {
      const userProvider = await ServiceProvider.findOne({ userId: req.user.id });
      if (!userProvider || userProvider._id.toString() !== providerId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to calculate quality scores for this provider'
        });
      }
    }

    const qualityScore = await QualityScore.calculateAndSaveSQI(providerId, period);

    res.json({
      success: true,
      message: 'Quality score calculated and saved successfully',
      data: qualityScore
    });
  } catch (error) {
    console.error('Calculate SQI error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get quality analytics
// @route   GET /api/quality/analytics
// @access  Private (Admin only)
router.get('/analytics', authorize('admin'), [
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

    // Quality score distribution
    const qualityDistribution = await QualityScore.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null
          },
          averageSQI: { $avg: '$sqi' },
          minSQI: { $min: '$sqi' },
          maxSQI: { $max: '$sqi' },
          excellentProviders: { $sum: { $cond: [{ $gte: ['$sqi', 90] }, 1, 0] } },
          goodProviders: { $sum: { $cond: [{ $and: [{ $gte: ['$sqi', 70] }, { $lt: ['$sqi', 90] }] }, 1, 0] } },
          averageProviders: { $sum: { $cond: [{ $and: [{ $gte: ['$sqi', 50] }, { $lt: ['$sqi', 70] }] }, 1, 0] } },
          poorProviders: { $sum: { $cond: [{ $lt: ['$sqi', 50] }, 1, 0] } },
          totalProviders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Top performing providers
    const topProviders = await QualityScore.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: '$providerId',
          averageSQI: { $avg: '$sqi' },
          latestSQI: { $last: '$sqi' },
          totalScores: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: '_id',
          foreignField: '_id',
          as: 'provider'
        }
      },
      {
        $unwind: '$provider'
      },
      {
        $sort: { latestSQI: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          providerId: '$_id',
          providerName: '$provider.name',
          providerCategory: '$provider.category',
          averageSQI: 1,
          latestSQI: 1,
          totalScores: 1
        }
      }
    ]);

    // Quality trends by category
    const qualityByCategory = await QualityScore.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: 'providerId',
          foreignField: '_id',
          as: 'provider'
        }
      },
      {
        $unwind: '$provider'
      },
      {
        $group: {
          _id: {
            category: '$provider.category',
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null
          },
          averageSQI: { $avg: '$sqi' },
          providerCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.category': 1, '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Quality metrics breakdown
    const qualityMetrics = await QualityScore.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: null,
          averageReviewRating: { $avg: '$reviewRating' },
          averageCompletionRate: { $avg: '$appointmentCompletionRate' },
          averageResponseSpeed: { $avg: '$responseSpeed' },
          averageComplaintRate: { $avg: '$complaintRate' },
          totalAppointments: { $sum: '$totalAppointments' },
          totalCompletedAppointments: { $sum: '$completedAppointments' },
          totalComplaints: { $sum: '$totalComplaints' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        distribution: qualityDistribution,
        topProviders,
        byCategory: qualityByCategory,
        metrics: qualityMetrics[0] || {
          averageReviewRating: 0,
          averageCompletionRate: 0,
          averageResponseSpeed: 0,
          averageComplaintRate: 0,
          totalAppointments: 0,
          totalCompletedAppointments: 0,
          totalComplaints: 0
        }
      }
    });
  } catch (error) {
    console.error('Get quality analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get quality recommendations for a provider
// @route   GET /api/quality/recommendations/:providerId
// @access  Private (Admin or Provider)
router.get('/recommendations/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    // Check if user has access to this provider's data
    if (req.user.role !== 'admin') {
      const userProvider = await ServiceProvider.findOne({ userId: req.user.id });
      if (!userProvider || userProvider._id.toString() !== providerId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view recommendations for this provider'
        });
      }
    }

    const currentSQI = await QualityScore.getCurrentSQI(providerId, 'monthly');
    if (!currentSQI) {
      return res.status(404).json({
        success: false,
        message: 'No quality score found for this provider'
      });
    }

    const recommendations = [];

    // Review rating recommendations
    if (currentSQI.reviewRating < 4.0) {
      recommendations.push({
        category: 'review_rating',
        priority: 'high',
        title: 'Improve Review Ratings',
        description: 'Your average review rating is below 4.0. Focus on improving service quality and customer satisfaction.',
        currentValue: currentSQI.reviewRating,
        targetValue: 4.5,
        actions: [
          'Follow up with customers after service',
          'Address negative feedback promptly',
          'Implement customer feedback suggestions',
          'Train staff on customer service best practices'
        ]
      });
    }

    // Completion rate recommendations
    if (currentSQI.appointmentCompletionRate < 85) {
      recommendations.push({
        category: 'completion_rate',
        priority: 'high',
        title: 'Improve Appointment Completion Rate',
        description: 'Your appointment completion rate is below 85%. Focus on reducing cancellations and no-shows.',
        currentValue: currentSQI.appointmentCompletionRate,
        targetValue: 90,
        actions: [
          'Send appointment reminders',
          'Implement flexible rescheduling policies',
          'Follow up on missed appointments',
          'Improve appointment booking process'
        ]
      });
    }

    // Response speed recommendations
    if (currentSQI.responseSpeed > 4) {
      recommendations.push({
        category: 'response_speed',
        priority: 'medium',
        title: 'Improve Response Speed',
        description: 'Your average response time is over 4 hours. Faster responses improve customer satisfaction.',
        currentValue: currentSQI.responseSpeed,
        targetValue: 2,
        actions: [
          'Set up automated responses for common inquiries',
          'Implement mobile notifications',
          'Train staff on quick response protocols',
          'Use customer service tools for better organization'
        ]
      });
    }

    // Complaint rate recommendations
    if (currentSQI.complaintRate > 5) {
      recommendations.push({
        category: 'complaint_rate',
        priority: 'high',
        title: 'Reduce Complaint Rate',
        description: 'Your complaint rate is above 5%. Focus on addressing service issues proactively.',
        currentValue: currentSQI.complaintRate,
        targetValue: 2,
        actions: [
          'Implement quality control measures',
          'Train staff on service standards',
          'Address complaints immediately',
          'Conduct regular service audits'
        ]
      });
    }

    // General recommendations based on SQI
    if (currentSQI.sqi < 70) {
      recommendations.push({
        category: 'overall_quality',
        priority: 'high',
        title: 'Overall Quality Improvement Needed',
        description: 'Your Service Quality Index is below 70. Focus on comprehensive quality improvements.',
        currentValue: currentSQI.sqi,
        targetValue: 80,
        actions: [
          'Conduct comprehensive service review',
          'Implement quality management system',
          'Regular staff training and development',
          'Customer feedback integration',
          'Continuous improvement processes'
        ]
      });
    }

    res.json({
      success: true,
      data: {
        currentSQI,
        recommendations,
        summary: {
          totalRecommendations: recommendations.length,
          highPriority: recommendations.filter(r => r.priority === 'high').length,
          mediumPriority: recommendations.filter(r => r.priority === 'medium').length,
          lowPriority: recommendations.filter(r => r.priority === 'low').length
        }
      }
    });
  } catch (error) {
    console.error('Get quality recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get quality benchmarks
// @route   GET /api/quality/benchmarks
// @access  Private (Admin only)
router.get('/benchmarks', authorize('admin'), [
  query('category').optional().trim(),
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
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

    const { category, period = 'monthly' } = req.query;

    // Get overall benchmarks
    const overallBenchmarks = await QualityScore.aggregate([
      { $match: { period, isActive: true } },
      {
        $group: {
          _id: null,
          averageSQI: { $avg: '$sqi' },
          medianSQI: { $median: '$sqi' },
          p25SQI: { $percentile: { input: '$sqi', p: 0.25 } },
          p75SQI: { $percentile: { input: '$sqi', p: 0.75 } },
          p90SQI: { $percentile: { input: '$sqi', p: 0.90 } },
          averageReviewRating: { $avg: '$reviewRating' },
          averageCompletionRate: { $avg: '$appointmentCompletionRate' },
          averageResponseSpeed: { $avg: '$responseSpeed' },
          averageComplaintRate: { $avg: '$complaintRate' }
        }
      }
    ]);

    // Get category-specific benchmarks
    let categoryBenchmarks = [];
    if (category) {
      categoryBenchmarks = await QualityScore.aggregate([
        { $match: { period, isActive: true } },
        {
          $lookup: {
            from: 'serviceproviders',
            localField: 'providerId',
            foreignField: '_id',
            as: 'provider'
          }
        },
        {
          $unwind: '$provider'
        },
        {
          $match: { 'provider.category': category }
        },
        {
          $group: {
            _id: '$provider.category',
            averageSQI: { $avg: '$sqi' },
            medianSQI: { $median: '$sqi' },
            p25SQI: { $percentile: { input: '$sqi', p: 0.25 } },
            p75SQI: { $percentile: { input: '$sqi', p: 0.75 } },
            p90SQI: { $percentile: { input: '$sqi', p: 0.90 } },
            providerCount: { $sum: 1 }
          }
        }
      ]);
    }

    // Get all category benchmarks
    const allCategoryBenchmarks = await QualityScore.aggregate([
      { $match: { period, isActive: true } },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: 'providerId',
          foreignField: '_id',
          as: 'provider'
        }
      },
      {
        $unwind: '$provider'
      },
      {
        $group: {
          _id: '$provider.category',
          averageSQI: { $avg: '$sqi' },
          medianSQI: { $median: '$sqi' },
          providerCount: { $sum: 1 }
        }
      },
      {
        $sort: { averageSQI: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overall: overallBenchmarks[0] || {
          averageSQI: 0,
          medianSQI: 0,
          p25SQI: 0,
          p75SQI: 0,
          p90SQI: 0,
          averageReviewRating: 0,
          averageCompletionRate: 0,
          averageResponseSpeed: 0,
          averageComplaintRate: 0
        },
        category: categoryBenchmarks[0] || null,
        allCategories: allCategoryBenchmarks
      }
    });
  } catch (error) {
    console.error('Get quality benchmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
