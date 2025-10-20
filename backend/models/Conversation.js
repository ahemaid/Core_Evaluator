const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'provider', 'admin'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // Conversation metadata
  type: {
    type: String,
    enum: ['direct', 'appointment', 'support', 'group'],
    default: 'direct'
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Related entities
  relatedEntityType: {
    type: String,
    enum: ['appointment', 'complaint', 'review', 'service']
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Conversation status
  status: {
    type: String,
    enum: ['active', 'archived', 'blocked', 'closed'],
    default: 'active'
  },
  // Last message info
  lastMessage: {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    content: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  },
  // Message counts
  messageCount: {
    type: Number,
    default: 0
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  // Conversation settings
  settings: {
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    allowImageSharing: {
      type: Boolean,
      default: true
    },
    autoDeleteAfter: {
      type: Number, // days
      default: null
    },
    muteNotifications: {
      type: Boolean,
      default: false
    }
  },
  // Moderation
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }],
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Archival
  archivedAt: Date,
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  archiveReason: String
}, {
  timestamps: true
});

// Indexes for efficient querying
conversationSchema.index({ 'participants.userId': 1, status: 1, updatedAt: -1 });
conversationSchema.index({ type: 1, status: 1 });
conversationSchema.index({ relatedEntityType: 1, relatedEntityId: 1 });
conversationSchema.index({ 'lastMessage.sentAt': -1 });
conversationSchema.index({ priority: 1, status: 1 });

// Virtual for conversation age
conversationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to add participant
conversationSchema.methods.addParticipant = function(userId, role) {
  const existingParticipant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({
      userId,
      role,
      joinedAt: new Date(),
      lastReadAt: new Date(),
      isActive: true
    });
  } else {
    existingParticipant.isActive = true;
    existingParticipant.joinedAt = new Date();
  }
  
  return this.save();
};

// Method to remove participant
conversationSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (participant) {
    participant.isActive = false;
  }
  
  return this.save();
};

// Method to update last read time
conversationSchema.methods.updateLastRead = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastReadAt = new Date();
  }
  
  return this.save();
};

// Method to update last message
conversationSchema.methods.updateLastMessage = function(messageId, content, senderId) {
  this.lastMessage = {
    messageId,
    content: content.substring(0, 100), // Truncate for preview
    senderId,
    sentAt: new Date()
  };
  this.messageCount += 1;
  return this.save();
};

// Method to increment unread count
conversationSchema.methods.incrementUnreadCount = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (participant) {
    this.unreadCount += 1;
  }
  
  return this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnreadCount = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  
  if (participant) {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
  }
  
  return this.save();
};

// Method to archive conversation
conversationSchema.methods.archive = function(archivedBy, reason) {
  this.status = 'archived';
  this.archivedAt = new Date();
  this.archivedBy = archivedBy;
  this.archiveReason = reason;
  return this.save();
};

// Method to close conversation
conversationSchema.methods.close = function() {
  this.status = 'closed';
  return this.save();
};

// Method to block conversation
conversationSchema.methods.block = function() {
  this.status = 'blocked';
  return this.save();
};

// Static method to find or create conversation
conversationSchema.statics.findOrCreateConversation = async function(participants, options = {}) {
  const { type = 'direct', title, description, relatedEntityType, relatedEntityId } = options;
  
  // For direct conversations, check if one already exists
  if (type === 'direct' && participants.length === 2) {
    const existingConversation = await this.findOne({
      type: 'direct',
      'participants.userId': { $all: participants.map(p => p.userId) },
      'participants.isActive': true,
      status: 'active'
    });
    
    if (existingConversation) {
      return existingConversation;
    }
  }
  
  // Create new conversation
  const conversation = new this({
    participants: participants.map(p => ({
      userId: p.userId,
      role: p.role,
      joinedAt: new Date(),
      lastReadAt: new Date(),
      isActive: true
    })),
    type,
    title,
    description,
    relatedEntityType,
    relatedEntityId,
    status: 'active'
  });
  
  return await conversation.save();
};

// Static method to get user conversations
conversationSchema.statics.getUserConversations = async function(
  userId,
  options = {}
) {
  const {
    page = 1,
    limit = 20,
    status = 'active',
    type = null,
    unreadOnly = false
  } = options;

  const filter = {
    'participants.userId': userId,
    'participants.isActive': true,
    status
  };

  if (type) {
    filter.type = type;
  }

  if (unreadOnly) {
    filter.unreadCount = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  const conversations = await this.find(filter)
    .populate('participants.userId', 'name email photo role')
    .populate('lastMessage.senderId', 'name email photo')
    .sort({ 'lastMessage.sentAt': -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(filter);

  return {
    conversations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get conversation statistics
conversationSchema.statics.getConversationStats = async function(userId, period = 'monthly') {
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
        'participants.userId': userId,
        'participants.isActive': true,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        activeConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        archivedConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
        },
        totalMessages: { $sum: '$messageCount' },
        totalUnread: { $sum: '$unreadCount' }
      }
    }
  ]);

  return stats[0] || {
    totalConversations: 0,
    activeConversations: 0,
    archivedConversations: 0,
    totalMessages: 0,
    totalUnread: 0
  };
};

module.exports = mongoose.model('Conversation', conversationSchema);
