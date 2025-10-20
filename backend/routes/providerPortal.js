const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ProviderProfile = require('../models/ProviderProfile');
const Appointment = require('../models/Appointment');
const AppointmentNote = require('../models/AppointmentNote');
const Meeting = require('../models/Meeting');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply provider authentication to all routes
router.use(protect);
router.use(authorize('provider'));

// @desc    Get provider profile
// @route   GET /api/provider-portal/profile
// @access  Private (Provider only)
router.get('/profile', async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get provider profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update provider profile
// @route   PUT /api/provider-portal/profile
// @access  Private (Provider only)
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('specialty').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ min: 10, max: 1000 }),
  body('experience').optional().isInt({ min: 0 }),
  body('clinicName').optional().trim(),
  body('consultationTypes').optional().isArray()
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

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update provider profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update availability slots
// @route   PUT /api/provider-portal/availability
// @access  Private (Provider only)
router.put('/availability', [
  body('availabilitySlots').isArray().withMessage('Availability slots must be an array'),
  body('holidays').optional().isArray()
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

    const { availabilitySlots, holidays } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user.id },
      { 
        availabilitySlots,
        holidays: holidays || []
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get provider appointments
// @route   GET /api/provider-portal/appointments
// @access  Private (Provider only)
router.get('/appointments', [
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
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

    const {
      status,
      page = 1,
      limit = 20,
      startDate,
      endDate
    } = req.query;

    // Get provider profile to get providerId
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Build filter
    const filter = { providerId: profile._id };
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phone')
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
    console.error('Get provider appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Confirm appointment
// @route   PUT /api/provider-portal/appointments/:id/confirm
// @access  Private (Provider only)
router.put('/appointments/:id/confirm', [
  body('message').optional().trim().isLength({ max: 500 })
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

    const { message } = req.body;

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this appointment'
      });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is not in pending status'
      });
    }

    // Update appointment status
    appointment.status = 'confirmed';
    if (message) {
      appointment.notes = message;
    }
    await appointment.save();

    // Send notification to patient
    await Notification.createNotification({
      recipientId: appointment.userId,
      senderId: req.user.id,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment has been confirmed by ${profile.name}.${message ? ` Message: ${message}` : ''}`,
      relatedEntityType: 'appointment',
      relatedEntityId: appointment._id
    });

    res.json({
      success: true,
      message: 'Appointment confirmed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reject appointment
// @route   PUT /api/provider-portal/appointments/:id/reject
// @access  Private (Provider only)
router.put('/appointments/:id/reject', [
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Reason is required and must be between 5 and 500 characters')
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

    const { reason } = req.body;

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this appointment'
      });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is not in pending status'
      });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = 'provider';
    appointment.cancelledAt = new Date();
    await appointment.save();

    // Send notification to patient
    await Notification.createNotification({
      recipientId: appointment.userId,
      senderId: req.user.id,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Your appointment has been cancelled by ${profile.name}. Reason: ${reason}`,
      relatedEntityType: 'appointment',
      relatedEntityId: appointment._id
    });

    res.json({
      success: true,
      message: 'Appointment rejected successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Reject appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reschedule appointment
// @route   PUT /api/provider-portal/appointments/:id/reschedule
// @access  Private (Provider only)
router.put('/appointments/:id/reschedule', [
  body('newDate').isISO8601().withMessage('Valid new date is required'),
  body('newTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid new time is required'),
  body('reason').optional().trim().isLength({ max: 500 })
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

    const { newDate, newTime, reason } = req.body;

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment'
      });
    }

    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be rescheduled in current status'
      });
    }

    // Check if new time is available
    const isAvailable = profile.isAvailableAt(newDate, newTime);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected time is not available'
      });
    }

    // Update appointment
    const oldDate = appointment.date;
    const oldTime = appointment.time;
    
    appointment.date = new Date(newDate);
    appointment.time = newTime;
    appointment.status = 'pending'; // Reset to pending for patient confirmation
    if (reason) {
      appointment.notes = `Rescheduled from ${oldDate} ${oldTime}. Reason: ${reason}`;
    }

    await appointment.save();

    // Send notification to patient
    await Notification.createNotification({
      recipientId: appointment.userId,
      senderId: req.user.id,
      type: 'appointment_confirmed',
      title: 'Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${newDate} at ${newTime}.${reason ? ` Reason: ${reason}` : ''}`,
      relatedEntityType: 'appointment',
      relatedEntityId: appointment._id,
      actions: [
        {
          label: 'Confirm',
          action: 'confirm_reschedule',
          url: `/appointments/${appointment._id}/confirm-reschedule`,
          style: 'primary'
        },
        {
          label: 'Decline',
          action: 'decline_reschedule',
          url: `/appointments/${appointment._id}/decline-reschedule`,
          style: 'secondary'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create appointment note
// @route   POST /api/provider-portal/appointments/:id/notes
// @access  Private (Provider only)
router.post('/appointments/:id/notes', [
  body('title').optional().trim().isLength({ max: 200 }),
  body('content').trim().isLength({ min: 10, max: 5000 }).withMessage('Content is required and must be between 10 and 5000 characters'),
  body('type').optional().isIn(['consultation', 'follow_up', 'prescription', 'diagnosis', 'treatment', 'general']),
  body('isVisibleToPatient').optional().isBoolean(),
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

    const { title, content, type = 'consultation', isVisibleToPatient = false, tags = [] } = req.body;

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this appointment'
      });
    }

    const note = await AppointmentNote.create({
      appointmentId: appointment._id,
      providerId: req.user.id,
      userId: appointment.userId,
      title,
      content,
      type,
      isVisibleToPatient,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    console.error('Create appointment note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get appointment notes
// @route   GET /api/provider-portal/appointments/:id/notes
// @access  Private (Provider only)
router.get('/appointments/:id/notes', async (req, res) => {
  try {
    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view notes for this appointment'
      });
    }

    const notes = await AppointmentNote.getAppointmentNotes(
      appointment._id,
      req.user.id,
      'provider'
    );

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get appointment notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create meeting for appointment
// @route   POST /api/provider-portal/appointments/:id/meeting
// @access  Private (Provider only)
router.post('/appointments/:id/meeting', [
  body('platform').isIn(['zoom', 'teams', 'google_meet', 'custom']).withMessage('Valid platform is required'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 })
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

    const { platform, duration, title, description } = req.body;

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.providerId.toString() !== profile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create meeting for this appointment'
      });
    }

    // Check if meeting already exists
    const existingMeeting = await Meeting.findOne({ appointmentId: appointment._id });
    if (existingMeeting) {
      return res.status(400).json({
        success: false,
        message: 'Meeting already exists for this appointment'
      });
    }

    // Create meeting
    const meeting = await Meeting.createMeeting({
      appointmentId: appointment._id,
      providerId: req.user.id,
      userId: appointment.userId,
      title: title || `Consultation with ${profile.name}`,
      description,
      platform,
      scheduledAt: new Date(`${appointment.date}T${appointment.time}`),
      duration,
      meetingId: `meeting_${appointment._id}_${Date.now()}`,
      password: Math.random().toString(36).substring(2, 8)
    });

    // Send notification to patient
    await Notification.createNotification({
      recipientId: appointment.userId,
      senderId: req.user.id,
      type: 'appointment_confirmed',
      title: 'Meeting Link Generated',
      message: `A ${platform} meeting link has been generated for your appointment.`,
      relatedEntityType: 'appointment',
      relatedEntityId: appointment._id,
      actions: [
        {
          label: 'Join Meeting',
          action: 'join_meeting',
          url: meeting.meetingUrl,
          style: 'primary'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: meeting
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get provider analytics
// @route   GET /api/provider-portal/analytics
// @access  Private (Provider only)
router.get('/analytics', [
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

    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Get appointment statistics
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          providerId: profile._id,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get review statistics
    const reviewStats = await Review.aggregate([
      {
        $match: {
          providerId: profile._id,
          isVisible: true,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Get meeting statistics
    const meetingStats = await Meeting.getMeetingStats(profile._id, period);

    // Calculate performance metrics
    const totalAppointments = appointmentStats.reduce((sum, stat) => sum + stat.count, 0);
    const completedAppointments = appointmentStats.find(stat => stat._id === 'completed')?.count || 0;
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

    const averageRating = reviewStats[0]?.averageRating || 0;
    const totalReviews = reviewStats[0]?.totalReviews || 0;

    res.json({
      success: true,
      data: {
        appointments: {
          total: totalAppointments,
          completed: completedAppointments,
          pending: appointmentStats.find(stat => stat._id === 'pending')?.count || 0,
          cancelled: appointmentStats.find(stat => stat._id === 'cancelled')?.count || 0,
          completionRate: Math.round(completionRate)
        },
        reviews: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution: reviewStats[0]?.ratingDistribution || []
        },
        meetings: meetingStats,
        performance: {
          qualityScore: Math.round((averageRating / 5) * 100),
          responseRate: 95, // This would be calculated based on actual response times
          patientSatisfaction: Math.round(averageRating * 20) // Convert to percentage
        }
      }
    });
  } catch (error) {
    console.error('Get provider analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get provider dashboard overview
// @route   GET /api/provider-portal/dashboard
// @access  Private (Provider only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get provider profile
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Get recent appointments
    const recentAppointments = await Appointment.find({ providerId: profile._id })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      providerId: profile._id,
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: new Date() }
    })
      .populate('userId', 'name email phone')
      .sort({ date: 1, time: 1 })
      .limit(5);

    // Get recent reviews
    const recentReviews = await Review.find({
      providerId: profile._id,
      isVisible: true
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get unread notifications count
    const unreadNotifications = await Notification.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: {
        profile: {
          name: profile.name,
          specialty: profile.specialty,
          rating: profile.rating || 0,
          reviewCount: profile.reviewCount || 0,
          isVerified: profile.isVerified
        },
        recentAppointments,
        upcomingAppointments,
        recentReviews,
        notifications: {
          unreadCount: unreadNotifications
        }
      }
    });
  } catch (error) {
    console.error('Get provider dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
