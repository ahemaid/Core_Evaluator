# ServicePro MongoDB Integration Setup Guide

This guide will help you set up MongoDB integration for your ServicePro project, migrating from mock data to a fully functional database-backed system.

## 🚀 Quick Start

### 1. Update MongoDB Connection String

**IMPORTANT**: Replace `<db_password>` in the connection string with your actual MongoDB password.

**Backend Configuration** (`backend/config/database.js`):
```javascript
const mongoURI = 'mongodb+srv://ahmedcertsoft:YOUR_ACTUAL_PASSWORD@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0';
```

**Alternative**: Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb+srv://ahmedcertsoft:YOUR_ACTUAL_PASSWORD@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Run Database Migration

```bash
# See what will be migrated (dry run)
npm run migrate:dry-run

# Run the actual migration
npm run migrate
```

### 4. Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` with all API endpoints available.

## 📊 What Gets Migrated

The migration script will create:

### Users
- **Admin**: `admin@servicepro.com` / `admin123456`
- **Evaluator**: `evaluator@servicepro.com` / `evaluator123456`
- **10 Service Providers**: From your existing mock data
- **3 Regular Users**: Test accounts for booking appointments

### Service Categories
- Healthcare (الرعاية الصحية)
- Restaurants (المطاعم)
- Education (التعليم)
- Beauty & Wellness (الجمال والعناية)
- Automotive (خدمات السيارات)
- Home Services (خدمات المنزل)

Each category includes:
- Multi-language support (Arabic, English, German)
- Subcategories
- Provider counts
- Icons and colors

### Service Providers
- All 10 providers from your mock data
- Complete profiles with availability, credentials, etc.
- Pre-approved status for immediate use

### Blog Posts
- 3 healthcare-related articles
- Multi-language content
- Featured posts

## 🔗 API Endpoints

Once the server is running, you'll have access to:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Service Providers
- `GET /api/service-providers` - List providers (with filtering)
- `GET /api/service-providers/:id` - Get single provider
- `POST /api/service-providers` - Create provider profile
- `PUT /api/service-providers/:id` - Update provider

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get single category

### Blog Posts
- `GET /api/blog-posts` - List blog posts
- `GET /api/blog-posts/featured` - Get featured posts
- `GET /api/blog-posts/:id` - Get single post

## 🎨 Frontend Integration

### API Service

I've created a comprehensive API service (`src/services/api.ts`) that handles:

- Authentication with JWT tokens
- All CRUD operations
- Error handling
- TypeScript types
- File uploads

### Example Usage

```typescript
import { authApi, serviceProvidersApi, categoriesApi } from '../services/api';

// Login
const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get service providers
const providersResponse = await serviceProvidersApi.getAll({
  category: 'healthcare',
  country: 'Jordan',
  page: 1,
  limit: 10
});

// Get categories
const categoriesResponse = await categoriesApi.getAll('ar');
```

### Updated HomePage Component

I've created `HomePageWithAPI.tsx` as an example of how to integrate the API:

- Loads categories and blog posts from the API
- Shows loading states
- Handles errors gracefully
- Uses real data instead of mock data

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://ahmedcertsoft:YOUR_PASSWORD@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend Environment

Add to your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚦 Testing the Setup

### 1. Test Backend Connection

```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "File upload server is running",
  "environment": "development"
}
```

### 2. Test API Endpoints

```bash
# Get categories
curl http://localhost:5000/api/categories

# Get service providers
curl http://localhost:5000/api/service-providers

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@servicepro.com","password":"admin123456"}'
```

### 3. Test Frontend Integration

Replace your current `HomePage` import with:

```typescript
import HomePageWithAPI from './pages/HomePageWithAPI';
```

## 🔐 Security Features

The backend includes:

- **Password Hashing**: Using bcryptjs
- **JWT Authentication**: Secure token-based auth
- **Role-based Authorization**: Admin, Provider, User, Evaluator roles
- **Input Validation**: Using express-validator
- **File Upload Security**: Type and size restrictions
- **CORS Configuration**: Proper cross-origin setup

## 📱 User Roles & Permissions

### Admin
- Full system access
- Manage all users and providers
- Create/edit/delete blog posts
- Manage categories
- View all appointments and reviews

### Provider
- Create and manage their profile
- View their appointments
- Respond to reviews
- Upload documents and photos

### User
- Book appointments
- Write reviews
- Update their profile
- View service providers

### Evaluator
- Evaluate and approve service providers
- Review provider applications
- Moderate content

## 🗄️ Database Schema

### Collections Created

1. **users** - User accounts and authentication
2. **serviceproviders** - Service provider profiles
3. **appointments** - Booking system
4. **reviews** - Rating and review system
5. **servicecategories** - Service categories with multi-language support
6. **blogposts** - Blog content management

### Key Features

- **Multi-language Support**: Arabic, English, German
- **Indexing**: Optimized for fast queries
- **Relationships**: Proper foreign key relationships
- **Validation**: Data integrity constraints
- **Timestamps**: Automatic created/updated tracking

## 🚀 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use a process manager like PM2
6. Configure database backups

### Frontend Deployment

1. Update `VITE_API_URL` to your production API URL
2. Build the project: `npm run build`
3. Deploy to your hosting platform

## 🆘 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check your MongoDB password
   - Verify the connection string
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **Migration Fails**
   - Check database permissions
   - Verify the connection string
   - Clear existing data if needed

3. **API Errors**
   - Check server logs
   - Verify JWT token
   - Check request format

### Getting Help

- Check the backend logs: `npm run dev`
- Test API endpoints with curl or Postman
- Verify database connection in MongoDB Atlas dashboard

## 📈 Next Steps

After setup, you can:

1. **Customize Data**: Modify the migration script to add your own data
2. **Add Features**: Extend the API with new endpoints
3. **Frontend Integration**: Update more components to use the API
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to production environment

## 🎉 Success!

Once everything is set up, you'll have:

- ✅ Fully functional MongoDB database
- ✅ Complete REST API
- ✅ Authentication system
- ✅ Multi-language support
- ✅ File upload capabilities
- ✅ Role-based access control
- ✅ Real-time data instead of mock data

Your ServicePro platform is now ready for production use!
