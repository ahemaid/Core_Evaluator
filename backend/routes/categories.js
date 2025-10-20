const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceCategory = require('../models/ServiceCategory');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all service categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { language = 'ar' } = req.query;
    
    const categories = await ServiceCategory.getActiveCategories(language);

    // Transform data to include localized names
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.getLocalizedName(language),
      icon: category.icon,
      subcategories: category.getLocalizedSubcategories(language),
      description: category.getLocalizedDescription(language),
      image: category.image,
      color: category.color,
      providerCount: category.providerCount
    }));

    res.json({
      success: true,
      count: transformedCategories.length,
      data: transformedCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single service category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { language = 'ar' } = req.query;
    
    const category = await ServiceCategory.findOne({ id: req.params.id, isActive: true });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const transformedCategory = {
      id: category.id,
      name: category.getLocalizedName(language),
      icon: category.icon,
      subcategories: category.getLocalizedSubcategories(language),
      description: category.getLocalizedDescription(language),
      image: category.image,
      color: category.color,
      providerCount: category.providerCount
    };

    res.json({
      success: true,
      data: transformedCategory
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create service category
// @route   POST /api/categories
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('id').trim().isLength({ min: 2 }).withMessage('Category ID is required'),
  body('name').trim().isLength({ min: 2 }).withMessage('Category name is required'),
  body('nameAr').trim().isLength({ min: 2 }).withMessage('Arabic name is required'),
  body('nameDe').trim().isLength({ min: 2 }).withMessage('German name is required'),
  body('icon').trim().isLength({ min: 1 }).withMessage('Icon is required'),
  body('subcategories').isArray({ min: 1 }).withMessage('At least one subcategory is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      id,
      name,
      nameAr,
      nameDe,
      icon,
      subcategories,
      description,
      descriptionAr,
      descriptionDe,
      image,
      color,
      sortOrder
    } = req.body;

    // Check if category ID already exists
    const existingCategory = await ServiceCategory.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category ID already exists'
      });
    }

    const category = await ServiceCategory.create({
      id,
      name,
      nameAr,
      nameDe,
      icon,
      subcategories,
      description,
      descriptionAr,
      descriptionDe,
      image,
      color,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update service category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters'),
  body('nameAr').optional().trim().isLength({ min: 2 }).withMessage('Arabic name must be at least 2 characters'),
  body('nameDe').optional().trim().isLength({ min: 2 }).withMessage('German name must be at least 2 characters'),
  body('icon').optional().trim().isLength({ min: 1 }).withMessage('Icon is required'),
  body('subcategories').optional().isArray({ min: 1 }).withMessage('At least one subcategory is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = await ServiceCategory.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updatedCategory = await ServiceCategory.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete service category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has providers
    const ServiceProvider = require('../models/ServiceProvider');
    const providerCount = await ServiceProvider.countDocuments({ category: req.params.id });
    
    if (providerCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${providerCount} service providers.`
      });
    }

    await ServiceCategory.findOneAndDelete({ id: req.params.id });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle category active status
// @route   PUT /api/categories/:id/toggle
// @access  Private (Admin only)
router.put('/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: category
    });
  } catch (error) {
    console.error('Toggle category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update category provider count
// @route   PUT /api/categories/:id/provider-count
// @access  Private (System)
router.put('/:id/provider-count', async (req, res) => {
  try {
    const ServiceProvider = require('../models/ServiceProvider');
    const providerCount = await ServiceProvider.countDocuments({ 
      category: req.params.id, 
      isActive: true, 
      isApproved: true 
    });

    const category = await ServiceCategory.findOneAndUpdate(
      { id: req.params.id },
      { providerCount },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Provider count updated successfully',
      data: { providerCount }
    });
  } catch (error) {
    console.error('Update provider count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
