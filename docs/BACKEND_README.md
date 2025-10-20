# ServicePro Backend API

A comprehensive Node.js/Express backend API for the ServicePro platform with MongoDB integration.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for users, providers, admins, and evaluators
- **Service Provider Management**: Complete CRUD operations for service providers
- **Appointment System**: Booking, management, and status tracking
- **Review System**: Rating and review functionality with moderation
- **Category Management**: Multi-language service categories
- **Blog System**: Content management for blog posts
- **File Upload**: Support for provider photos and receipts
- **Multi-language Support**: Arabic, English, and German

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://ahmedcertsoft:<db_password>@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Update MongoDB connection string**:
   Replace `<db_password>` in the MONGODB_URI with your actual MongoDB password.

## Database Setup

### Option 1: Run Migration Script (Recommended)

1. **Dry run to see what will be migrated**:
   ```bash
   npm run migrate:dry-run
   ```

2. **Run the actual migration**:
   ```bash
   npm run migrate
   ```

This will create:
- Admin user: `admin@servicepro.com` / `admin123456`
- Evaluator user: `evaluator@servicepro.com` / `evaluator123456`
- 10 Service provider accounts (from mock data)
- 3 Regular user accounts
- 6 Service categories with multi-language support
- 10 Service providers with complete profiles
- 3 Blog posts

### Option 2: Manual Setup

If you prefer to set up the database manually, you can use the API endpoints to create data.

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Service Providers
- `GET /api/service-providers` - Get all providers (with filtering)
- `GET /api/service-providers/:id` - Get single provider
- `POST /api/service-providers` - Create provider profile (Provider role required)
- `PUT /api/service-providers/:id` - Update provider profile
- `DELETE /api/service-providers/:id` - Delete provider profile
- `GET /api/service-providers/:id/appointments` - Get provider's appointments

### Appointments
- `GET /api/appointments` - Get appointments (filtered by user role)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews (with filtering)
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/report` - Report review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)
- `PUT /api/categories/:id/toggle` - Toggle category status (Admin only)

### Blog Posts
- `GET /api/blog-posts` - Get all blog posts (with filtering)
- `GET /api/blog-posts/featured` - Get featured blog posts
- `GET /api/blog-posts/:id` - Get single blog post
- `GET /api/blog-posts/slug/:slug` - Get blog post by slug
- `POST /api/blog-posts` - Create blog post (Admin only)
- `PUT /api/blog-posts/:id` - Update blog post (Admin only)
- `DELETE /api/blog-posts/:id` - Delete blog post (Admin only)
- `POST /api/blog-posts/:id/like` - Like blog post

### File Upload
- `POST /upload-provider-photo` - Upload provider photo
- `POST /upload-receipt` - Upload receipt
- `GET /files` - List uploaded files

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **user**: Regular users who can book appointments and write reviews
- **provider**: Service providers who can manage their profiles and appointments
- **admin**: System administrators with full access
- **evaluator**: Users who can evaluate and approve service providers

## Data Models

### User
- Basic user information
- Role-based access control
- Multi-language support
- Reward points system

### ServiceProvider
- Complete provider profiles
- Availability scheduling
- Rating and review system
- Document management

### Appointment
- Booking system
- Status tracking
- Payment integration ready
- Cancellation handling

### Review
- Rating system (1-5 stars)
- Comment moderation
- Report system
- Provider response support

### ServiceCategory
- Multi-language categories
- Hierarchical subcategories
- Provider count tracking

### BlogPost
- Multi-language content
- SEO optimization
- Featured posts
- View tracking

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## File Upload

The server supports file uploads for:
- Provider photos (images)
- Receipts (images/PDFs)

Files are stored in the `uploads/` directory and served statically.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- File type restrictions
- CORS configuration

## Development

### Project Structure
```
backend/
├── config/
│   ├── database.js
│   └── config.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── ServiceProvider.js
│   ├── Appointment.js
│   ├── Review.js
│   ├── ServiceCategory.js
│   └── BlogPost.js
├── routes/
│   ├── auth.js
│   ├── serviceProviders.js
│   ├── appointments.js
│   ├── reviews.js
│   ├── categories.js
│   └── blogPosts.js
├── scripts/
│   ├── migrateData.js
│   └── runMigration.js
├── uploads/
│   ├── provider-photos/
│   └── receipts/
├── server.js
└── package.json
```

### Adding New Features

1. Create/update models in `models/`
2. Add routes in `routes/`
3. Update server.js to include new routes
4. Add authentication middleware as needed

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use a process manager like PM2
6. Configure proper logging
7. Set up database backups

## Support

For issues and questions, please check the API documentation or contact the development team.

## License

This project is licensed under the ISC License.