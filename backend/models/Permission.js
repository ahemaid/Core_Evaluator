const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'users',
      'providers',
      'appointments',
      'reviews',
      'complaints',
      'notifications',
      'messages',
      'quality_scores',
      'analytics',
      'admin_panel',
      'blog_posts',
      'categories',
      'system_settings'
    ]
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'approve',
      'reject',
      'moderate',
      'assign',
      'export',
      'import',
      'manage'
    ]
  },
  // Conditions for permission (optional)
  conditions: {
    // Can only access own data
    ownDataOnly: {
      type: Boolean,
      default: false
    },
    // Can access data from same organization/region
    sameOrganization: {
      type: Boolean,
      default: false
    },
    // Can access data from same category
    sameCategory: {
      type: Boolean,
      default: false
    },
    // Custom conditions (JSON)
    custom: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  // Permission level (for hierarchical permissions)
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  // Whether this permission is active
  isActive: {
    type: Boolean,
    default: true
  },
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ name: 1 });
permissionSchema.index({ isActive: 1 });

// Virtual for full permission string
permissionSchema.virtual('fullPermission').get(function() {
  return `${this.resource}:${this.action}`;
});

// Static method to get all permissions for a resource
permissionSchema.statics.getResourcePermissions = function(resource) {
  return this.find({ resource, isActive: true }).sort({ level: 1 });
};

// Static method to check if permission exists
permissionSchema.statics.hasPermission = function(resource, action) {
  return this.findOne({ resource, action, isActive: true });
};

// Static method to get permissions by level
permissionSchema.statics.getPermissionsByLevel = function(maxLevel) {
  return this.find({ level: { $lte: maxLevel }, isActive: true });
};

module.exports = mongoose.model('Permission', permissionSchema);
