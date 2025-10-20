const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  titleAr: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  titleDe: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  contentAr: {
    type: String,
    required: true,
    maxlength: 10000
  },
  contentDe: {
    type: String,
    required: true,
    maxlength: 10000
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  excerptAr: {
    type: String,
    maxlength: 500
  },
  excerptDe: {
    type: String,
    maxlength: 500
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['healthcare', 'lifestyle', 'tips', 'news', 'education', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  publishedAt: {
    type: Date
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ isFeatured: 1, publishedAt: -1 });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ viewCount: -1 });

// Pre-save middleware to generate slug
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Method to get localized title
blogPostSchema.methods.getLocalizedTitle = function(language = 'ar') {
  const titleMap = {
    ar: this.titleAr,
    en: this.title,
    de: this.titleDe
  };
  return titleMap[language] || this.title;
};

// Method to get localized content
blogPostSchema.methods.getLocalizedContent = function(language = 'ar') {
  const contentMap = {
    ar: this.contentAr,
    en: this.content,
    de: this.contentDe
  };
  return contentMap[language] || this.content;
};

// Method to get localized excerpt
blogPostSchema.methods.getLocalizedExcerpt = function(language = 'ar') {
  const excerptMap = {
    ar: this.excerptAr,
    en: this.excerpt,
    de: this.excerptDe
  };
  return excerptMap[language] || this.excerpt;
};

// Method to increment view count
blogPostSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get published posts
blogPostSchema.statics.getPublishedPosts = function(language = 'ar', limit = 10, skip = 0) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('title titleAr titleDe excerpt excerptAr excerptDe author image category tags publishedAt viewCount likeCount slug');
};

// Static method to get featured posts
blogPostSchema.statics.getFeaturedPosts = function(language = 'ar', limit = 5) {
  return this.find({ status: 'published', isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title titleAr titleDe excerpt excerptAr excerptDe author image category tags publishedAt viewCount likeCount slug');
};

module.exports = mongoose.model('BlogPost', blogPostSchema);
