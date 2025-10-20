// Temporary mock data for components that haven't been updated to use API yet
// TODO: Update all components to use API service instead

export const serviceCategories = [
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

export const blogs = [
  {
    id: '1',
    title: 'كيف تختار الطبيب المناسب لاحتياجاتك',
    content: 'اختيار الطبيب المناسب أمر بالغ الأهمية لصحتك. في هذا المقال، نناقش العوامل الرئيسية التي يجب مراعاتها، بما في ذلك المؤهلات، والتقييمات، وأسلوب التواصل...',
    author: 'الإدارة',
    date: '2024-07-01',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'أهمية الفحوصات الصحية الدورية',
    content: 'الفحوصات الصحية الدورية تساعد في اكتشاف المشاكل مبكرًا وتحسين فرص العلاج والشفاء. تعرف على أهمية عدم إهمال الفحص السنوي...',
    author: 'د. منى خالد',
    date: '2024-07-03',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'فهم تقييمات ومراجعات الأطباء',
    content: 'تقييمات ومراجعات الأطباء أداة مفيدة عند اختيار مقدم الخدمة. تعرف كيف تفسرها وما الذي يجب البحث عنه...',
    author: 'الإدارة',
    date: '2024-07-05',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  },
];

// Minimal mock data for components that need it
export const mockProviders = [
  {
    id: '1',
    name: 'د. أيمن الخطيب',
    email: 'ayman.khatib@email.com',
    phone: '+962-6-555-0123',
    category: 'healthcare',
    subcategory: 'طب القلب',
    location: 'عمان، الأردن',
    country: 'Jordan',
    experience: 14,
    rating: 4.9,
    reviewCount: 212,
    price: 180,
    priceUnit: 'لكل زيارة',
    waitTime: '2-3 أيام',
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    badges: ['أفضل نظافة', 'الأعلى تقييماً'],
    isVerified: true,
    isActive: true,
    bio: 'طبيب قلب ذو خبرة في عمان متخصص في أمراض القلب والوقاية منها.',
    credentials: ['جامعة الأردن', 'إقامة مستشفى الأردن'],
    languages: ['العربية'],
    serviceHours: 'الأحد-الخميس 9ص-5م',
    availability: [
      { day: 'Sunday', start: '09:00', end: '17:00' },
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ]
  },
  {
    id: '2',
    name: 'د. فاطمة أحمد',
    email: 'fatima.ahmed@email.com',
    phone: '+962-6-555-0124',
    category: 'healthcare',
    subcategory: 'طب الأطفال',
    location: 'إربد، الأردن',
    country: 'Jordan',
    experience: 8,
    rating: 4.8,
    reviewCount: 156,
    price: 120,
    priceUnit: 'لكل زيارة',
    waitTime: '1-2 أيام',
    photo: 'https://images.pexels.com/photos/5327586/pexels-photo-5327586.jpeg?auto=compress&cs=tinysrgb&w=400',
    badges: ['متخصصة في الأطفال'],
    isVerified: true,
    isActive: true,
    bio: 'طبيبة أطفال متخصصة في رعاية الأطفال حديثي الولادة والمراهقين.',
    credentials: ['جامعة العلوم والتكنولوجيا', 'مستشفى الملكة علياء'],
    languages: ['العربية', 'English'],
    serviceHours: 'السبت-الأربعاء 8ص-4م',
    availability: [
      { day: 'Saturday', start: '08:00', end: '16:00' },
      { day: 'Sunday', start: '08:00', end: '16:00' },
      { day: 'Monday', start: '08:00', end: '16:00' },
      { day: 'Tuesday', start: '08:00', end: '16:00' },
      { day: 'Wednesday', start: '08:00', end: '16:00' },
    ]
  }
];

export const mockAppointments = [
  {
    id: '1',
    userId: '68f56f4e3c8cc89bff73e820',
    providerId: '1',
    date: '2024-01-15',
    time: '10:00 ص',
    status: 'confirmed',
    notes: 'فحص دوري',
    hasReview: false,
    hasReceipt: true,
    serviceType: 'استشارة طب القلب'
  },
  {
    id: '2',
    userId: '68f56f4e3c8cc89bff73e820',
    providerId: '2',
    date: '2024-01-10',
    time: '2:00 م',
    status: 'completed',
    notes: 'فحص أطفال',
    hasReview: false,
    hasReceipt: false,
    serviceType: 'فحص طبي للأطفال'
  },
  {
    id: '3',
    userId: '68f56f4e3c8cc89bff73e820',
    providerId: '1',
    date: '2024-01-08',
    time: '11:00 ص',
    status: 'completed',
    notes: 'استشارة قلب',
    hasReview: true,
    hasReceipt: false,
    serviceType: 'استشارة طب القلب'
  }
];