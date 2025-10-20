const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Meeting details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Meeting platform
  platform: {
    type: String,
    enum: ['zoom', 'teams', 'google_meet', 'custom'],
    required: true
  },
  // Meeting timing
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 15
  },
  // Meeting links and credentials
  meetingUrl: {
    type: String,
    required: true
  },
  meetingId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    trim: true
  },
  // Meeting status
  status: {
    type: String,
    enum: ['scheduled', 'started', 'ended', 'cancelled', 'failed'],
    default: 'scheduled'
  },
  // Meeting participants
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ['provider', 'patient', 'guest']
    },
    joinedAt: Date,
    leftAt: Date,
    duration: Number // in minutes
  }],
  // Meeting recording
  recording: {
    isRecorded: {
      type: Boolean,
      default: false
    },
    recordingUrl: String,
    recordingId: String,
    duration: Number, // in minutes
    fileSize: Number, // in bytes
    createdAt: Date
  },
  // Meeting chat/messages
  chatMessages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Meeting notes
  notes: {
    providerNotes: String,
    patientNotes: String,
    sharedNotes: String
  },
  // Technical details
  technicalDetails: {
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    },
    connectionIssues: [String],
    platformUsed: String,
    deviceType: String
  },
  // Meeting feedback
  feedback: {
    providerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    patientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    providerComments: String,
    patientComments: String
  },
  // Meeting metadata
  metadata: {
    timezone: String,
    language: String,
    autoRecord: {
      type: Boolean,
      default: false
    },
    waitingRoom: {
      type: Boolean,
      default: true
    },
    muteOnEntry: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
meetingSchema.index({ appointmentId: 1 });
meetingSchema.index({ providerId: 1, scheduledAt: -1 });
meetingSchema.index({ userId: 1, scheduledAt: -1 });
meetingSchema.index({ status: 1, scheduledAt: 1 });
meetingSchema.index({ meetingId: 1 });

// Virtual for meeting duration in hours
meetingSchema.virtual('durationInHours').get(function() {
  return this.duration / 60;
});

// Virtual for meeting status
meetingSchema.virtual('isUpcoming').get(function() {
  return this.scheduledAt > new Date() && this.status === 'scheduled';
});

// Virtual for meeting status
meetingSchema.virtual('isActive').get(function() {
  return this.status === 'started';
});

// Method to start meeting
meetingSchema.methods.startMeeting = function() {
  this.status = 'started';
  return this.save();
};

// Method to end meeting
meetingSchema.methods.endMeeting = function() {
  this.status = 'ended';
  return this.save();
};

// Method to add participant
meetingSchema.methods.addParticipant = function(userId, name, email, role) {
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (existingParticipant) {
    existingParticipant.joinedAt = new Date();
  } else {
    this.participants.push({
      userId,
      name,
      email,
      role,
      joinedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove participant
meetingSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (participant) {
    participant.leftAt = new Date();
    if (participant.joinedAt) {
      const duration = (participant.leftAt.getTime() - participant.joinedAt.getTime()) / (1000 * 60);
      participant.duration = Math.round(duration);
    }
  }
  
  return this.save();
};

// Method to add chat message
meetingSchema.methods.addChatMessage = function(senderId, message) {
  this.chatMessages.push({
    senderId,
    message,
    timestamp: new Date()
  });
  return this.save();
};

// Method to add recording
meetingSchema.methods.addRecording = function(recordingData) {
  this.recording = {
    isRecorded: true,
    ...recordingData,
    createdAt: new Date()
  };
  return this.save();
};

// Method to generate meeting link
meetingSchema.methods.generateMeetingLink = async function() {
  // This would integrate with the actual meeting platform APIs
  // For now, generate a mock link
  const baseUrl = {
    zoom: 'https://zoom.us/j/',
    teams: 'https://teams.microsoft.com/l/meetup-join/',
    google_meet: 'https://meet.google.com/'
  };
  
  this.meetingUrl = `${baseUrl[this.platform]}${this.meetingId}`;
  return await this.save();
};

// Static method to create meeting
meetingSchema.statics.createMeeting = async function(meetingData) {
  const meeting = new this(meetingData);
  await meeting.generateMeetingLink();
  return meeting;
};

// Static method to get provider meetings
meetingSchema.statics.getProviderMeetings = function(providerId, options = {}) {
  const {
    page = 1,
    limit = 20,
    status = null,
    startDate = null,
    endDate = null
  } = options;
  
  const filter = { providerId };
  
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.scheduledAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(filter)
    .populate('appointmentId', 'date time serviceType')
    .populate('userId', 'name email')
    .sort({ scheduledAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get upcoming meetings
meetingSchema.statics.getUpcomingMeetings = function(userId, userRole) {
  const filter = {
    scheduledAt: { $gte: new Date() },
    status: 'scheduled'
  };
  
  if (userRole === 'provider') {
    filter.providerId = userId;
  } else {
    filter.userId = userId;
  }
  
  return this.find(filter)
    .populate('appointmentId', 'date time serviceType')
    .populate(userRole === 'provider' ? 'userId' : 'providerId', 'name email')
    .sort({ scheduledAt: 1 })
    .limit(10);
};

// Static method to get meeting statistics
meetingSchema.statics.getMeetingStats = async function(providerId, period = 'monthly') {
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
        providerId: mongoose.Types.ObjectId(providerId),
        scheduledAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalMeetings: { $sum: 1 },
        completedMeetings: {
          $sum: { $cond: [{ $eq: ['$status', 'ended'] }, 1, 0] }
        },
        cancelledMeetings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        averageDuration: { $avg: '$duration' },
        totalDuration: { $sum: '$duration' }
      }
    }
  ]);
  
  return stats[0] || {
    totalMeetings: 0,
    completedMeetings: 0,
    cancelledMeetings: 0,
    averageDuration: 0,
    totalDuration: 0
  };
};

module.exports = mongoose.model('Meeting', meetingSchema);
