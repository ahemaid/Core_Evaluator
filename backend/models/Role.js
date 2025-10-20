const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Permissions associated with this role
  permissions: [{
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
      required: true
    },
    // Override conditions for this role
    conditions: {
      ownDataOnly: Boolean,
      sameOrganization: Boolean,
      sameCategory: Boolean,
      custom: mongoose.Schema.Types.Mixed
    },
    // Whether this permission is granted
    granted: {
      type: Boolean,
      default: true
    }
  }],
  // Role hierarchy level
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  // Whether this role is active
  isActive: {
    type: Boolean,
    default: true
  },
  // Whether this role is system-defined (cannot be deleted)
  isSystem: {
    type: Boolean,
    default: false
  },
  // Role metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Role restrictions
  restrictions: {
    // Maximum number of users that can have this role
    maxUsers: {
      type: Number,
      default: null
    },
    // Time-based restrictions
    timeRestrictions: {
      allowedHours: {
        start: String, // HH:MM format
        end: String    // HH:MM format
      },
      allowedDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }]
    },
    // IP restrictions
    ipRestrictions: {
      allowedIPs: [String],
      blockedIPs: [String]
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
roleSchema.index({ name: 1 });
roleSchema.index({ level: 1 });
roleSchema.index({ isActive: 1 });

// Virtual for permission count
roleSchema.virtual('permissionCount').get(function() {
  return this.permissions.filter(p => p.granted).length;
});

// Method to add permission to role
roleSchema.methods.addPermission = function(permissionId, conditions = {}) {
  const existingPermission = this.permissions.find(
    p => p.permissionId.toString() === permissionId.toString()
  );
  
  if (existingPermission) {
    existingPermission.granted = true;
    existingPermission.conditions = { ...existingPermission.conditions, ...conditions };
  } else {
    this.permissions.push({
      permissionId,
      conditions,
      granted: true
    });
  }
  
  return this.save();
};

// Method to remove permission from role
roleSchema.methods.removePermission = function(permissionId) {
  this.permissions = this.permissions.filter(
    p => p.permissionId.toString() !== permissionId.toString()
  );
  return this.save();
};

// Method to check if role has permission
roleSchema.methods.hasPermission = function(permissionId) {
  const permission = this.permissions.find(
    p => p.permissionId.toString() === permissionId.toString()
  );
  return permission && permission.granted;
};

// Method to get all granted permissions
roleSchema.methods.getGrantedPermissions = function() {
  return this.permissions.filter(p => p.granted);
};

// Static method to get role by name
roleSchema.statics.getRoleByName = function(name) {
  return this.findOne({ name, isActive: true });
};

// Static method to get roles by level
roleSchema.statics.getRolesByLevel = function(maxLevel) {
  return this.find({ level: { $lte: maxLevel }, isActive: true }).sort({ level: 1 });
};

// Static method to get system roles
roleSchema.statics.getSystemRoles = function() {
  return this.find({ isSystem: true, isActive: true });
};

// Static method to create default roles
roleSchema.statics.createDefaultRoles = async function() {
  const Permission = require('./Permission');
  
  // Create default permissions if they don't exist
  const defaultPermissions = [
    // User permissions
    { name: 'users:read', description: 'View user profiles', resource: 'users', action: 'read' },
    { name: 'users:update', description: 'Update user profiles', resource: 'users', action: 'update' },
    { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
    
    // Provider permissions
    { name: 'providers:read', description: 'View provider profiles', resource: 'providers', action: 'read' },
    { name: 'providers:create', description: 'Create provider profiles', resource: 'providers', action: 'create' },
    { name: 'providers:update', description: 'Update provider profiles', resource: 'providers', action: 'update' },
    { name: 'providers:approve', description: 'Approve provider applications', resource: 'providers', action: 'approve' },
    
    // Admin permissions
    { name: 'admin_panel:manage', description: 'Access admin panel', resource: 'admin_panel', action: 'manage' },
    { name: 'analytics:read', description: 'View analytics', resource: 'analytics', action: 'read' },
    { name: 'system_settings:manage', description: 'Manage system settings', resource: 'system_settings', action: 'manage' }
  ];
  
  for (const permData of defaultPermissions) {
    await Permission.findOneAndUpdate(
      { name: permData.name },
      permData,
      { upsert: true }
    );
  }
  
  // Create default roles
  const roles = [
    {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access',
      level: 10,
      isSystem: true,
      permissions: await Permission.find({}).then(permissions => 
        permissions.map(p => ({ permissionId: p._id, granted: true }))
      )
    },
    {
      name: 'provider',
      displayName: 'Service Provider',
      description: 'Service provider access',
      level: 5,
      isSystem: true,
      permissions: await Permission.find({
        $or: [
          { resource: 'providers', action: { $in: ['read', 'update'] } },
          { resource: 'appointments', action: { $in: ['read', 'update'] } },
          { resource: 'reviews', action: 'read' }
        ]
      }).then(permissions => 
        permissions.map(p => ({ 
          permissionId: p._id, 
          granted: true,
          conditions: { ownDataOnly: true }
        }))
      )
    },
    {
      name: 'user',
      displayName: 'User',
      description: 'Basic user access',
      level: 1,
      isSystem: true,
      permissions: await Permission.find({
        $or: [
          { resource: 'users', action: { $in: ['read', 'update'] } },
          { resource: 'providers', action: 'read' },
          { resource: 'appointments', action: { $in: ['create', 'read', 'update'] } },
          { resource: 'reviews', action: { $in: ['create', 'read', 'update'] } }
        ]
      }).then(permissions => 
        permissions.map(p => ({ 
          permissionId: p._id, 
          granted: true,
          conditions: { ownDataOnly: true }
        }))
      )
    },
    {
      name: 'evaluator',
      displayName: 'Quality Evaluator',
      description: 'Quality assessment access',
      level: 7,
      isSystem: true,
      permissions: await Permission.find({
        $or: [
          { resource: 'providers', action: 'read' },
          { resource: 'quality_scores', action: { $in: ['read', 'create', 'update'] } },
          { resource: 'reviews', action: { $in: ['read', 'moderate'] } }
        ]
      }).then(permissions => 
        permissions.map(p => ({ permissionId: p._id, granted: true }))
      )
    }
  ];
  
  for (const roleData of roles) {
    await this.findOneAndUpdate(
      { name: roleData.name },
      roleData,
      { upsert: true }
    );
  }
  
  return roles;
};

module.exports = mongoose.model('Role', roleSchema);
