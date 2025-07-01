import React from 'react';
import { Star, MapPin, Clock, Award, Phone } from 'lucide-react';
import type { ServiceProvider } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';

interface DoctorCardProps {
  doctor: ServiceProvider;
  onBook?: (doctorId: string) => void;
  showFullDetails?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, showFullDetails = false }) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();

  const handleBooking = () => {
    if (onBook) {
      onBook(doctor.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-4 sm:p-6">
        <div className={language === 'ar' ? 'flex flex-col sm:flex-row-reverse items-start sm:items-center gap-4 sm:gap-6' : 'flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'}>
          {/* Doctor Photo */}
          <div className="relative">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            {doctor.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className={language === 'ar' ? 'flex-1 min-w-0 text-right' : 'flex-1 min-w-0'}>
            <div className={language === 'ar' ? 'flex items-start justify-start flex-row-reverse' : 'flex items-start justify-between'}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium">{doctor.subcategory}</p>
                <div className={language === 'ar' ? 'flex items-center space-x-1 space-x-reverse mt-1 justify-end' : 'flex items-center space-x-1 mt-1'}>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{doctor.location}</span>
                </div>
              </div>
              {showFullDetails && user && (
                <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                  <div className={language === 'ar' ? 'flex items-center space-x-1 space-x-reverse text-sm text-gray-600 justify-end' : 'flex items-center space-x-1 text-sm text-gray-600'}>
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className={language === 'ar' ? 'flex items-center space-x-4 space-x-reverse mt-3 justify-end' : 'flex items-center space-x-4 mt-3'}>
              <div className={language === 'ar' ? 'flex items-center space-x-1 space-x-reverse' : 'flex items-center space-x-1'}>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">{doctor.rating}</span>
                <span className="text-sm text-gray-500">({doctor.reviewCount} reviews)</span>
              </div>
              <div className={language === 'ar' ? 'flex items-center space-x-1 space-x-reverse text-sm text-gray-600' : 'flex items-center space-x-1 text-sm text-gray-600'}>
                <Clock className="h-4 w-4" />
                <span>{doctor.waitTime}</span>
              </div>
            </div>

            {/* Badges */}
            <div className={language === 'ar' ? 'flex flex-wrap gap-2 mt-3 justify-end' : 'flex flex-wrap gap-2 mt-3'}>
              {doctor.badges.map((badge: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Price and Booking */}
            <div className={language === 'ar' ? 'flex items-center justify-start mt-4 flex-row-reverse' : 'flex items-center justify-between mt-4'}>
              <div className="text-2xl font-bold text-gray-900">
                ${doctor.price}
                <span className="text-sm font-normal text-gray-500">/visit</span>
              </div>
              <button
                onClick={handleBooking}
                disabled={!user}
                className={
                  (language === 'ar'
                    ? 'ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed')
                }
              >
                {user ? 'Book Now' : 'Login to Book'}
              </button>
            </div>

            {showFullDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className={language === 'ar' ? 'text-gray-600 text-sm mb-3 text-right' : 'text-gray-600 text-sm mb-3'}>{doctor.bio}</p>
                
                <div className={language === 'ar' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-right' : 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'}>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                    <p className="text-gray-600">{doctor.experience} years</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Languages</h4>
                    <p className="text-gray-600">{doctor.languages.join(', ')}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-1">Credentials</h4>
                    <ul className="text-gray-600 space-y-1">
                      {doctor.credentials.map((cred: string, index: number) => (
                        <li key={index}>• {cred}</li>
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

export default DoctorCard;