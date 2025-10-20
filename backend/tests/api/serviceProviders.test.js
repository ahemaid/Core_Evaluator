const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const ServiceProvider = require('../../models/ServiceProvider');

describe('Service Providers API', () => {
  let adminToken;
  let providerToken;
  let userToken;
  let adminUser;
  let providerUser;
  let regularUser;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'admin',
      language: 'ar',
      isApproved: true
    });

    // Create provider user
    providerUser = await User.create({
      name: 'Provider User',
      email: 'provider@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'provider',
      language: 'ar',
      isApproved: true
    });

    // Create regular user
    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'user',
      language: 'ar',
      isApproved: true
    });

    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.token;

    const providerLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'provider@example.com', password: 'password123' });
    providerToken = providerLogin.body.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userLogin.body.token;
  });

  describe('GET /api/service-providers', () => {
    beforeEach(async () => {
      // Create test service providers
      await ServiceProvider.create([
        {
          userId: providerUser._id,
          name: 'Dr. Test Provider',
          email: 'provider@example.com',
          phone: '+1234567890',
          category: 'healthcare',
          subcategory: 'Cardiology',
          location: 'Test City',
          country: 'Test Country',
          experience: 10,
          rating: 4.5,
          reviewCount: 100,
          price: 100,
          priceUnit: 'per visit',
          waitTime: '1-2 days',
          photo: 'test-photo.jpg',
          badges: ['Verified'],
          isVerified: true,
          isActive: true,
          isApproved: true,
          bio: 'Test bio',
          credentials: ['Test University'],
          languages: ['English'],
          serviceHours: '9AM-5PM'
        },
        {
          userId: providerUser._id,
          name: 'Restaurant Test',
          email: 'restaurant@example.com',
          phone: '+1234567890',
          category: 'restaurants',
          subcategory: 'Fine Dining',
          location: 'Test City',
          country: 'Test Country',
          experience: 5,
          rating: 4.0,
          reviewCount: 50,
          price: 50,
          priceUnit: 'per person',
          waitTime: '30 minutes',
          photo: 'test-photo.jpg',
          badges: ['Popular'],
          isVerified: true,
          isActive: true,
          isApproved: true,
          bio: 'Test restaurant bio',
          credentials: ['Food License'],
          languages: ['English'],
          serviceHours: '11AM-10PM'
        }
      ]);
    });

    test('should get all service providers', async () => {
      const response = await request(app)
        .get('/api/service-providers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    test('should filter providers by category', async () => {
      const response = await request(app)
        .get('/api/service-providers?category=healthcare')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('healthcare');
    });

    test('should filter providers by location', async () => {
      const response = await request(app)
        .get('/api/service-providers?location=Test City')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    test('should filter providers by rating', async () => {
      const response = await request(app)
        .get('/api/service-providers?minRating=4.5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].rating).toBeGreaterThanOrEqual(4.5);
    });

    test('should sort providers by rating', async () => {
      const response = await request(app)
        .get('/api/service-providers?sortBy=rating')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].rating).toBeGreaterThanOrEqual(response.body.data[1].rating);
    });

    test('should paginate results', async () => {
      const response = await request(app)
        .get('/api/service-providers?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/service-providers/:id', () => {
    let testProvider;

    beforeEach(async () => {
      testProvider = await ServiceProvider.create({
        userId: providerUser._id,
        name: 'Dr. Test Provider',
        email: 'provider@example.com',
        phone: '+1234567890',
        category: 'healthcare',
        subcategory: 'Cardiology',
        location: 'Test City',
        country: 'Test Country',
        experience: 10,
        rating: 4.5,
        reviewCount: 100,
        price: 100,
        priceUnit: 'per visit',
        waitTime: '1-2 days',
        photo: 'test-photo.jpg',
        badges: ['Verified'],
        isVerified: true,
        isActive: true,
        isApproved: true,
        bio: 'Test bio',
        credentials: ['Test University'],
        languages: ['English'],
        serviceHours: '9AM-5PM'
      });
    });

    test('should get single service provider', async () => {
      const response = await request(app)
        .get(`/api/service-providers/${testProvider._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Dr. Test Provider');
      expect(response.body.data.category).toBe('healthcare');
    });

    test('should return 404 for non-existent provider', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/service-providers/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/service-providers', () => {
    test('should create service provider profile', async () => {
      const providerData = {
        name: 'New Provider',
        category: 'healthcare',
        subcategory: 'Dermatology',
        location: 'New City',
        country: 'New Country',
        experience: 8,
        price: 150,
        priceUnit: 'per visit',
        waitTime: '2-3 days',
        bio: 'New provider bio',
        serviceHours: '10AM-6PM',
        credentials: ['New University'],
        languages: ['English', 'Arabic']
      };

      const response = await request(app)
        .post('/api/service-providers')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(providerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(providerData.name);
      expect(response.body.data.category).toBe(providerData.category);
    });

    test('should not create provider without authentication', async () => {
      const providerData = {
        name: 'New Provider',
        category: 'healthcare',
        subcategory: 'Dermatology',
        location: 'New City',
        country: 'New Country',
        experience: 8,
        price: 150,
        priceUnit: 'per visit',
        waitTime: '2-3 days',
        bio: 'New provider bio',
        serviceHours: '10AM-6PM'
      };

      const response = await request(app)
        .post('/api/service-providers')
        .send(providerData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should not create provider with invalid role', async () => {
      const providerData = {
        name: 'New Provider',
        category: 'healthcare',
        subcategory: 'Dermatology',
        location: 'New City',
        country: 'New Country',
        experience: 8,
        price: 150,
        priceUnit: 'per visit',
        waitTime: '2-3 days',
        bio: 'New provider bio',
        serviceHours: '10AM-6PM'
      };

      const response = await request(app)
        .post('/api/service-providers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(providerData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should validate required fields', async () => {
      const providerData = {
        name: 'New Provider',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/service-providers')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(providerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/service-providers/:id', () => {
    let testProvider;

    beforeEach(async () => {
      testProvider = await ServiceProvider.create({
        userId: providerUser._id,
        name: 'Dr. Test Provider',
        email: 'provider@example.com',
        phone: '+1234567890',
        category: 'healthcare',
        subcategory: 'Cardiology',
        location: 'Test City',
        country: 'Test Country',
        experience: 10,
        rating: 4.5,
        reviewCount: 100,
        price: 100,
        priceUnit: 'per visit',
        waitTime: '1-2 days',
        photo: 'test-photo.jpg',
        badges: ['Verified'],
        isVerified: true,
        isActive: true,
        isApproved: true,
        bio: 'Test bio',
        credentials: ['Test University'],
        languages: ['English'],
        serviceHours: '9AM-5PM'
      });
    });

    test('should update service provider profile', async () => {
      const updateData = {
        name: 'Updated Provider',
        bio: 'Updated bio',
        price: 120
      };

      const response = await request(app)
        .put(`/api/service-providers/${testProvider._id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.bio).toBe(updateData.bio);
      expect(response.body.data.price).toBe(updateData.price);
    });

    test('should not update provider without authorization', async () => {
      const updateData = {
        name: 'Updated Provider'
      };

      const response = await request(app)
        .put(`/api/service-providers/${testProvider._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should allow admin to update any provider', async () => {
      const updateData = {
        name: 'Admin Updated Provider'
      };

      const response = await request(app)
        .put(`/api/service-providers/${testProvider._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/service-providers/:id', () => {
    let testProvider;

    beforeEach(async () => {
      testProvider = await ServiceProvider.create({
        userId: providerUser._id,
        name: 'Dr. Test Provider',
        email: 'provider@example.com',
        phone: '+1234567890',
        category: 'healthcare',
        subcategory: 'Cardiology',
        location: 'Test City',
        country: 'Test Country',
        experience: 10,
        rating: 4.5,
        reviewCount: 100,
        price: 100,
        priceUnit: 'per visit',
        waitTime: '1-2 days',
        photo: 'test-photo.jpg',
        badges: ['Verified'],
        isVerified: true,
        isActive: true,
        isApproved: true,
        bio: 'Test bio',
        credentials: ['Test University'],
        languages: ['English'],
        serviceHours: '9AM-5PM'
      });
    });

    test('should delete service provider profile', async () => {
      const response = await request(app)
        .delete(`/api/service-providers/${testProvider._id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    test('should not delete provider without authorization', async () => {
      const response = await request(app)
        .delete(`/api/service-providers/${testProvider._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should return 404 for non-existent provider', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/service-providers/${fakeId}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
