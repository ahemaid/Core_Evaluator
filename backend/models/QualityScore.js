const mongoose = require('mongoose');

const qualityScoreSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Quality metrics
  reviewRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  appointmentCompletionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  responseSpeed: {
    type: Number, // in hours
    default: 0
  },
  complaintRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Calculated Service Quality Index
  sqi: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Additional metrics
  totalAppointments: {
    type: Number,
    default: 0
  },
  completedAppointments: {
    type: Number,
    default: 0
  },
  totalComplaints: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number, // in hours
    default: 0
  },
  // Time period for this score
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
qualityScoreSchema.index({ providerId: 1, period: 1, periodStart: -1 });
qualityScoreSchema.index({ sqi: -1 });
qualityScoreSchema.index({ periodStart: -1, periodEnd: -1 });

// Method to calculate SQI
qualityScoreSchema.methods.calculateSQI = function() {
  // Weighted calculation of Service Quality Index
  const weights = {
    reviewRating: 0.4,      // 40% weight
    completionRate: 0.3,    // 30% weight
    responseSpeed: 0.2,     // 20% weight
    complaintRate: 0.1      // 10% weight (inverse)
  };

  // Normalize review rating (0-5 to 0-100)
  const normalizedReviewRating = (this.reviewRating / 5) * 100;
  
  // Normalize response speed (faster = better, max 24 hours = 0 points)
  const normalizedResponseSpeed = Math.max(0, 100 - (this.responseSpeed / 24) * 100);
  
  // Complaint rate is inverse (lower = better)
  const normalizedComplaintRate = Math.max(0, 100 - this.complaintRate);

  this.sqi = Math.round(
    (normalizedReviewRating * weights.reviewRating) +
    (this.appointmentCompletionRate * weights.completionRate) +
    (normalizedResponseSpeed * weights.responseSpeed) +
    (normalizedComplaintRate * weights.complaintRate)
  );

  return this.sqi;
};

// Static method to get current SQI for a provider
qualityScoreSchema.statics.getCurrentSQI = async function(providerId, period = 'monthly') {
  const now = new Date();
  let periodStart, periodEnd;

  switch (period) {
    case 'daily':
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      const dayOfWeek = now.getDay();
      periodStart = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      periodStart = new Date(now.getFullYear(), quarter * 3, 1);
      periodEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 1);
      break;
    case 'yearly':
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear() + 1, 0, 1);
      break;
  }

  return await this.findOne({
    providerId,
    period,
    periodStart: { $gte: periodStart },
    periodEnd: { $lte: periodEnd },
    isActive: true
  });
};

// Static method to calculate and save SQI
qualityScoreSchema.statics.calculateAndSaveSQI = async function(providerId, period = 'monthly') {
  const Appointment = require('./Appointment');
  const Review = require('./Review');
  const Complaint = require('./Complaint');

  const now = new Date();
  let periodStart, periodEnd;

  // Calculate period dates (same logic as getCurrentSQI)
  switch (period) {
    case 'daily':
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      const dayOfWeek = now.getDay();
      periodStart = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      periodStart = new Date(now.getFullYear(), quarter * 3, 1);
      periodEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 1);
      break;
    case 'yearly':
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear() + 1, 0, 1);
      break;
  }

  // Get appointments in period
  const appointments = await Appointment.find({
    providerId,
    createdAt: { $gte: periodStart, $lt: periodEnd }
  });

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

  // Get average review rating
  const reviews = await Review.find({
    providerId,
    createdAt: { $gte: periodStart, $lt: periodEnd },
    isVisible: true
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Get complaints (if Complaint model exists)
  let complaintRate = 0;
  try {
    const complaints = await Complaint.find({
      providerId,
      createdAt: { $gte: periodStart, $lt: periodEnd }
    });
    complaintRate = totalAppointments > 0 ? (complaints.length / totalAppointments) * 100 : 0;
  } catch (error) {
    // Complaint model might not exist yet
    console.log('Complaint model not found, skipping complaint rate calculation');
  }

  // Calculate average response time (placeholder - would need actual response tracking)
  const averageResponseTime = 2; // Default 2 hours

  // Create or update quality score
  const qualityScore = await this.findOneAndUpdate(
    {
      providerId,
      period,
      periodStart: { $gte: periodStart },
      periodEnd: { $lte: periodEnd }
    },
    {
      providerId,
      userId: providerId, // Assuming provider has userId reference
      reviewRating: averageRating,
      appointmentCompletionRate: completionRate,
      responseSpeed: averageResponseTime,
      complaintRate,
      totalAppointments,
      completedAppointments,
      totalComplaints: 0, // Would be calculated from complaints
      averageResponseTime,
      period,
      periodStart,
      periodEnd
    },
    { upsert: true, new: true }
  );

  // Calculate and save SQI
  qualityScore.calculateSQI();
  await qualityScore.save();

  return qualityScore;
};

module.exports = mongoose.model('QualityScore', qualityScoreSchema);
