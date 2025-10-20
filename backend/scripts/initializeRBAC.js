const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const UserRole = require('../models/UserRole');
const User = require('../models/User');
require('dotenv').config();

async function initializeRBAC() {
  try {
    console.log('🚀 Initializing RBAC system...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicepro', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Create default roles and permissions
    console.log('📋 Creating default roles and permissions...');
    const roles = await Role.createDefaultRoles();
    console.log(`✅ Created ${roles.length} default roles`);

    // Get permission count
    const permissionCount = await Permission.countDocuments();
    console.log(`✅ Created ${permissionCount} permissions`);

    // Check if there are any users to assign admin role
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      console.log(`👤 Found admin user: ${adminUser.email}`);
      
      // Get admin role
      const adminRole = await Role.findOne({ name: 'admin' });
      if (adminRole) {
        // Check if user already has admin role assigned
        const existingUserRole = await UserRole.findOne({ 
          userId: adminUser._id, 
          roleId: adminRole._id 
        });
        
        if (!existingUserRole) {
          await UserRole.assignRole(
            adminUser._id,
            adminRole._id,
            adminUser._id, // Self-assigned
            { reason: 'Initial admin role assignment' }
          );
          console.log('✅ Assigned admin role to existing admin user');
        } else {
          console.log('ℹ️  Admin user already has admin role assigned');
        }
      }
    } else {
      console.log('ℹ️  No admin user found. Create an admin user first.');
    }

    // Display role statistics
    const roleStats = await UserRole.getRoleStatistics();
    console.log('\n📊 Role Statistics:');
    roleStats.forEach(stat => {
      console.log(`  ${stat.roleName}: ${stat.activeAssignments} active, ${stat.totalAssignments} total`);
    });

    console.log('\n🎉 RBAC system initialized successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Create admin users if needed');
    console.log('  2. Assign appropriate roles to users');
    console.log('  3. Configure permissions as needed');
    console.log('  4. Test the RBAC system');

  } catch (error) {
    console.error('❌ Error initializing RBAC:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the initialization
if (require.main === module) {
  initializeRBAC();
}

module.exports = initializeRBAC;
