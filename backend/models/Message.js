const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'appointment_request', 'appointment_confirmation'],
    default: 'text'
  },
  content: {
    text: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    attachments: [{
      url: String,
      filename: String,
      fileType: String,
      fileSize: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  // Message metadata
  metadata: {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    isSystemMessage: {
      type: Boolean,
      default: false
    },
    systemMessageType: {
      type: String,
      enum: ['appointment_created', 'appointment_confirmed', 'appointment_cancelled', 'appointment_completed']
    }
  },
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Message reactions
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Message editing
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  originalContent: String,
  // Message deletion
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Delivery tracking
  deliveryAttempts: [{
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    success: Boolean,
    error: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ recipientId: 1, isRead: 1 });
messageSchema.index({ status: 1, createdAt: -1 });

// Virtual for message age
messageSchema.virtual('ageInMinutes').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60));
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  this.status = 'read';
  return this.save();
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  return this.save();
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    reaction => reaction.userId.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({
    userId,
    emoji,
    createdAt: new Date()
  });
  
  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.userId.toString() !== userId.toString()
  );
  return this.save();
};

// Method to edit message
messageSchema.methods.edit = function(newContent) {
  if (!this.originalContent) {
    this.originalContent = this.content.text;
  }
  this.content.text = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to delete message
messageSchema.methods.deleteMessage = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

// Method to add delivery attempt
messageSchema.methods.addDeliveryAttempt = function(success, error = null) {
  this.deliveryAttempts.push({
    attemptedAt: new Date(),
    success,
    error
  });
  return this.save();
};

// Static method to get conversation messages
messageSchema.statics.getConversationMessages = async function(
  conversationId,
  options = {}
) {
  const {
    page = 1,
    limit = 50,
    before = null,
    after = null
  } = options;

  const filter = {
    conversationId,
    isDeleted: false
  };

  if (before) {
    filter.createdAt = { $lt: new Date(before) };
  }

  if (after) {
    filter.createdAt = { $gt: new Date(after) };
  }

  const skip = (page - 1) * limit;

  const messages = await this.find(filter)
    .populate('senderId', 'name email photo')
    .populate('recipientId', 'name email photo')
    .populate('replyTo', 'content.text senderId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(filter);

  return {
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get unread messages count for user
messageSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipientId: userId,
    isRead: false,
    isDeleted: false
  });
};

// Static method to mark conversation messages as read
messageSchema.statics.markConversationAsRead = async function(conversationId, userId) {
  return await this.updateMany(
    {
      conversationId,
      recipientId: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
        status: 'read'
      }
    }
  );
};

// Static method to get message statistics
messageSchema.statics.getMessageStats = async function(userId, period = 'monthly') {
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

  const stats = await this.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId },
          { recipientId: userId }
        ],
        createdAt: { $gte: startDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        sentMessages: {
          $sum: { $cond: [{ $eq: ['$senderId', userId] }, 1, 0] }
        },
        receivedMessages: {
          $sum: { $cond: [{ $eq: ['$recipientId', userId] }, 1, 0] }
        },
        readMessages: {
          $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] }
        },
        unreadMessages: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalMessages: 0,
    sentMessages: 0,
    receivedMessages: 0,
    readMessages: 0,
    unreadMessages: 0
  };
};

module.exports = mongoose.model('Message', messageSchema);
