const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Appointment = require('../models/Appointment');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all appointments with filtering
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, [
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']),
  query('providerId').optional().isMongoId(),
  query('userId').optional().isMongoId(),
  query('date').optional().isISO8601(),
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
      providerId,
      userId,
      date,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    // Admin can see all appointments, others can only see their own
    if (req.user.role !== 'admin') {
      if (req.user.role === 'provider') {
        // Provider can see their own appointments
        const provider = await ServiceProvider.findOne({ userId: req.user.id });
        if (provider) {
          filter.providerId = provider._id;
        } else {
          return res.json({
            success: true,
            count: 0,
            total: 0,
            data: []
          });
        }
      } else {
        // Regular users can only see their own appointments
        filter.userId = req.user.id;
      }
    } else {
      // Admin can filter by any criteria
      if (providerId) filter.providerId = providerId;
      if (userId) filter.userId = userId;
    }

    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name category subcategory location')
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      count: appointments.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name category subcategory location phone email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.userId._id.toString() === req.user.id ||
      (req.user.role === 'provider' && appointment.providerId.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, authorize('user'), [
  body('providerId').isMongoId().withMessage('Valid provider ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required (HH:MM)'),
  body('serviceType').trim().isLength({ min: 2 }).withMessage('Service type is required'),
  body('notes').optional().trim()
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

    const { providerId, date, time, serviceType, notes } = req.body;

    // Check if provider exists and is active
    const provider = await ServiceProvider.findById(providerId);
    if (!provider || !provider.isActive || provider.isApproved !== true) {
      return res.status(400).json({
        success: false,
        message: 'Service provider not available'
      });
    }

    // Check if appointment date is in the future
    const appointmentDate = new Date(date);
    const now = new Date();
    if (appointmentDate <= now) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      providerId,
      date: appointmentDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Calculate total amount (could be enhanced with dynamic pricing)
    const totalAmount = provider.price;

    const appointment = await Appointment.create({
      userId: req.user.id,
      providerId,
      date: appointmentDate,
      time,
      serviceType,
      notes,
      totalAmount
    });

    // Populate the appointment data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email phone')
      .populate('providerId', 'name category subcategory location phone email');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
router.put('/:id', protect, [
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required (HH:MM)'),
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']).withMessage('Invalid status'),
  body('notes').optional().trim(),
  body('cancellationReason').optional().trim()
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

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to update this appointment
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.userId.toString() === req.user.id ||
      (req.user.role === 'provider' && appointment.providerId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Handle status changes
    if (req.body.status) {
      if (req.body.status === 'cancelled') {
        req.body.cancelledAt = new Date();
        req.body.cancelledBy = req.user.role;
      }
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone')
     .populate('providerId', 'name category subcategory location phone email');

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user can cancel this appointment
    const canCancel = 
      req.user.role === 'admin' ||
      appointment.userId.toString() === req.user.id ||
      (req.user.role === 'provider' && appointment.providerId.toString() === req.user.id);

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled (less than 24 hours notice)'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = req.user.role;
    appointment.cancellationReason = req.body.reason || 'Cancelled by user';

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
