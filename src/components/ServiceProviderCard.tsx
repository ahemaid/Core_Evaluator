import React from 'react';
import { Star, MapPin, Clock, Award, Phone, Globe, UtensilsCrossed, GraduationCap, Sparkles, Car, Home, Heart } from 'lucide-react';
import { ServiceProvider } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onBook?: (providerId: string) => void;
  showFullDetails?: boolean;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, onBook, showFullDetails = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleBooking = () => {
    if (onBook) {
      onBook(provider.id);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      healthcare: Heart,
      restaurants: UtensilsCrossed,
      education: GraduationCap,
      beauty: Sparkles,
      automotive: Car,
      home: Home
    };
    const IconComponent = icons[category as keyof typeof icons] || Star;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Provider Photo */}
          <div className="relative">
            <img
              src={provider.photo}
              alt={provider.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            {provider.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Provider Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {provider.name}
                </h3>
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  {getCategoryIcon(provider.category)}
                  <span>{provider.subcategory}</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{provider.location}</span>
                </div>
              </div>
              
              {showFullDetails && user && (
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{provider.phone}</span>
                  </div>
                  {provider.website && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <Globe className="h-4 w-4" />
                      <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">{provider.rating}</span>
                <span className="text-sm text-gray-500">({provider.reviewCount} {t('common.reviews')})</span>
              </div>
              
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{provider.waitTime}</span>
              </div>
            </div>

            {/* Service Hours */}
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Hours:</span> {provider.serviceHours}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {provider.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Price and Booking */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-2xl font-bold text-gray-900">
                ${provider.price}
                <span className="text-sm font-normal text-gray-500">/{provider.priceUnit}</span>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={!user}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? t('common.bookNow') : t('common.loginToBook')}
              </button>
            </div>

            {showFullDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm mb-3">{provider.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                    <p className="text-gray-600">{provider.experience} years</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Languages</h4>
                    <p className="text-gray-600">{provider.languages.join(', ')}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-1">Credentials</h4>
                    <ul className="text-gray-600 space-y-1">
                      {provider.credentials.map((credential, index) => (
                        <li key={index}>• {credential}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderCard;