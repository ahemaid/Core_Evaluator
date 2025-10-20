const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameAr: {
    type: String,
    required: true,
    trim: true
  },
  nameDe: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  subcategories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    nameAr: {
      type: String,
      required: true,
      trim: true
    },
    nameDe: {
      type: String,
      required: true,
      trim: true
    }
  }],
  description: {
    type: String,
    trim: true
  },
  descriptionAr: {
    type: String,
    trim: true
  },
  descriptionDe: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  providerCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
serviceCategorySchema.index({ isActive: 1, sortOrder: 1 });
serviceCategorySchema.index({ id: 1 });

// Method to get localized name
serviceCategorySchema.methods.getLocalizedName = function(language = 'ar') {
  const nameMap = {
    ar: this.nameAr,
    en: this.name,
    de: this.nameDe
  };
  return nameMap[language] || this.name;
};

// Method to get localized description
serviceCategorySchema.methods.getLocalizedDescription = function(language = 'ar') {
  const descMap = {
    ar: this.descriptionAr,
    en: this.description,
    de: this.descriptionDe
  };
  return descMap[language] || this.description;
};

// Method to get localized subcategories
serviceCategorySchema.methods.getLocalizedSubcategories = function(language = 'ar') {
  return this.subcategories.map(sub => ({
    name: sub[`name${language === 'ar' ? 'Ar' : language === 'de' ? 'De' : ''}`] || sub.name,
    originalName: sub.name
  }));
};

// Static method to get all active categories with localized names
serviceCategorySchema.statics.getActiveCategories = function(language = 'ar') {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('id name nameAr nameDe icon subcategories description descriptionAr descriptionDe image color providerCount');
};

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
