import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ServiceProviderCard from '../components/ServiceProviderCard';
import { mockProviders } from '../data/mockData';
import { ServiceProvider, SearchFilters } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { serviceCategories } from '../data/categories';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation(user?.language || 'en');
  const [providers, setProviders] = useState<ServiceProvider[]>(mockProviders);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    location: searchParams.get('q') || '',
    country: searchParams.get('country') || 'United States',
    priceRange: [0, 500],
    rating: 0,
    sortBy: 'rating'
  });

  const countries = [
    'United States', 'Germany', 'Saudi Arabia', 'Canada', 'United Kingdom', 
    'Australia', 'France', 'Spain', 'Italy'
  ];

  const getSubcategories = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  };

  useEffect(() => {
    // Filter and sort providers based on current filters
    let filteredProviders = [...mockProviders];

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

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBooking = (providerId: string) => {
    if (!user) {
      // Redirect to login
      return;
    }
    // Handle booking logic
    console.log('Booking provider:', providerId);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, provider name..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
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
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="waitTime">Sort by Wait Time</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!filters.category}
                  >
                    <option value="">All Subcategories</option>
                    {getSubcategories(filters.category).map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <select
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, Number(e.target.value)])}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={500}>Any Price</option>
                    <option value={50}>Under $50</option>
                    <option value={100}>Under $100</option>
                    <option value={200}>Under $200</option>
                    <option value={300}>Under $300</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      category: '',
                      subcategory: '',
                      location: '',
                      country: 'United States',
                      priceRange: [0, 500],
                      rating: 0,
                      sortBy: 'rating'
                    })}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {providers.length} Providers Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing qualified and verified providers
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