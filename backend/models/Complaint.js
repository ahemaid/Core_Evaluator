const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  category: {
    type: String,
    enum: [
      'service_quality',
      'professional_conduct',
      'billing_issues',
      'scheduling_problems',
      'communication_issues',
      'safety_concerns',
      'other'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed', 'escalated'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Admin handling
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    description: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    compensation: {
      type: String,
      enum: ['refund', 'discount', 'free_service', 'apology', 'none']
    },
    compensationAmount: Number
  },
  // Evidence
  attachments: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  // Customer satisfaction with resolution
  resolutionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  resolutionFeedback: String,
  // Auto-escalation
  escalationLevel: {
    type: Number,
    default: 0,
    max: 3
  },
  escalatedAt: Date,
  escalationReason: String
}, {
  timestamps: true
});

// Indexes for efficient querying
complaintSchema.index({ providerId: 1, status: 1, createdAt: -1 });
complaintSchema.index({ userId: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1, createdAt: -1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ category: 1, severity: 1 });

// Virtual for complaint age in days
complaintSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to escalate complaint
complaintSchema.methods.escalate = function(reason) {
  this.escalationLevel += 1;
  this.escalatedAt = new Date();
  this.escalationReason = reason;
  
  // Auto-update priority based on escalation level
  if (this.escalationLevel >= 2) {
    this.priority = 'urgent';
  } else if (this.escalationLevel === 1) {
    this.priority = 'high';
  }
  
  return this.save();
};

// Method to add admin note
complaintSchema.methods.addAdminNote = function(note, adminId) {
  this.adminNotes.push({
    note,
    addedBy: adminId,
    addedAt: new Date()
  });
  return this.save();
};

// Method to resolve complaint
complaintSchema.methods.resolve = function(resolution, adminId) {
  this.status = 'resolved';
  this.resolution = {
    ...resolution,
    resolvedBy: adminId,
    resolvedAt: new Date()
  };
  return this.save();
};

// Static method to get complaint statistics
complaintSchema.statics.getComplaintStats = async function(providerId = null, period = 'monthly') {
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

  if (providerId) {
    matchStage.providerId = providerId;
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalComplaints: { $sum: 1 },
        pendingComplaints: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        resolvedComplaints: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        criticalComplaints: {
          $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
        },
        highPriorityComplaints: {
          $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
        },
        urgentComplaints: {
          $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
        },
        averageResolutionTime: {
          $avg: {
            $cond: [
              { $eq: ['$status', 'resolved'] },
              { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
              null
            ]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    criticalComplaints: 0,
    highPriorityComplaints: 0,
    urgentComplaints: 0,
    averageResolutionTime: 0
  };
};

module.exports = mongoose.model('Complaint', complaintSchema);
