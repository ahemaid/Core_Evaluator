const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Who assigned this role
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // When the role was assigned
  assignedAt: {
    type: Date,
    default: Date.now
  },
  // When the role expires (optional)
  expiresAt: {
    type: Date,
    default: null
  },
  // Whether the role is active
  isActive: {
    type: Boolean,
    default: true
  },
  // Role-specific data
  roleData: {
    // Organization/Department
    organization: String,
    department: String,
    // Geographic restrictions
    region: String,
    country: String,
    // Category restrictions (for providers)
    categories: [String],
    // Custom data
    custom: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  // Audit trail
  auditLog: [{
    action: {
      type: String,
      enum: ['assigned', 'activated', 'deactivated', 'expired', 'revoked', 'updated']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    reason: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
userRoleSchema.index({ userId: 1, isActive: 1 });
userRoleSchema.index({ roleId: 1, isActive: 1 });
userRoleSchema.index({ expiresAt: 1 });
userRoleSchema.index({ assignedAt: -1 });

// Virtual for role status
userRoleSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.expiresAt && this.expiresAt < new Date()) return 'expired';
  return 'active';
});

// Virtual for days until expiration
userRoleSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diffTime = this.expiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to activate role
userRoleSchema.methods.activate = function(performedBy, reason = '') {
  this.isActive = true;
  this.auditLog.push({
    action: 'activated',
    performedBy,
    reason,
    performedAt: new Date()
  });
  return this.save();
};

// Method to deactivate role
userRoleSchema.methods.deactivate = function(performedBy, reason = '') {
  this.isActive = false;
  this.auditLog.push({
    action: 'deactivated',
    performedBy,
    reason,
    performedAt: new Date()
  });
  return this.save();
};

// Method to revoke role
userRoleSchema.methods.revoke = function(performedBy, reason = '') {
  this.isActive = false;
  this.auditLog.push({
    action: 'revoked',
    performedBy,
    reason,
    performedAt: new Date()
  });
  return this.save();
};

// Method to extend expiration
userRoleSchema.methods.extendExpiration = function(newExpirationDate, performedBy, reason = '') {
  this.expiresAt = newExpirationDate;
  this.auditLog.push({
    action: 'updated',
    performedBy,
    reason,
    performedAt: new Date(),
    metadata: { newExpirationDate }
  });
  return this.save();
};

// Method to update role data
userRoleSchema.methods.updateRoleData = function(newRoleData, performedBy, reason = '') {
  this.roleData = { ...this.roleData, ...newRoleData };
  this.auditLog.push({
    action: 'updated',
    performedBy,
    reason,
    performedAt: new Date(),
    metadata: { updatedFields: Object.keys(newRoleData) }
  });
  return this.save();
};

// Static method to assign role to user
userRoleSchema.statics.assignRole = async function(userId, roleId, assignedBy, options = {}) {
  const { expiresAt, roleData, reason } = options;
  
  // Check if user already has this role
  const existingRole = await this.findOne({ userId, roleId, isActive: true });
  if (existingRole) {
    throw new Error('User already has this role');
  }
  
  const userRole = new this({
    userId,
    roleId,
    assignedBy,
    expiresAt,
    roleData,
    auditLog: [{
      action: 'assigned',
      performedBy: assignedBy,
      reason,
      performedAt: new Date()
    }]
  });
  
  return await userRole.save();
};

// Static method to get user roles
userRoleSchema.statics.getUserRoles = function(userId, includeInactive = false) {
  const filter = { userId };
  if (!includeInactive) {
    filter.isActive = true;
    filter.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];
  }
  
  return this.find(filter)
    .populate('roleId', 'name displayName description level')
    .populate('assignedBy', 'name email')
    .sort({ assignedAt: -1 });
};

// Static method to get users with role
userRoleSchema.statics.getUsersWithRole = function(roleId, includeInactive = false) {
  const filter = { roleId };
  if (!includeInactive) {
    filter.isActive = true;
    filter.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];
  }
  
  return this.find(filter)
    .populate('userId', 'name email role')
    .populate('assignedBy', 'name email')
    .sort({ assignedAt: -1 });
};

// Static method to check if user has role
userRoleSchema.statics.userHasRole = function(userId, roleName) {
  return this.findOne({
    userId,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).populate('roleId').then(userRole => {
    return userRole && userRole.roleId.name === roleName;
  });
};

// Static method to get expired roles
userRoleSchema.statics.getExpiredRoles = function() {
  return this.find({
    isActive: true,
    expiresAt: { $lt: new Date() }
  }).populate('userId', 'name email').populate('roleId', 'name displayName');
};

// Static method to cleanup expired roles
userRoleSchema.statics.cleanupExpiredRoles = async function() {
  const expiredRoles = await this.getExpiredRoles();
  
  for (const userRole of expiredRoles) {
    userRole.auditLog.push({
      action: 'expired',
      performedBy: null,
      reason: 'Automatic expiration',
      performedAt: new Date()
    });
    userRole.isActive = false;
    await userRole.save();
  }
  
  return expiredRoles.length;
};

// Static method to get role statistics
userRoleSchema.statics.getRoleStatistics = async function() {
  const stats = await this.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $unwind: '$role'
    },
    {
      $group: {
        _id: '$role.name',
        roleName: { $first: '$role.displayName' },
        totalAssignments: { $sum: 1 },
        activeAssignments: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$isActive', true] },
                  {
                    $or: [
                      { $eq: ['$expiresAt', null] },
                      { $gt: ['$expiresAt', new Date()] }
                    ]
                  }
                ]
              },
              1,
              0
            ]
          }
        },
        expiredAssignments: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$isActive', true] },
                  { $lt: ['$expiresAt', new Date()] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { totalAssignments: -1 }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('UserRole', userRoleSchema);
