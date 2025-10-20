# ServicePro API Documentation

This document provides comprehensive documentation for the ServicePro backend API endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### POST `/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "user"
}
```

#### POST `/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/me`
Get current user profile (requires authentication)

#### PUT `/me`
Update user profile (requires authentication)

#### POST `/change-password`
Change user password (requires authentication)

### 👥 Service Providers (`/api/service-providers`)

#### GET `/`
Get all service providers with filtering and pagination
- Query params: `page`, `limit`, `category`, `location`, `search`

#### GET `/:id`
Get specific service provider by ID

#### POST `/`
Create new service provider (requires provider role)

#### PUT `/:id`
Update service provider (requires provider role)

#### DELETE `/:id`
Delete service provider (requires provider role)

#### GET `/:id/appointments`
Get appointments for specific provider

### 📅 Appointments (`/api/appointments`)

#### GET `/`
Get user's appointments (requires authentication)

#### POST `/`
Create new appointment (requires authentication)
```json
{
  "serviceProvider": "provider_id",
  "date": "2024-01-15",
  "time": "10:00",
  "serviceType": "consultation",
  "notes": "Regular checkup"
}
```

#### PUT `/:id`
Update appointment (requires authentication)

#### DELETE `/:id`
Cancel appointment (requires authentication)

### ⭐ Reviews (`/api/reviews`)

#### GET `/`
Get reviews with filtering
- Query params: `serviceProvider`, `user`, `rating`, `page`, `limit`

#### POST `/`
Create new review (requires authentication)
```json
{
  "serviceProvider": "provider_id",
  "appointment": "appointment_id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

#### PUT `/:id`
Update review (requires authentication)

#### DELETE `/:id`
Delete review (requires authentication)

#### POST `/:id/report`
Report inappropriate review (requires authentication)

### 📂 Categories (`/api/categories`)

#### GET `/`
Get all service categories

#### POST `/`
Create new category (requires admin role)

#### PUT `/:id`
Update category (requires admin role)

#### DELETE `/:id`
Delete category (requires admin role)

### 📝 Blog Posts (`/api/blog-posts`)

#### GET `/`
Get all blog posts with pagination

#### GET `/:id`
Get specific blog post

#### POST `/`
Create new blog post (requires admin role)

#### PUT `/:id`
Update blog post (requires admin role)

#### DELETE `/:id`
Delete blog post (requires admin role)

### 👨‍💼 Admin (`/api/admin`)

#### GET `/dashboard`
Get admin dashboard statistics

#### GET `/users`
Get all users with filtering and pagination

#### GET `/providers`
Get all service providers for admin review

#### PUT `/providers/:id/approve`
Approve service provider (requires admin role)

#### PUT `/providers/:id/reject`
Reject service provider (requires admin role)

#### GET `/reviews`
Get all reviews for moderation

#### PUT `/reviews/:id/moderate`
Moderate review (requires admin role)

#### GET `/analytics`
Get platform analytics

### 💬 Messages (`/api/messages`)

#### GET `/conversations`
Get user's conversations (requires authentication)

#### POST `/conversations`
Create new conversation (requires authentication)

#### GET `/conversations/:id/messages`
Get messages in conversation (requires authentication)

#### POST `/conversations/:id/messages`
Send message in conversation (requires authentication)

### 🔔 Notifications (`/api/notifications`)

#### GET `/`
Get user's notifications (requires authentication)

#### POST `/`
Create notification (requires admin/provider role)

#### PUT `/:id/read`
Mark notification as read (requires authentication)

#### DELETE `/:id`
Delete notification (requires authentication)

### 📊 Quality (`/api/quality`)

#### GET `/scores`
Get quality scores for providers

#### POST `/scores`
Calculate and store quality score (requires admin role)

#### GET `/metrics`
Get quality metrics and analytics

### 🔐 RBAC (`/api/rbac`)

#### GET `/roles`
Get all roles (requires admin role)

#### POST `/roles`
Create new role (requires admin role)

#### GET `/permissions`
Get all permissions (requires admin role)

#### POST `/permissions`
Create new permission (requires admin role)

#### GET `/users/:id/roles`
Get user's roles (requires admin role)

#### POST `/users/:id/roles`
Assign role to user (requires admin role)

### 🏥 Provider Portal (`/api/provider-portal`)

#### GET `/profile`
Get provider profile (requires provider role)

#### PUT `/profile`
Update provider profile (requires provider role)

#### GET `/availability`
Get provider availability (requires provider role)

#### PUT `/availability`
Update provider availability (requires provider role)

#### GET `/appointments`
Get provider's appointments (requires provider role)

#### PUT `/appointments/:id/status`
Update appointment status (requires provider role)

#### POST `/appointments/:id/notes`
Add appointment notes (requires provider role)

#### POST `/meetings`
Create meeting link (requires provider role)

#### GET `/analytics`
Get provider analytics (requires provider role)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

## Pagination

List endpoints support pagination:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## File Uploads

File uploads are supported for:
- Provider photos (`/api/service-providers/:id/photo`)
- Receipt uploads (`/api/appointments/:id/receipt`)

Supported formats: JPEG, PNG, WebP, PDF  
Max file size: 5MB

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Webhooks

The API supports webhooks for:
- Appointment status changes
- New review notifications
- Provider approval notifications

## SDKs and Libraries

Official SDKs available for:
- JavaScript/Node.js
- Python
- PHP

## Support

For API support:
- Check the error messages for debugging
- Review the authentication requirements
- Ensure proper request formatting
- Contact the development team for issues

---

**API Version**: 1.0.0  
**Last Updated**: December 2024
