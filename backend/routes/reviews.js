const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const ServiceProvider = require('../models/ServiceProvider');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all reviews with filtering
// @route   GET /api/reviews
// @access  Public
router.get('/', [
  query('providerId').optional().isMongoId(),
  query('userId').optional().isMongoId(),
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
      providerId,
      userId,
      rating,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isVisible: true };

    if (providerId) filter.providerId = providerId;
    if (userId) filter.userId = userId;
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'name')
      .populate('providerId', 'name category subcategory')
      .populate('appointmentId', 'date serviceType')
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

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name')
      .populate('providerId', 'name category subcategory')
      .populate('appointmentId', 'date serviceType');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, authorize('user'), [
  body('providerId').isMongoId().withMessage('Valid provider ID is required'),
  body('appointmentId').isMongoId().withMessage('Valid appointment ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('tags').optional().isArray()
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

    const { providerId, appointmentId, rating, comment, tags } = req.body;

    // Check if appointment exists and belongs to user
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this appointment'
      });
    }

    if (appointment.providerId.toString() !== providerId) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID does not match appointment'
      });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed appointments'
      });
    }

    // Check if review already exists for this appointment
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this appointment'
      });
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      providerId,
      appointmentId,
      rating,
      comment,
      tags: tags || [],
      isVerified: true // Auto-verify for now, could be enhanced with admin approval
    });

    // Update appointment to mark as reviewed
    appointment.hasReview = true;
    await appointment.save();

    // Update provider's rating
    await updateProviderRating(providerId);

    // Populate the review data
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('providerId', 'name category subcategory')
      .populate('appointmentId', 'date serviceType');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('tags').optional().isArray()
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

    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name')
     .populate('providerId', 'name category subcategory')
     .populate('appointmentId', 'date serviceType');

    // Update provider's rating if rating changed
    if (req.body.rating) {
      await updateProviderRating(review.providerId._id);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const providerId = review.providerId;

    await Review.findByIdAndDelete(req.params.id);

    // Update appointment to mark as not reviewed
    await Appointment.findByIdAndUpdate(review.appointmentId, { hasReview: false });

    // Update provider's rating
    await updateProviderRating(providerId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
router.post('/:id/report', protect, [
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason is required')
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

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    const alreadyReported = review.reportedBy.some(
      report => report.userId.toString() === req.user.id
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    // Add report
    review.reportedBy.push({
      userId: req.user.id,
      reason: req.body.reason
    });

    review.reportCount += 1;
    review.isReported = review.reportCount >= 3; // Auto-hide after 3 reports

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to update provider rating
async function updateProviderRating(providerId) {
  try {
    const ratingStats = await Review.getAverageRating(providerId);
    
    await ServiceProvider.findByIdAndUpdate(providerId, {
      rating: ratingStats.averageRating,
      reviewCount: ratingStats.totalReviews
    });
  } catch (error) {
    console.error('Error updating provider rating:', error);
  }
}

module.exports = router;
