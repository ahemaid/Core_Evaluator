const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  response: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  photos: [{
    url: String,
    caption: String
  }],
  tags: [{
    type: String,
    enum: ['professional', 'friendly', 'clean', 'affordable', 'quick', 'thorough', 'knowledgeable', 'helpful']
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
reviewSchema.index({ providerId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ appointmentId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVisible: 1, isVerified: 1 });

// Ensure one review per appointment
reviewSchema.index({ appointmentId: 1 }, { unique: true });

// Method to calculate helpful percentage
reviewSchema.methods.getHelpfulPercentage = function() {
  // This would need to be calculated based on total helpful votes
  // For now, return a simple calculation
  return this.helpfulCount > 0 ? Math.min(100, (this.helpfulCount / 10) * 100) : 0;
};

// Static method to get average rating for a provider
reviewSchema.statics.getAverageRating = async function(providerId) {
  const result = await this.aggregate([
    { $match: { providerId: mongoose.Types.ObjectId(providerId), isVisible: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  } : { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);
