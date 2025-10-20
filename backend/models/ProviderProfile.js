const mongoose = require('mongoose');

const consultationTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video_call', 'chat', 'in_person', 'phone'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 15
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  consultationTypes: [{
    type: String,
    enum: ['video_call', 'chat', 'in_person', 'phone']
  }],
  maxBookings: {
    type: Number,
    default: 1,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  }
});

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Information
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
  // Professional Information
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  subSpecialty: {
    type: String,
    trim: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    certificate: String // URL to certificate file
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  // Location Information
  clinicName: {
    type: String,
    trim: true
  },
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Consultation Types and Pricing
  consultationTypes: [consultationTypeSchema],
  // Availability Management
  availabilitySlots: [availabilitySlotSchema],
  holidays: [holidaySchema],
  // Calendar Integration
  calendarIntegration: {
    googleCalendar: {
      isConnected: { type: Boolean, default: false },
      calendarId: String,
      accessToken: String,
      refreshToken: String,
      lastSync: Date
    },
    outlook: {
      isConnected: { type: Boolean, default: false },
      calendarId: String,
      accessToken: String,
      refreshToken: String,
      lastSync: Date
    }
  },
  // Booking Settings
  bookingSettings: {
    advanceBookingDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365
    },
    cancellationHours: {
      type: Number,
      default: 24,
      min: 1
    },
    autoConfirm: {
      type: Boolean,
      default: false
    },
    bufferTime: {
      type: Number,
      default: 15, // minutes between appointments
      min: 0
    }
  },
  // Online Meeting Settings
  meetingSettings: {
    defaultPlatform: {
      type: String,
      enum: ['zoom', 'teams', 'google_meet', 'custom'],
      default: 'zoom'
    },
    zoomSettings: {
      apiKey: String,
      apiSecret: String,
      accountId: String
    },
    teamsSettings: {
      clientId: String,
      clientSecret: String,
      tenantId: String
    },
    googleMeetSettings: {
      clientId: String,
      clientSecret: String
    }
  },
  // Profile Status
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
  // Media
  profilePhoto: {
    type: String,
    default: ''
  },
  clinicPhotos: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['license', 'certificate', 'insurance', 'cv', 'other']
    },
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
  }],
  // Languages
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      default: 'intermediate'
    }
  }],
  // Social Links
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    facebook: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
providerProfileSchema.index({ userId: 1 });
providerProfileSchema.index({ specialty: 1, isActive: 1, isApproved: 1 });
providerProfileSchema.index({ 'clinicAddress.city': 1, 'clinicAddress.country': 1 });
providerProfileSchema.index({ isVerified: 1, isActive: 1 });

// Virtual for full address
providerProfileSchema.virtual('fullAddress').get(function() {
  const address = this.clinicAddress;
  if (!address) return '';
  
  const parts = [address.street, address.city, address.state, address.country, address.zipCode]
    .filter(part => part && part.trim());
  
  return parts.join(', ');
});

// Method to check if provider is available at specific time
providerProfileSchema.methods.isAvailableAt = function(date, time) {
  const appointmentDate = new Date(date);
  const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if it's a holiday
  const isHoliday = this.holidays.some(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.toDateString() === appointmentDate.toDateString();
  });
  
  if (isHoliday) return false;
  
  // Check availability slots
  const availableSlot = this.availabilitySlots.find(slot => 
    slot.dayOfWeek === dayOfWeek && 
    slot.isActive &&
    time >= slot.startTime && 
    time <= slot.endTime
  );
  
  return !!availableSlot;
};

// Method to get available consultation types for a slot
providerProfileSchema.methods.getAvailableConsultationTypes = function(dayOfWeek, time) {
  const slot = this.availabilitySlots.find(s => 
    s.dayOfWeek === dayOfWeek && 
    s.isActive &&
    time >= s.startTime && 
    time <= s.endTime
  );
  
  if (!slot) return [];
  
  return this.consultationTypes.filter(ct => 
    ct.isActive && 
    slot.consultationTypes.includes(ct.type)
  );
};

// Method to sync with external calendar
providerProfileSchema.methods.syncWithCalendar = async function(platform) {
  // This would integrate with Google Calendar/Outlook API
  // For now, just update the last sync time
  if (platform === 'google' && this.calendarIntegration.googleCalendar.isConnected) {
    this.calendarIntegration.googleCalendar.lastSync = new Date();
  } else if (platform === 'outlook' && this.calendarIntegration.outlook.isConnected) {
    this.calendarIntegration.outlook.lastSync = new Date();
  }
  
  return await this.save();
};

// Static method to find providers by specialty and location
providerProfileSchema.statics.findBySpecialtyAndLocation = function(specialty, city, country) {
  const filter = {
    specialty: { $regex: specialty, $options: 'i' },
    isActive: true,
    isApproved: true
  };
  
  if (city) {
    filter['clinicAddress.city'] = { $regex: city, $options: 'i' };
  }
  
  if (country) {
    filter['clinicAddress.country'] = country;
  }
  
  return this.find(filter).populate('userId', 'name email phone');
};

// Static method to get provider statistics
providerProfileSchema.statics.getProviderStats = async function(providerId) {
  const Appointment = require('./Appointment');
  const Review = require('./Review');
  
  const [appointmentStats, reviewStats] = await Promise.all([
    Appointment.aggregate([
      { $match: { providerId: mongoose.Types.ObjectId(providerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    Review.aggregate([
      { $match: { providerId: mongoose.Types.ObjectId(providerId), isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ])
  ]);
  
  return {
    appointments: appointmentStats,
    reviews: reviewStats[0] || { averageRating: 0, totalReviews: 0 }
  };
};

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
