const Permission = require('../models/Permission');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');

// Check if user has specific permission
const hasPermission = async (req, res, next) => {
  try {
    const { resource, action } = req.params;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user's roles
    const userRoles = await UserRole.getUserRoles(req.user.id);
    
    if (userRoles.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No roles assigned'
      });
    }

    // Check if user has the required permission
    const hasRequiredPermission = await checkUserPermission(
      req.user.id,
      resource,
      action,
      req
    );

    if (!hasRequiredPermission) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${resource}:${action}`
      });
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during permission check'
    });
  }
};

// Check if user has any of the specified permissions
const hasAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const hasPermission = await checkUserPermissions(
        req.user.id,
        permissions,
        req
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission check'
      });
    }
  };
};

// Check if user has all specified permissions
const hasAllPermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      for (const permission of permissions) {
        const [resource, action] = permission.split(':');
        const hasPermission = await checkUserPermission(
          req.user.id,
          resource,
          action,
          req
        );

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Missing required permission: ${permission}`
          });
        }
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission check'
      });
    }
  };
};

// Check if user has specific role
const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const hasRequiredRole = await UserRole.userHasRole(req.user.id, roleName);

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Required role: ${roleName}`
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during role check'
      });
    }
  };
};

// Check if user has any of the specified roles
const hasAnyRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRoles = await UserRole.getUserRoles(req.user.id);
      const userRoleNames = userRoles.map(ur => ur.roleId.name);

      const hasRequiredRole = roles.some(role => userRoleNames.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Required roles: ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during role check'
      });
    }
  };
};

// Helper function to check if user has specific permission
const checkUserPermission = async (userId, resource, action, req) => {
  try {
    // Get user's active roles
    const userRoles = await UserRole.getUserRoles(userId);
    
    if (userRoles.length === 0) {
      return false;
    }

    // Get the permission
    const permission = await Permission.hasPermission(resource, action);
    if (!permission) {
      return false;
    }

    // Check each role for the permission
    for (const userRole of userRoles) {
      const role = await Role.findById(userRole.roleId);
      if (!role) continue;

      // Check if role has the permission
      const rolePermission = role.permissions.find(
        p => p.permissionId.toString() === permission._id.toString() && p.granted
      );

      if (rolePermission) {
        // Check conditions
        const conditions = rolePermission.conditions || {};
        
        // Check own data only condition
        if (conditions.ownDataOnly) {
          if (!await checkOwnDataCondition(userId, resource, req)) {
            continue;
          }
        }

        // Check same organization condition
        if (conditions.sameOrganization) {
          if (!await checkSameOrganizationCondition(userId, userRole, req)) {
            continue;
          }
        }

        // Check same category condition
        if (conditions.sameCategory) {
          if (!await checkSameCategoryCondition(userId, userRole, req)) {
            continue;
          }
        }

        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
};

// Helper function to check if user has any of the specified permissions
const checkUserPermissions = async (userId, permissions, req) => {
  for (const permission of permissions) {
    const [resource, action] = permission.split(':');
    const hasPermission = await checkUserPermission(userId, resource, action, req);
    if (hasPermission) {
      return true;
    }
  }
  return false;
};

// Helper function to check own data condition
const checkOwnDataCondition = async (userId, resource, req) => {
  const { id } = req.params;
  
  switch (resource) {
    case 'users':
      return id === userId;
    case 'providers':
      // Check if the provider belongs to the user
      const ServiceProvider = require('../models/ServiceProvider');
      const provider = await ServiceProvider.findById(id);
      return provider && provider.userId.toString() === userId;
    case 'appointments':
      // Check if the appointment belongs to the user
      const Appointment = require('../models/Appointment');
      const appointment = await Appointment.findById(id);
      return appointment && appointment.userId.toString() === userId;
    case 'reviews':
      // Check if the review belongs to the user
      const Review = require('../models/Review');
      const review = await Review.findById(id);
      return review && review.userId.toString() === userId;
    default:
      return false;
  }
};

// Helper function to check same organization condition
const checkSameOrganizationCondition = async (userId, userRole, req) => {
  const userOrg = userRole.roleData?.organization;
  if (!userOrg) return false;

  const { id } = req.params;
  
  // This would need to be implemented based on your organization structure
  // For now, return true as a placeholder
  return true;
};

// Helper function to check same category condition
const checkSameCategoryCondition = async (userId, userRole, req) => {
  const userCategories = userRole.roleData?.categories || [];
  if (userCategories.length === 0) return false;

  const { id } = req.params;
  
  // Check if the resource belongs to one of the user's categories
  switch (req.baseUrl) {
    case '/api/providers':
      const ServiceProvider = require('../models/ServiceProvider');
      const provider = await ServiceProvider.findById(id);
      return provider && userCategories.includes(provider.category);
    default:
      return false;
  }
};

// Middleware to add user permissions to request
const addUserPermissions = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const userRoles = await UserRole.getUserRoles(req.user.id);
    const permissions = [];

    for (const userRole of userRoles) {
      const role = await Role.findById(userRole.roleId).populate('permissions.permissionId');
      if (role) {
        for (const rolePermission of role.permissions) {
          if (rolePermission.granted && rolePermission.permissionId) {
            permissions.push({
              resource: rolePermission.permissionId.resource,
              action: rolePermission.permissionId.action,
              conditions: rolePermission.conditions
            });
          }
        }
      }
    }

    req.userPermissions = permissions;
    next();
  } catch (error) {
    console.error('Error adding user permissions:', error);
    next();
  }
};

// Middleware to check resource ownership
const checkResourceOwnership = (resourceModel, userIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const Model = require(`../models/${resourceModel}`);
      
      const resource = await Model.findById(id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      if (resource[userIdField].toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
};

module.exports = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  addUserPermissions,
  checkResourceOwnership,
  checkUserPermission
};
