require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceCategory = require('../models/ServiceCategory');
const BlogPost = require('../models/BlogPost');

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ahmedcertsoft:<db_password>@cluster0.dl1uavy.mongodb.net/servicepro?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    email: 'admin@servicepro.com',
    name: 'System Administrator',
    phone: '+962-6-555-0000',
    password: 'admin123456',
    role: 'admin',
    language: 'ar',
    isApproved: true,
    rewardPoints: 0
  },
  {
    email: 'evaluator@servicepro.com',
    name: 'Service Evaluator',
    phone: '+962-6-555-0001',
    password: 'evaluator123456',
    role: 'evaluator',
    language: 'ar',
    isApproved: true,
    rewardPoints: 0
  },
  {
    email: 'user1@servicepro.com',
    name: 'أحمد محمد',
    phone: '+962-6-555-1001',
    password: 'user123456',
    role: 'user',
    language: 'ar',
    isApproved: true,
    rewardPoints: 150
  },
  {
    email: 'user2@servicepro.com',
    name: 'فاطمة أحمد',
    phone: '+962-6-555-1002',
    password: 'user123456',
    role: 'user',
    language: 'ar',
    isApproved: true,
    rewardPoints: 75
  }
];

const sampleCategories = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    nameAr: 'الرعاية الصحية',
    nameDe: 'Gesundheitswesen',
    icon: 'Heart',
    subcategories: [
      { name: 'General Practice', nameAr: 'الطب العام', nameDe: 'Allgemeinmedizin' },
      { name: 'Cardiology', nameAr: 'طب القلب', nameDe: 'Kardiologie' },
      { name: 'Dermatology', nameAr: 'الأمراض الجلدية', nameDe: 'Dermatologie' },
      { name: 'Pediatrics', nameAr: 'طب الأطفال', nameDe: 'Pädiatrie' }
    ],
    description: 'Professional healthcare services',
    descriptionAr: 'خدمات الرعاية الصحية المهنية',
    descriptionDe: 'Professionelle Gesundheitsdienstleistungen',
    isActive: true,
    sortOrder: 1,
    color: '#EF4444'
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    nameAr: 'المطاعم',
    nameDe: 'Restaurants',
    icon: 'UtensilsCrossed',
    subcategories: [
      { name: 'Fine Dining', nameAr: 'مطاعم راقية', nameDe: 'Feinschmecker' },
      { name: 'Casual Dining', nameAr: 'مطاعم عادية', nameDe: 'Casual Dining' },
      { name: 'Fast Food', nameAr: 'الوجبات السريعة', nameDe: 'Fast Food' }
    ],
    description: 'Dining and food services',
    descriptionAr: 'خدمات الطعام والمطاعم',
    descriptionDe: 'Essen und Gastronomie',
    isActive: true,
    sortOrder: 2,
    color: '#F59E0B'
  },
  {
    id: 'education',
    name: 'Education',
    nameAr: 'التعليم',
    nameDe: 'Bildung',
    icon: 'GraduationCap',
    subcategories: [
      { name: 'Private Tutoring', nameAr: 'دروس خصوصية', nameDe: 'Nachhilfe' },
      { name: 'Language Learning', nameAr: 'تعلم اللغة', nameDe: 'Sprachunterricht' },
      { name: 'Music Lessons', nameAr: 'دروس موسيقى', nameDe: 'Musikunterricht' }
    ],
    description: 'Educational and training services',
    descriptionAr: 'خدمات التعليم والتدريب',
    descriptionDe: 'Bildungs- und Schulungsdienstleistungen',
    isActive: true,
    sortOrder: 3,
    color: '#3B82F6'
  }
];

const sampleBlogPosts = [
  {
    title: 'How to Choose the Right Doctor',
    titleAr: 'كيف تختار الطبيب المناسب لاحتياجاتك',
    titleDe: 'Wie Sie den richtigen Arzt wählen',
    content: 'Choosing the right doctor is crucial for your health...',
    contentAr: 'اختيار الطبيب المناسب أمر بالغ الأهمية لصحتك...',
    contentDe: 'Die Wahl des richtigen Arztes ist entscheidend für Ihre Gesundheit...',
    excerpt: 'Learn how to choose the right healthcare provider.',
    excerptAr: 'تعلم كيفية اختيار مقدم الرعاية الصحية المناسب.',
    excerptDe: 'Erfahren Sie, wie Sie den richtigen Gesundheitsdienstleister wählen.',
    author: 'الإدارة',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    category: 'healthcare',
    tags: ['healthcare', 'doctor', 'tips'],
    status: 'published',
    isFeatured: true,
    publishedAt: new Date('2024-07-01')
  }
];

// Main migration function
const runMigration = async () => {
  try {
    console.log('🚀 Starting ServicePro data migration...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await ServiceProvider.deleteMany({});
    await ServiceCategory.deleteMany({});
    await BlogPost.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
    
    // Create categories
    console.log('📂 Creating categories...');
    for (const categoryData of sampleCategories) {
      const category = await ServiceCategory.create(categoryData);
      console.log(`✅ Created category: ${category.nameAr} (${category.id})`);
    }
    
    // Create blog posts
    console.log('📝 Creating blog posts...');
    for (const postData of sampleBlogPosts) {
      const post = await BlogPost.create(postData);
      console.log(`✅ Created blog post: ${post.titleAr}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Users created: ${await User.countDocuments()}`);
    console.log(`- Service providers created: ${await ServiceProvider.countDocuments()}`);
    console.log(`- Categories created: ${await ServiceCategory.countDocuments()}`);
    console.log(`- Blog posts created: ${await BlogPost.countDocuments()}`);
    
    console.log('\n🔑 Default login credentials:');
    console.log('Admin: admin@servicepro.com / admin123456');
    console.log('Evaluator: evaluator@servicepro.com / evaluator123456');
    console.log('User: user1@servicepro.com / user123456');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
