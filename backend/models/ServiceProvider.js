const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  start: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  end: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
});

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['healthcare', 'restaurants', 'education', 'beauty', 'automotive', 'home']
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    required: true,
    trim: true
  },
  waitTime: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  badges: [{
    type: String,
    trim: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: String,
    enum: [true, false, 'pending', 'rejected'],
    default: 'pending'
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  credentials: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  serviceHours: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  availability: [availabilitySchema],
  documents: [{
    type: {
      type: String,
      enum: ['license', 'certificate', 'insurance', 'other']
    },
    url: String,
    name: String
  }],
  services: [{
    name: String,
    description: String,
    price: Number,
    duration: String
  }]
}, {
  timestamps: true
});

// Index for efficient searching
serviceProviderSchema.index({ category: 1, subcategory: 1 });
serviceProviderSchema.index({ location: 1, country: 1 });
serviceProviderSchema.index({ rating: -1 });
serviceProviderSchema.index({ isActive: 1, isApproved: 1 });

// Virtual for average rating calculation
serviceProviderSchema.virtual('averageRating').get(function() {
  if (this.reviewCount === 0) return 0;
  return this.rating;
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
