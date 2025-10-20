require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const serviceProviderRoutes = require('./routes/serviceProviders');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');
const categoryRoutes = require('./routes/categories');
const blogPostRoutes = require('./routes/blogPosts');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const qualityRoutes = require('./routes/quality');
const rbacRoutes = require('./routes/rbac');
const providerPortalRoutes = require('./routes/providerPortal');

// Import middleware
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'https://serviceprofi.netlify.app',
    'https://servicepro.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Request logging middleware
if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    port: PORT,
    message: 'ServicePro Backend is running'
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist
const uploadDirs = {
  providerPhotos: path.join(__dirname, process.env.PROVIDER_PHOTOS_DIR || 'uploads/provider-photos'),
  receipts: path.join(__dirname, process.env.RECEIPTS_DIR || 'uploads/receipts')
};

Object.values(uploadDirs).forEach(dir => {
  fs.ensureDirSync(dir);
});

// Configure multer for provider photos
const providerPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.providerPhotos);
  },
  filename: (req, file, cb) => {
    const providerId = req.body.providerId || Date.now().toString();
    const ext = path.extname(file.originalname);
    cb(null, `${providerId}${ext}`);
  }
});

// Configure multer for receipts
const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.receipts);
  },
  filename: (req, file, cb) => {
    const appointmentId = req.body.appointmentId || Date.now().toString();
    const ext = path.extname(file.originalname);
    cb(null, `${appointmentId}${ext}`);
  }
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`), false);
  }
};

// Multer instances
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default

const uploadProviderPhoto = multer({
  storage: providerPhotoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

const uploadReceipt = multer({
  storage: receiptStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/service-providers', serviceProviderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blog-posts', blogPostRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/provider-portal', providerPortalRoutes);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'File upload server is running',
    environment: NODE_ENV,
    port: PORT,
    maxFileSize: maxFileSize,
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',')
  });
});

// Upload provider photo
app.post('/upload-provider-photo', protect, uploadProviderPhoto.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/provider-photos/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Provider photo upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Upload receipt
app.post('/upload-receipt', protect, uploadReceipt.single('receipt'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/receipts/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Receipt uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Receipt upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Get uploaded files list (for debugging)
app.get('/files', (req, res) => {
  try {
    const providerPhotos = fs.readdirSync(uploadDirs.providerPhotos);
    const receipts = fs.readdirSync(uploadDirs.receipts);
    
    res.json({
      providerPhotos: providerPhotos.map(file => ({
        filename: file,
        url: `/uploads/provider-photos/${file}`
      })),
      receipts: receipts.map(file => ({
        filename: file,
        url: `/uploads/receipts/${file}`
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: `File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.` 
      });
    }
  }
  
  // Log error in development
  if (NODE_ENV === 'development') {
    console.error('Error:', error);
  }
  
  res.status(500).json({ 
    error: NODE_ENV === 'development' ? error.message : 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ServicePro API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📁 Upload directories:`);
  console.log(`  Provider photos: ${uploadDirs.providerPhotos}`);
  console.log(`  Receipts: ${uploadDirs.receipts}`);
  console.log(`📏 Max file size: ${Math.round(maxFileSize / 1024 / 1024)}MB`);
  console.log(`✅ Allowed file types: ${(process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',').join(', ')}`);
  console.log(`🔗 API Endpoints:`);
  console.log(`  Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  Service Providers: http://localhost:${PORT}/api/service-providers`);
  console.log(`  Appointments: http://localhost:${PORT}/api/appointments`);
  console.log(`  Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`  Categories: http://localhost:${PORT}/api/categories`);
  console.log(`  Blog Posts: http://localhost:${PORT}/api/blog-posts`);
  console.log(`  Admin: http://localhost:${PORT}/api/admin`);
  console.log(`  Messages: http://localhost:${PORT}/api/messages`);
  console.log(`  Notifications: http://localhost:${PORT}/api/notifications`);
  console.log(`  Quality: http://localhost:${PORT}/api/quality`);
  console.log(`  RBAC: http://localhost:${PORT}/api/rbac`);
  console.log(`  Provider Portal: http://localhost:${PORT}/api/provider-portal`);
});

