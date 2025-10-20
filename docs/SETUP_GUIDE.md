# ServicePro Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/servicepro

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
PROVIDER_PHOTOS_DIR=uploads/provider-photos
RECEIPTS_DIR=uploads/receipts

# Logging
ENABLE_REQUEST_LOGGING=true
```

### 3. Database Setup

Make sure MongoDB is running, then initialize the RBAC system:

```bash
cd backend
node scripts/initializeRBAC.js
```

### 4. Start the Application

```bash
# Start backend server
cd backend
npm start

# Start frontend (in another terminal)
npm run dev
```

## New Features Overview

### 🎛️ Enhanced Admin Dashboard

- **User Management**: Approve/reject users and providers
- **Review Moderation**: Manage reviews with spam detection
- **Quality Analytics**: Monitor service quality metrics
- **Provider Verification**: Streamlined onboarding process
- **Audit Logging**: Complete action tracking

### 📊 Quality Measurement System

- **Service Quality Index (SQI)**: Comprehensive scoring (0-100)
- **Multi-factor Analysis**: Reviews, completion rates, response speed, complaints
- **Real-time Tracking**: Automated quality calculations
- **Performance Analytics**: Trend analysis and benchmarking

### 💬 Communication System

- **In-App Messaging**: Real-time chat between users and providers
- **Multi-channel Notifications**: Email, push, SMS, in-app
- **Message Features**: File attachments, reactions, read receipts
- **Conversation Management**: Organized threading and search

### 🔒 Security & RBAC

- **Role-Based Access Control**: Granular permission system
- **4 Default Roles**: Admin, Provider, User, Evaluator
- **Permission Management**: Resource-based access control
- **Security Features**: Audit logging, IP restrictions, time-based access

## API Endpoints

### Admin APIs
```
GET    /api/admin/dashboard          # Dashboard overview
GET    /api/admin/users              # User management
PUT    /api/admin/users/:id/status   # Update user status
GET    /api/admin/providers          # Provider management
PUT    /api/admin/providers/:id/approval # Approve/reject providers
GET    /api/admin/reviews            # Review moderation
PUT    /api/admin/reviews/:id/moderate # Moderate reviews
GET    /api/admin/quality            # Quality analytics
GET    /api/admin/complaints         # Complaint management
GET    /api/admin/analytics          # System analytics
```

### Quality APIs
```
GET    /api/quality/scores                    # Quality scores
GET    /api/quality/scores/current/:id        # Current SQI
POST   /api/quality/scores/calculate/:id      # Calculate SQI
GET    /api/quality/analytics                 # Quality analytics
GET    /api/quality/recommendations/:id       # Quality recommendations
GET    /api/quality/benchmarks                # Quality benchmarks
```

### Communication APIs
```
GET    /api/messages/conversations            # Get conversations
POST   /api/messages/conversations            # Create conversation
GET    /api/messages/conversations/:id/messages # Get messages
POST   /api/messages/conversations/:id/messages # Send message
GET    /api/notifications                     # Get notifications
POST   /api/notifications                     # Create notification
PUT    /api/notifications/:id/read            # Mark as read
```

### RBAC APIs
```
POST   /api/rbac/initialize                   # Initialize RBAC
GET    /api/rbac/permissions                  # Get permissions
POST   /api/rbac/permissions                  # Create permission
GET    /api/rbac/roles                        # Get roles
POST   /api/rbac/roles                        # Create role
POST   /api/rbac/users/:id/roles              # Assign role
GET    /api/rbac/users/:id/roles              # Get user roles
DELETE /api/rbac/users/:id/roles/:roleId      # Revoke role
GET    /api/rbac/statistics                   # RBAC statistics
```

## Database Models

### New Models
- `QualityScore`: Quality scoring and SQI calculations
- `Complaint`: Complaint management system
- `Message`: Message system
- `Conversation`: Conversation threading
- `Notification`: Notification system
- `Permission`: Permission definitions
- `Role`: Role definitions
- `UserRole`: User-role assignments

### Enhanced Models
- `User`: Added role management
- `ServiceProvider`: Enhanced with quality metrics
- `Review`: Enhanced with moderation features
- `Appointment`: Enhanced with communication features

## Frontend Components

### New Components
- `QualityMetrics.tsx`: Quality dashboard with charts
- `MessageSystem.tsx`: Real-time messaging interface
- Enhanced `AdminDashboard.tsx`: Comprehensive admin interface

### Dependencies Added
- `recharts`: Chart library for quality metrics
- `@types/recharts`: TypeScript types for recharts

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Permission-based authorization
- Resource ownership validation
- Audit logging

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure file upload handling

## Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

### Build Application
```bash
# Production build
npm run build

# Backend build check
cd backend
npm run build
```

## Deployment

### Environment Variables
Ensure all environment variables are set for production:
- `MONGODB_URI`: Production database URL
- `JWT_SECRET`: Strong JWT secret
- `NODE_ENV`: Set to `production`
- `CORS_ORIGIN`: Production frontend URL

### Database Migration
Run the RBAC initialization script in production:
```bash
node scripts/initializeRBAC.js
```

### File Uploads
Ensure upload directories exist and have proper permissions:
```bash
mkdir -p uploads/provider-photos uploads/receipts
chmod 755 uploads/provider-photos uploads/receipts
```

## Monitoring & Analytics

### Quality Monitoring
- Real-time SQI tracking
- Performance trend analysis
- Provider benchmarking
- Quality alerts and notifications

### System Monitoring
- User activity tracking
- API usage analytics
- Error monitoring
- Performance metrics
- Security event logging

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure database permissions

2. **RBAC Initialization Error**
   - Run `node scripts/initializeRBAC.js`
   - Check MongoDB connection
   - Verify user permissions

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check allowed file types

4. **Frontend Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check for TypeScript errors
   - Verify component imports

### Support
For additional support, check the comprehensive documentation in `IMPROVEMENTS_SUMMARY.md` or review the API documentation in the codebase.
