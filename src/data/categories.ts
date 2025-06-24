import { ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'Heart',
    subcategories: [
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Pediatrics',
      'Neurology',
      'Orthopedics',
      'Psychiatry',
      'Gynecology',
      'Ophthalmology',
      'Dentistry'
    ]
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: 'UtensilsCrossed',
    subcategories: [
      'Fine Dining',
      'Casual Dining',
      'Fast Food',
      'Italian',
      'Chinese',
      'Indian',
      'Mexican',
      'Mediterranean',
      'Vegetarian',
      'Seafood'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    subcategories: [
      'Private Tutoring',
      'Language Learning',
      'Music Lessons',
      'Art Classes',
      'Test Preparation',
      'Computer Programming',
      'Mathematics',
      'Science',
      'Literature',
      'Professional Training'
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: 'Sparkles',
    subcategories: [
      'Hair Salon',
      'Nail Salon',
      'Spa Services',
      'Massage Therapy',
      'Skincare',
      'Makeup Artist',
      'Personal Training',
      'Yoga Instruction',
      'Nutrition Counseling',
      'Mental Health Counseling'
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: 'Car',
    subcategories: [
      'Auto Repair',
      'Oil Change',
      'Tire Service',
      'Car Wash',
      'Auto Detailing',
      'Brake Service',
      'Engine Repair',
      'Transmission Repair',
      'Auto Body Repair',
      'Car Inspection'
    ]
  },
  {
    id: 'home',
    name: 'Home Services',
    icon: 'Home',
    subcategories: [
      'Plumbing',
      'Electrical',
      'HVAC',
      'Cleaning Services',
      'Landscaping',
      'Painting',
      'Carpentry',
      'Roofing',
      'Pest Control',
      'Interior Design'
    ]
  }
];

export const getCategoryIcon = (categoryId: string): string => {
  const category = serviceCategories.find(cat => cat.id === categoryId);
  return category?.icon || 'Star';
};