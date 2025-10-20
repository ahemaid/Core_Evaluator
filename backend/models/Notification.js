const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
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
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  // Related entities
  relatedEntityType: {
    type: String,
    enum: ['appointment', 'review', 'complaint', 'provider', 'user', 'system']
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Notification channels
  channels: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    inApp: {
      sent: { type: Boolean, default: true },
      sentAt: { type: Date, default: Date.now }
    }
  },
  // Priority and scheduling
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  // User interaction
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  // Action buttons (for rich notifications)
  actions: [{
    label: String,
    action: String,
    url: String,
    style: {
      type: String,
      enum: ['primary', 'secondary', 'success', 'danger', 'warning'],
      default: 'primary'
    }
  }],
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Expiration
  expiresAt: Date,
  // Retry logic
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  lastRetryAt: Date
}, {
  timestamps: true
});

// Indexes for efficient querying
notificationSchema.index({ recipientId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ isRead: 1, recipientId: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
notificationSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60));
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to archive
notificationSchema.methods.archive = function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

// Method to retry sending
notificationSchema.methods.retry = function() {
  if (this.retryCount < this.maxRetries) {
    this.retryCount += 1;
    this.lastRetryAt = new Date();
    this.status = 'pending';
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const {
    recipientId,
    senderId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    priority = 'medium',
    scheduledFor = new Date(),
    actions = [],
    metadata = {},
    expiresAt
  } = data;

  const notification = new this({
    recipientId,
    senderId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    priority,
    scheduledFor,
    actions,
    metadata,
    expiresAt
  });

  return await notification.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipientId: userId,
    isRead: false,
    isArchived: false,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Static method to get notifications for user
notificationSchema.statics.getUserNotifications = async function(
  userId,
  options = {}
) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
    includeArchived = false
  } = options;

  const filter = {
    recipientId: userId
  };

  if (unreadOnly) {
    filter.isRead = false;
  }

  if (type) {
    filter.type = type;
  }

  if (!includeArchived) {
    filter.isArchived = false;
  }

  const skip = (page - 1) * limit;

  const notifications = await this.find(filter)
    .populate('senderId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(filter);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to send bulk notifications
notificationSchema.statics.sendBulkNotifications = async function(notifications) {
  const results = [];
  
  for (const notificationData of notifications) {
    try {
      const notification = await this.createNotification(notificationData);
      results.push({ success: true, notification });
    } catch (error) {
      results.push({ success: false, error: error.message, data: notificationData });
    }
  }
  
  return results;
};

// Static method to cleanup expired notifications
notificationSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  
  return result.deletedCount;
};

module.exports = mongoose.model('Notification', notificationSchema);
