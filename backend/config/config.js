require('dotenv').config();

module.exports = {
  // MongoDB Configuration
  mongoURI: process.env.MONGODB_URI || 'mongodb+srv://ahmedcertsoft:<db_password>@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0',
  
  // JWT Secret
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // File Upload Configuration
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),
  providerPhotosDir: process.env.PROVIDER_PHOTOS_DIR || 'uploads/provider-photos',
  receiptsDir: process.env.RECEIPTS_DIR || 'uploads/receipts',
  
  // Logging Configuration
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  debug: process.env.DEBUG === 'true',
  verboseErrors: process.env.VERBOSE_ERRORS === 'true',
  
  // Email Configuration (Optional)
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@servicepro.com'
  },
  
  // Cloud Storage Configuration (Optional)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET
  },
  
  // Payment Configuration (Optional)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  
  // CORS Configuration
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  
  // Rate Limiting Configuration (Optional)
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};
