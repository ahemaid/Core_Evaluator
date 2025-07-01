import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ServiceProviderCard from '../components/ServiceProviderCard';
import { mockProviders, mockAppointments as initialMockAppointments } from '../data/mockData';
import { ServiceProvider, SearchFilters, Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { serviceCategories } from '../data/categories';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ServiceProvider[]>(mockProviders);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    location: searchParams.get('q') || '',
    country: searchParams.get('country') || 'Jordan',
    priceRange: [0, 500],
    rating: 0,
    sortBy: 'rating'
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) return JSON.parse(stored);
    return initialMockAppointments;
  });

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

  const [selectedCity, setSelectedCity] = useState('');

  const getSubcategories = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  };

  useEffect(() => {
    // Filter and sort providers based on current filters
    let filteredProviders = [...mockProviders];

    // Hide unapproved providers
    filteredProviders = filteredProviders.filter(provider => provider.isApproved !== false);

    if (filters.category) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.category === filters.category
      );
    }

    if (filters.subcategory) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())
      );
    }

    if (filters.location) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.country) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.country === filters.country
      );
    }

    if (filters.rating > 0) {
      filteredProviders = filteredProviders.filter(provider => provider.rating >= filters.rating);
    }

    filteredProviders = filteredProviders.filter(provider => 
      provider.price >= filters.priceRange[0] && provider.price <= filters.priceRange[1]
    );

    // Sort providers
    filteredProviders.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'waitTime':
          return a.waitTime.localeCompare(b.waitTime);
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });

    setProviders(filteredProviders);
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBooking = (providerId: string, bookingDate?: Date) => {
    if (!user) {
      // Redirect to login
      return;
    }
    if (!bookingDate) return;
    const provider = mockProviders.find(p => p.id === providerId);
    if (!provider) return;
    // Format date and time
    const dateStr = bookingDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const timeStr = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      userId: user.id,
      providerId: provider.id,
      date: dateStr,
      time: timeStr,
      status: 'confirmed',
      notes: '',
      hasReview: false,
      hasReceipt: false,
      serviceType: provider.subcategory,
    };
    setAppointments(prev => [...prev, newAppointment]);
    // Optionally show a toast/alert here
  };

  // Helper function for city key
  function getCityKey(city: string) {
    switch (city) {
      case 'عمان': return 'Amman';
      case 'إربد': return 'Irbid';
      case 'الزرقاء': return 'Zarqa';
      case 'الجزائر العاصمة': return 'Algiers';
      case 'وهران': return 'Oran';
      case 'قسنطينة': return 'Constantine';
      case 'القاهرة': return 'Cairo';
      case 'برلين': return 'Berlin';
      default: return city;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            {/* Removed input for city text search */}

            {/* Quick Filters */}
            <div className="flex gap-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('common.allCategories')}</option>
                {serviceCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {t(`category.${category.id}`)}
                  </option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">{t('common.sortByRating')}</option>
                <option value="price">{t('common.sortByPrice')}</option>
                <option value="waitTime">{t('common.sortByWaitTime')}</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>{t('common.filters')}</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.country')}</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{t(country.label)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.city')}</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('common.selectCity')}</option>
                    {(citiesByCountry[filters.country] || []).map(city => (
                      <option key={city} value={city}>{t(`city.${getCityKey(city)}`)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.category')}</label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!filters.category}
                  >
                    <option value="">{t('common.allSubcategories')}</option>
                    {getSubcategories(filters.category).map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.minRating')}</label>
                  <Select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    fullWidth
                    displayEmpty
                    size="small"
                    sx={{ backgroundColor: 'white', borderRadius: 2 }}
                  >
                    <MenuItem value={0}>{t('common.anyRating')}</MenuItem>
                    <MenuItem value={4}>
                      <span style={{ color: '#FFD700', fontSize: '1.1em', display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarBorderIcon fontSize="small" />
                      </span>
                      <span style={{ marginLeft: 8 }}>4+</span>
                    </MenuItem>
                    <MenuItem value={4.5}>
                      <span style={{ color: '#FFD700', fontSize: '1.1em', display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarHalfIcon fontSize="small" />
                      </span>
                      <span style={{ marginLeft: 8 }}>4.5+</span>
                    </MenuItem>
                    <MenuItem value={4.8}>
                      <span style={{ color: '#FFD700', fontSize: '1.1em', display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                        <StarIcon fontSize="small" />
                      </span>
                      <span style={{ marginLeft: 8 }}>4.8+</span>
                    </MenuItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.maxPrice')}</label>
                  <select
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, Number(e.target.value)])}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={500}>{t('common.anyPrice')}</option>
                    <option value={50}>{t('common.under50')}</option>
                    <option value={100}>{t('common.under100')}</option>
                    <option value={200}>{t('common.under200')}</option>
                    <option value={300}>{t('common.under300')}</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      category: '',
                      subcategory: '',
                      location: '',
                      country: 'Jordan',
                      priceRange: [0, 500],
                      rating: 0,
                      sortBy: 'rating'
                    })}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('common.clearFilters')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {providers.length} {t('common.providersFound')}
          </h2>
          <div className="text-sm text-gray-600">
            {t('common.showingQualifiedProviders')}
          </div>
        </div>

        {/* Provider Cards */}
        <div className="space-y-6">
          {providers.map(provider => (
            <ServiceProviderCard
              key={provider.id}
              provider={provider}
              onBook={handleBooking}
              showFullDetails={!!user}
            />
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;