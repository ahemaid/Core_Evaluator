const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123',
        role: 'user',
        language: 'ar'
      };

      const user = await User.create(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.phone).toBe(userData.phone);
      expect(user.role).toBe(userData.role);
      expect(user.language).toBe(userData.language);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.isApproved).toBe('pending');
      expect(user.rewardPoints).toBe(0);
    });

    test('should require email field', async () => {
      const userData = {
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should require unique email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate password length', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: '123' // Too short
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate role enum', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123',
        role: 'invalid-role'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(10); // bcrypt hash length
    });

    test('should not hash password if not modified', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      const user = await User.create(userData);
      const originalPassword = user.password;

      // Update name only
      user.name = 'Updated Name';
      await user.save();

      expect(user.password).toBe(originalPassword);
    });
  });

  describe('Password Comparison', () => {
    test('should compare password correctly', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      const user = await User.create(userData);
      
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('JSON Output', () => {
    test('should not include password in JSON output', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'password123'
      };

      const user = await User.create(userData);
      const userJson = user.toJSON();

      expect(userJson.password).toBeUndefined();
      expect(userJson.resetPasswordToken).toBeUndefined();
      expect(userJson.resetPasswordExpire).toBeUndefined();
    });
  });

  describe('User Roles', () => {
    test('should create admin user', async () => {
      const userData = {
        email: 'admin@example.com',
        name: 'Admin User',
        phone: '+1234567890',
        password: 'password123',
        role: 'admin'
      };

      const user = await User.create(userData);
      expect(user.role).toBe('admin');
    });

    test('should create provider user', async () => {
      const userData = {
        email: 'provider@example.com',
        name: 'Provider User',
        phone: '+1234567890',
        password: 'password123',
        role: 'provider'
      };

      const user = await User.create(userData);
      expect(user.role).toBe('provider');
    });

    test('should create evaluator user', async () => {
      const userData = {
        email: 'evaluator@example.com',
        name: 'Evaluator User',
        phone: '+1234567890',
        password: 'password123',
        role: 'evaluator'
      };

      const user = await User.create(userData);
      expect(user.role).toBe('evaluator');
    });
  });
});
