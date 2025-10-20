import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Award, Shield, ArrowRight, Heart, UtensilsCrossed, GraduationCap, Sparkles, Car, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { categoriesApi, blogPostsApi, ServiceCategory, BlogPost } from '../services/api';

const HomePageWithAPI: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Jordan');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [providersCount, setProvidersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  
  // API data states
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCountry) params.set('country', selectedCountry);
    
    navigate(`/search?${params.toString()}`);
  };

  const countries = [
    { value: 'Jordan', label: 'country.Jordan' },
    { value: 'Algeria', label: 'country.Algeria' },
    { value: 'Egypt', label: 'country.Egypt' },
    { value: 'Germany', label: 'country.Germany' }
  ];

  const citiesByCountry: { [key: string]: string[] } = {
    Jordan: ['عمان', 'إربد', 'الزرقاء'],
    Algeria: ['الجزائر العاصمة', 'وهران', 'قسنطينة'],
    Egypt: ['القاهرة'],
    Germany: ['برلين']
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      Heart,
      UtensilsCrossed,
      GraduationCap,
      Sparkles,
      Car,
      Home
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories and blog posts in parallel
        const [categoriesResponse, blogPostsResponse] = await Promise.all([
          categoriesApi.getAll(user?.language || 'ar'),
          blogPostsApi.getFeatured(3, user?.language || 'ar')
        ]);

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        if (blogPostsResponse.success && blogPostsResponse.data) {
          setBlogPosts(blogPostsResponse.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.language]);

  // Animated counters effect
  useEffect(() => {
    let providersTarget = 25000;
    let customersTarget = 100000;
    let ratingTarget = 4.9;
    let providersStep = Math.ceil(providersTarget / 60);
    let customersStep = Math.ceil(customersTarget / 60);
    let ratingStep = 0.1;
    
    let providersInterval = setInterval(() => {
      setProvidersCount(prev => {
        if (prev + providersStep >= providersTarget) {
          clearInterval(providersInterval);
          return providersTarget;
        }
        return prev + providersStep;
      });
    }, 20);
    
    let customersInterval = setInterval(() => {
      setCustomersCount(prev => {
        if (prev + customersStep >= customersTarget) {
          clearInterval(customersInterval);
          return customersTarget;
        }
        return prev + customersStep;
      });
    }, 20);
    
    let ratingInterval = setInterval(() => {
      setRating(prev => {
        if (prev + ratingStep >= ratingTarget) {
          clearInterval(ratingInterval);
          return ratingTarget;
        }
        return +(prev + ratingStep).toFixed(1);
      });
    }, 40);
    
    return () => {
      clearInterval(providersInterval);
      clearInterval(customersInterval);
      clearInterval(ratingInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('home.title').split(' ').map((word, index) => 
                word === 'Qualified' ? (
                  <span key={index} className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {word}{' '}
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl md:max-w-3xl mx-auto mb-6 md:mb-8">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl md:max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Country Selection */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">{t('home.country')}</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{t(country.label)}</option>
                    ))}
                  </select>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">{t('home.category')}</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">{t('common.allCategories')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">اختر المدينة</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">اختر المدينة</option>
                    {(citiesByCountry[selectedCountry] || []).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="text-xs sm:text-sm font-medium text-transparent">{t('home.search')}</label>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Search className="h-5 w-5" />
                    <span>{t('home.search')}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              {t('home.browseByCategory')}
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl md:max-w-3xl mx-auto">
              {t('home.categorySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map(category => {
              const IconComponent = getCategoryIcon(category.icon);
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/search?category=${category.id}`)}
                  className="group p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-xs sm:text-base">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{category.providerCount} providers</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              {t('home.whyChoose')}
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl md:max-w-3xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Verified Providers */}
            <div className="text-center group p-4 md:p-0">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg transition-shadow">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">{t('features.verifiedProviders')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('features.verifiedProvidersDesc')}
              </p>
            </div>

            {/* Transparent Reviews */}
            <div className="text-center group p-4 md:p-0">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg transition-shadow">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">{t('features.transparentReviews')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('features.transparentReviewsDesc')}
              </p>
            </div>

            {/* Expert Evaluations */}
            <div className="text-center group p-4 md:p-0">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg transition-shadow">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">{t('features.expertEvaluations')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('features.expertEvaluationsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">{providersCount.toLocaleString()}+</div>
              <div className="text-lg">{t('home.stats.verifiedProviders').replace(/^\s*\d{1,3}(,\d{3})*\+?\s*/, '')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{customersCount.toLocaleString()}+</div>
              <div className="text-lg">{t('home.stats.happyCustomers').replace(/^\s*\d{1,3}(,\d{3})*\+?\s*/, '')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{rating}</div>
              <div className="text-lg">{t('home.stats.averageRating').replace(/\d+(\.\d+)?/, '')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">{t('home.stats.supportAvailable').replace('24/7 ', '')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>{t('home.startSearching')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              {t('home.createAccount')}
            </button>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              {t('home.latestBlogs')}
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl md:max-w-3xl mx-auto">
              {t('home.latestBlogsDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogPosts.map(blog => (
              <Link to={`/blog/${blog.slug}`} key={blog.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{blog.author}</span>
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{blog.viewCount} views</span>
                    <span>{blog.likeCount} likes</span>
                  </div>
                  <span className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm text-center cursor-pointer">
                    {t('home.readMore')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageWithAPI;
