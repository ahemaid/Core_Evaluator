const mongoose = require('mongoose');

const appointmentNoteSchema = new mongoose.Schema({
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
  // Note content
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  // Note type
  type: {
    type: String,
    enum: ['consultation', 'follow_up', 'prescription', 'diagnosis', 'treatment', 'general'],
    default: 'consultation'
  },
  // Privacy settings
  isPrivate: {
    type: Boolean,
    default: true // Only provider can see by default
  },
  isVisibleToPatient: {
    type: Boolean,
    default: false
  },
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'document', 'prescription', 'lab_report', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }],
  // Note status
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft'
  },
  // Follow-up information
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    notes: String
  },
  // Prescription information (if applicable)
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    instructions: String,
    validUntil: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
appointmentNoteSchema.index({ appointmentId: 1, createdAt: -1 });
appointmentNoteSchema.index({ providerId: 1, createdAt: -1 });
appointmentNoteSchema.index({ userId: 1, isVisibleToPatient: 1 });
appointmentNoteSchema.index({ type: 1, status: 1 });

// Virtual for note age
appointmentNoteSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to make note visible to patient
appointmentNoteSchema.methods.makeVisibleToPatient = function() {
  this.isVisibleToPatient = true;
  return this.save();
};

// Method to add attachment
appointmentNoteSchema.methods.addAttachment = function(attachment) {
  this.attachments.push({
    ...attachment,
    uploadedAt: new Date()
  });
  return this.save();
};

// Method to add prescription
appointmentNoteSchema.methods.addPrescription = function(prescriptionData) {
  this.prescription = {
    ...prescriptionData,
    validUntil: prescriptionData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
  };
  this.type = 'prescription';
  return this.save();
};

// Method to schedule follow-up
appointmentNoteSchema.methods.scheduleFollowUp = function(scheduledDate, notes) {
  this.followUp = {
    required: true,
    scheduledDate,
    notes
  };
  return this.save();
};

// Static method to get notes for appointment
appointmentNoteSchema.statics.getAppointmentNotes = function(appointmentId, userId, userRole) {
  const filter = { appointmentId };
  
  // If user is not the provider, only show notes visible to patient
  if (userRole !== 'provider') {
    filter.isVisibleToPatient = true;
  }
  
  return this.find(filter)
    .populate('providerId', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get provider's notes
appointmentNoteSchema.statics.getProviderNotes = function(providerId, options = {}) {
  const {
    page = 1,
    limit = 20,
    type = null,
    status = null,
    startDate = null,
    endDate = null
  } = options;
  
  const filter = { providerId };
  
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(filter)
    .populate('appointmentId', 'date time serviceType')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('AppointmentNote', appointmentNoteSchema);
