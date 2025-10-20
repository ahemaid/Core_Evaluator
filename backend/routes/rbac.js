const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { hasRole, hasPermission } = require('../middleware/rbac');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Initialize default roles and permissions
// @route   POST /api/rbac/initialize
// @access  Private (Admin only)
router.post('/initialize', async (req, res) => {
  try {
    const roles = await Role.createDefaultRoles();
    
    res.json({
      success: true,
      message: 'Default roles and permissions initialized successfully',
      data: {
        roles: roles.length,
        permissions: await Permission.countDocuments()
      }
    });
  } catch (error) {
    console.error('Initialize RBAC error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all permissions
// @route   GET /api/rbac/permissions
// @access  Private (Admin only)
router.get('/permissions', [
  query('resource').optional().trim(),
  query('action').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      resource,
      action,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (resource) filter.resource = resource;
    if (action) filter.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const permissions = await Permission.find(filter)
      .sort({ resource: 1, action: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Permission.countDocuments(filter);

    res.json({
      success: true,
      count: permissions.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: permissions
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new permission
// @route   POST /api/rbac/permissions
// @access  Private (Admin only)
router.post('/permissions', [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description').trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('resource').isIn([
    'users', 'providers', 'appointments', 'reviews', 'complaints',
    'notifications', 'messages', 'quality_scores', 'analytics',
    'admin_panel', 'blog_posts', 'categories', 'system_settings'
  ]).withMessage('Invalid resource'),
  body('action').isIn([
    'create', 'read', 'update', 'delete', 'approve', 'reject',
    'moderate', 'assign', 'export', 'import', 'manage'
  ]).withMessage('Invalid action'),
  body('level').optional().isInt({ min: 1, max: 10 }).withMessage('Level must be between 1 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, description, resource, action, level = 1, conditions, metadata } = req.body;

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: 'Permission with this name already exists'
      });
    }

    const permission = await Permission.create({
      name,
      description,
      resource,
      action,
      level,
      conditions,
      metadata
    });

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission
    });
  } catch (error) {
    console.error('Create permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all roles
// @route   GET /api/rbac/roles
// @access  Private (Admin only)
router.get('/roles', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const roles = await Role.find({ isActive: true })
      .populate('permissions.permissionId', 'name description resource action')
      .sort({ level: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Role.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: roles.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new role
// @route   POST /api/rbac/roles
// @access  Private (Admin only)
router.post('/roles', [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('displayName').trim().isLength({ min: 3 }).withMessage('Display name must be at least 3 characters'),
  body('description').trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('level').isInt({ min: 1, max: 10 }).withMessage('Level must be between 1 and 10'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, displayName, description, level, permissions = [], metadata, restrictions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Validate permissions
    const validPermissions = [];
    for (const perm of permissions) {
      const permission = await Permission.findById(perm.permissionId);
      if (permission) {
        validPermissions.push(perm);
      }
    }

    const role = await Role.create({
      name,
      displayName,
      description,
      level,
      permissions: validPermissions,
      metadata,
      restrictions
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update role
// @route   PUT /api/rbac/roles/:id
// @access  Private (Admin only)
router.put('/roles/:id', [
  body('displayName').optional().trim().isLength({ min: 3 }),
  body('description').optional().trim().isLength({ min: 5 }),
  body('level').optional().isInt({ min: 1, max: 10 }),
  body('permissions').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role is system role
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify system roles'
      });
    }

    const { displayName, description, level, permissions, metadata, restrictions } = req.body;

    // Update role
    if (displayName) role.displayName = displayName;
    if (description) role.description = description;
    if (level) role.level = level;
    if (metadata) role.metadata = metadata;
    if (restrictions) role.restrictions = restrictions;

    // Update permissions if provided
    if (permissions) {
      const validPermissions = [];
      for (const perm of permissions) {
        const permission = await Permission.findById(perm.permissionId);
        if (permission) {
          validPermissions.push(perm);
        }
      }
      role.permissions = validPermissions;
    }

    await role.save();

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete role
// @route   DELETE /api/rbac/roles/:id
// @access  Private (Admin only)
router.delete('/roles/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role is system role
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete system roles'
      });
    }

    // Check if role is assigned to any users
    const userCount = await UserRole.countDocuments({ roleId: role._id, isActive: true });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. It is assigned to ${userCount} users.`
      });
    }

    await Role.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Assign role to user
// @route   POST /api/rbac/users/:userId/roles
// @access  Private (Admin only)
router.post('/users/:userId/roles', [
  body('roleId').isMongoId().withMessage('Valid role ID is required'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiration date'),
  body('roleData').optional().isObject().withMessage('Role data must be an object'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { roleId, expiresAt, roleData, reason } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Assign role to user
    const userRole = await UserRole.assignRole(userId, roleId, req.user.id, {
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      roleData,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Role assigned successfully',
      data: userRole
    });
  } catch (error) {
    console.error('Assign role error:', error);
    if (error.message === 'User already has this role') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user roles
// @route   GET /api/rbac/users/:userId/roles
// @access  Private (Admin only)
router.get('/users/:userId/roles', async (req, res) => {
  try {
    const { userId } = req.params;
    const { includeInactive = false } = req.query;

    const userRoles = await UserRole.getUserRoles(userId, includeInactive === 'true');

    res.json({
      success: true,
      count: userRoles.length,
      data: userRoles
    });
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Revoke role from user
// @route   DELETE /api/rbac/users/:userId/roles/:roleId
// @access  Private (Admin only)
router.delete('/users/:userId/roles/:roleId', [
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId, roleId } = req.params;
    const { reason } = req.body;

    const userRole = await UserRole.findOne({ userId, roleId, isActive: true });
    if (!userRole) {
      return res.status(404).json({
        success: false,
        message: 'User role not found'
      });
    }

    await userRole.revoke(req.user.id, reason);

    res.json({
      success: true,
      message: 'Role revoked successfully'
    });
  } catch (error) {
    console.error('Revoke role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get role statistics
// @route   GET /api/rbac/statistics
// @access  Private (Admin only)
router.get('/statistics', async (req, res) => {
  try {
    const [
      roleStats,
      permissionCount,
      activeRoles,
      expiredRoles
    ] = await Promise.all([
      UserRole.getRoleStatistics(),
      Permission.countDocuments({ isActive: true }),
      Role.countDocuments({ isActive: true }),
      UserRole.getExpiredRoles()
    ]);

    res.json({
      success: true,
      data: {
        roles: {
          total: activeRoles,
          statistics: roleStats
        },
        permissions: {
          total: permissionCount
        },
        expiredRoles: {
          count: expiredRoles.length,
          roles: expiredRoles
        }
      }
    });
  } catch (error) {
    console.error('Get RBAC statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cleanup expired roles
// @route   POST /api/rbac/cleanup
// @access  Private (Admin only)
router.post('/cleanup', async (req, res) => {
  try {
    const cleanedCount = await UserRole.cleanupExpiredRoles();

    res.json({
      success: true,
      message: `${cleanedCount} expired roles cleaned up`
    });
  } catch (error) {
    console.error('Cleanup expired roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
