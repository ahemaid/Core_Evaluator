const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('unreadOnly').optional().isBoolean(),
  query('type').optional().trim(),
  query('includeArchived').optional().isBoolean()
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
      page = 1,
      limit = 20,
      unreadOnly = false,
      type,
      includeArchived = false
    } = req.query;

    const result = await Notification.getUserNotifications(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly,
      type,
      includeArchived
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is the recipient
    if (notification.recipientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this notification as read'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipientId: req.user.id,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Archive notification
// @route   PUT /api/notifications/:id/archive
// @access  Private
router.put('/:id/archive', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is the recipient
    if (notification.recipientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to archive this notification'
      });
    }

    await notification.archive();

    res.json({
      success: true,
      message: 'Notification archived successfully'
    });
  } catch (error) {
    console.error('Archive notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create notification (Admin only)
// @route   POST /api/notifications
// @access  Private (Admin only)
router.post('/', authorize('admin'), [
  body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
  body('type').isIn([
    'appointment_confirmed',
    'appointment_cancelled',
    'appointment_reminder',
    'review_received',
    'complaint_filed',
    'complaint_resolved',
    'provider_approved',
    'provider_rejected',
    'system_announcement',
    'reward_earned',
    'message_received',
    'quality_score_update',
    'admin_action_required'
  ]).withMessage('Invalid notification type'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be between 1 and 200 characters'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be between 1 and 1000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('scheduledFor').optional().isISO8601(),
  body('actions').optional().isArray(),
  body('metadata').optional().isObject()
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
      recipientId,
      type,
      title,
      message,
      priority = 'medium',
      scheduledFor = new Date(),
      actions = [],
      metadata = {}
    } = req.body;

    const notification = await Notification.createNotification({
      recipientId,
      senderId: req.user.id,
      type,
      title,
      message,
      priority,
      scheduledFor,
      actions,
      metadata
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send bulk notifications (Admin only)
// @route   POST /api/notifications/bulk
// @access  Private (Admin only)
router.post('/bulk', authorize('admin'), [
  body('notifications').isArray({ min: 1 }).withMessage('At least one notification is required'),
  body('notifications.*.recipientId').isMongoId().withMessage('Valid recipient ID is required'),
  body('notifications.*.type').isIn([
    'appointment_confirmed',
    'appointment_cancelled',
    'appointment_reminder',
    'review_received',
    'complaint_filed',
    'complaint_resolved',
    'provider_approved',
    'provider_rejected',
    'system_announcement',
    'reward_earned',
    'message_received',
    'quality_score_update',
    'admin_action_required'
  ]).withMessage('Invalid notification type'),
  body('notifications.*.title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be between 1 and 200 characters'),
  body('notifications.*.message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be between 1 and 1000 characters')
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

    const { notifications } = req.body;

    // Add sender ID to all notifications
    const notificationsWithSender = notifications.map(notification => ({
      ...notification,
      senderId: req.user.id
    }));

    const results = await Notification.sendBulkNotifications(notificationsWithSender);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Bulk notifications sent: ${successCount} successful, ${failureCount} failed`,
      data: {
        total: notifications.length,
        successful: successCount,
        failed: failureCount,
        results
      }
    });
  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get notification statistics (Admin only)
// @route   GET /api/notifications/stats
// @access  Private (Admin only)
router.get('/stats', authorize('admin'), [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  query('type').optional().trim()
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

    const { period = 'monthly', type } = req.query;

    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const matchStage = {
      createdAt: { $gte: startDate }
    };

    if (type) {
      matchStage.type = type;
    }

    const stats = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: period === 'daily' ? { $dayOfMonth: '$createdAt' } : null,
            type: '$type'
          },
          totalSent: { $sum: 1 },
          totalRead: {
            $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] }
          },
          totalArchived: {
            $sum: { $cond: [{ $eq: ['$isArchived', true] }, 1, 0] }
          },
          emailSent: {
            $sum: { $cond: [{ $eq: ['$channels.email.sent', true] }, 1, 0] }
          },
          pushSent: {
            $sum: { $cond: [{ $eq: ['$channels.push.sent', true] }, 1, 0] }
          },
          smsSent: {
            $sum: { $cond: [{ $eq: ['$channels.sms.sent', true] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cleanup expired notifications (Admin only)
// @route   DELETE /api/notifications/cleanup
// @access  Private (Admin only)
router.delete('/cleanup', authorize('admin'), async (req, res) => {
  try {
    const deletedCount = await Notification.cleanupExpired();

    res.json({
      success: true,
      message: `${deletedCount} expired notifications cleaned up`
    });
  } catch (error) {
    console.error('Cleanup expired notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
