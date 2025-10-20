# ServicePro Environment Variables Guide

## Backend Environment Variables

### Required Variables

#### Database Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicepro?retryWrites=true&w=majority
```

#### Server Configuration
```env
PORT=3001
NODE_ENV=production
```

#### Security
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```

### Optional Variables

#### File Upload Configuration
```env
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
PROVIDER_PHOTOS_DIR=uploads/provider-photos
RECEIPTS_DIR=uploads/receipts
UPLOAD_PATH=./uploads
```

#### Logging & Debugging
```env
ENABLE_REQUEST_LOGGING=false
DEBUG=false
VERBOSE_ERRORS=false
```

#### Email Configuration (Optional)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@servicepro.com
```

#### Cloud Storage (Optional)
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=servicepro-uploads
```

#### Payment Integration (Optional)
```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## Frontend Environment Variables

### Required Variables

#### API Configuration
```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
VITE_UPLOAD_PROVIDER_PHOTO_URL=https://your-backend-service.onrender.com/upload-provider-photo
VITE_UPLOAD_RECEIPT_URL=https://your-backend-service.onrender.com/upload-receipt
```

#### Application Configuration
```env
VITE_APP_NAME=ServicePro
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### Optional Variables

#### File Upload Configuration
```env
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

#### Feature Flags
```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEV_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

#### External Services (Optional)
```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
```

#### Internationalization
```env
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar,de
```

#### Theme Configuration
```env
VITE_DEFAULT_THEME=light
VITE_AVAILABLE_THEMES=light,dark
```

---

## Render Deployment Configuration

### Backend Service (Render)

#### Build Command
```bash
npm install
```

#### Start Command
```bash
npm start
```

#### Environment Variables for Render Backend
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicepro?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
ENABLE_REQUEST_LOGGING=false
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
PROVIDER_PHOTOS_DIR=uploads/provider-photos
RECEIPTS_DIR=uploads/receipts
```

### Frontend Service (Render)

#### Build Command
```bash
npm install && npm run build
```

#### Publish Directory
```
dist
```

#### Environment Variables for Render Frontend
```env
VITE_APP_NAME=ServicePro
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
VITE_UPLOAD_PROVIDER_PHOTO_URL=https://your-backend-service.onrender.com/upload-provider-photo
VITE_UPLOAD_RECEIPT_URL=https://your-backend-service.onrender.com/upload-receipt
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEV_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar,de
VITE_DEFAULT_THEME=light
VITE_AVAILABLE_THEMES=light,dark
```

---

## Development vs Production

### Development Environment
- Use `localhost` URLs for API endpoints
- Enable debug logging and console logs
- Use development database
- Enable verbose error messages

### Production Environment
- Use production URLs (Render, Vercel, etc.)
- Disable debug logging
- Use production database (MongoDB Atlas)
- Disable verbose error messages
- Use strong JWT secrets
- Enable HTTPS only

---

## Security Best Practices

1. **Never commit .env files to version control**
2. **Use strong, unique JWT secrets in production**
3. **Use environment-specific database connections**
4. **Enable HTTPS in production**
5. **Use proper CORS configuration**
6. **Validate all environment variables**
7. **Use secrets management for sensitive data**

---

## Quick Setup Commands

### Backend (.env)
```bash
# Create backend .env file
cat > backend/.env << EOF
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicepro?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=3001
ENABLE_REQUEST_LOGGING=true
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
PROVIDER_PHOTOS_DIR=uploads/provider-photos
RECEIPTS_DIR=uploads/receipts
EOF
```

### Frontend (.env.local)
```bash
# Create frontend .env.local file
cat > .env.local << EOF
VITE_APP_NAME=ServicePro
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_UPLOAD_PROVIDER_PHOTO_URL=http://localhost:3001/upload-provider-photo
VITE_UPLOAD_RECEIPT_URL=http://localhost:3001/upload-receipt
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEV_MODE=true
VITE_SHOW_CONSOLE_LOGS=true
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar,de
VITE_DEFAULT_THEME=light
VITE_AVAILABLE_THEMES=light,dark
EOF
```
