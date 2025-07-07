import React from 'react';
import { Star, MapPin, Clock, Award, Phone, Globe, UtensilsCrossed, GraduationCap, Sparkles, Car, Home, Heart } from 'lucide-react';
import { ServiceProvider } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';
import { format, addMinutes, isSameDay, setHours, setMinutes } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onBook?: (providerId: string) => void;
  showFullDetails?: boolean;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, onBook, showFullDetails = false }) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const isRTL = language === 'ar';

  // Helper: get available days from provider
  const availableDays = provider.availability || [];

  // Helper: generate time slots for a given day
  function getTimeSlots(day: string) {
    const slot = availableDays.find(d => d.day === day);
    if (!slot) return [];
    const slots = [];
    let [startHour, startMinute] = slot.start.split(':').map(Number);
    let [endHour, endMinute] = slot.end.split(':').map(Number);
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);
    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);
    while (current <= end) {
      slots.push(format(new Date(current), 'HH:mm'));
      current = addMinutes(new Date(current), 30);
    }
    return slots;
  }

  const handleBooking = () => {
    if (user) {
      setBookingOpen(true);
    } else if (onBook) {
      onBook(provider.id);
    }
  };

  const handleClose = () => {
    setBookingOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDay('');
    setSelectedSlot('');
  };

  const handleConfirm = () => {
    if (selectedDay && selectedSlot && user) {
      // Create new appointment
      const newAppointment = {
        id: Date.now().toString(),
        userId: user.id,
        providerId: provider.id,
        date: selectedDay,
        time: selectedSlot,
        status: 'confirmed',
        notes: '',
        hasReview: false,
        hasReceipt: false,
        serviceType: provider.subcategory,
      };
      // Save to localStorage
      const stored = localStorage.getItem('appointments');
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      toast.success(t('common.bookingSuccess') || 'Booking successful!');
      handleClose();
    } else {
      toast.error(t('common.bookingError') || 'Please select a day and time.');
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

  // RTL-aware class helper
  const rtlClass = (ltrClass: string, rtlClass: string) => isRTL ? rtlClass : ltrClass;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 sm:p-6">
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          {/* Provider Photo */}

          <div className={`relative ${isRTL ? 'order-2 pl-4' : ''}`}>
  <img
    src={provider.photo}
    alt={provider.name}
    className="w-20 h-20 rounded-xl object-cover"
  />
  {provider.isVerified && (
    <div className={`absolute -top-1 bg-green-500 rounded-full p-1 ${isRTL ? '-left-1' : '-right-1'}`}>
      <Award className="h-3 w-3 text-white" />
    </div>
  )}
</div>

          {/* Provider Info */}
          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start ${isRTL ? 'justify-start' : 'justify-between'}`}>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {provider.name}
                </h3>
                
                {/* Category with proper RTL spacing */}
                <div className={`flex items-center font-medium text-blue-600 mt-1 ${isRTL ? 'flex-row-reverse gap-x-2 justify-end' : 'gap-x-2'}`}>
                  {getCategoryIcon(provider.category)}
                  <span>{provider.subcategory}</span>
                </div>
                
                {/* Location with proper RTL spacing */}
                <div className={`flex items-center mt-1 ${isRTL ? 'flex-row-reverse gap-x-1 justify-end' : 'gap-x-1'}`}>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{provider.location}</span>
                </div>
              </div>
              
              {/* Contact info for full details */}
              {showFullDetails && user && (
                <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0`}>
                  <div className={`flex items-center text-sm text-gray-600 ${isRTL ? 'flex-row-reverse gap-x-1 justify-end' : 'gap-x-1'}`}>
                    <Phone className="h-4 w-4" />
                    <span>{provider.phone}</span>
                  </div>
                  {provider.website && (
                    <div className={`flex items-center text-sm text-gray-600 mt-1 ${isRTL ? 'flex-row-reverse gap-x-1 justify-end' : 'gap-x-1'}`}>
                      <Globe className="h-4 w-4" />
                      <a 
                        href={`https://${provider.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-blue-600"
                      >
                        {isRTL ? 'الموقع الإلكتروني' : 'Website'}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className={`flex items-center mt-3 ${isRTL ? 'flex-row-reverse gap-x-4 justify-end' : 'gap-x-4'}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse gap-x-1' : 'gap-x-1'}`}>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">{provider.rating}</span>
                <span className="text-sm text-gray-500">({provider.reviewCount} {t('common.reviews')})</span>
              </div>
              
              <div className={`flex items-center text-sm text-gray-600 ${isRTL ? 'flex-row-reverse gap-x-1' : 'gap-x-1'}`}>
                <Clock className="h-4 w-4" />
                <span>{provider.waitTime}</span>
              </div>
            </div>

            {/* Service Hours */}
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{t('common.hours')}</span>
              <span className={isRTL ? 'mr-1' : 'ml-1'}>{provider.serviceHours}</span>
            </div>

            {/* Badges with RTL-aware layout */}
            <div className={`flex flex-wrap gap-2 mt-3 }`}>
              {provider.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {badge}
                </span>
              ))}
            </div>


{/* Price and Booking with proper RTL layout */}
<div className={`flex items-center mt-4 ${isRTL ? 'justify-between' : 'justify-between'}`}>
  {/* Button - always on the right side for RTL, left side for LTR */}
  <button
    onClick={handleBooking}
    disabled={!user}
    className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'order-2' : 'order-2'}`}
  >
    {user ? t('common.bookNow') : t('common.loginToBook')}
  </button>
  
  {/* Price - always on the left side for RTL, right side for LTR */}
  <div className={`text-2xl font-bold text-gray-900 ${isRTL ? 'order-1' : 'order-1'}`}>
    {isRTL && <span className="text-sm font-normal text-gray-500">/{provider.priceUnit}</span>}
    <span className={isRTL ? 'mr-1' : ''}>${provider.price}</span>
    {!isRTL && <span className="text-sm font-normal text-gray-500">/{provider.priceUnit}</span>}
  </div>
</div>

            {/* Extended details section */}
            {showFullDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm mb-3">{provider.bio}</p>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {isRTL ? 'الخبرة' : 'Experience'}
                    </h4>
                    <p className="text-gray-600">
                      {provider.experience} {isRTL ? 'سنوات' : 'years'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {isRTL ? 'اللغات' : 'Languages'}
                    </h4>
                    <p className="text-gray-600">{provider.languages.join(', ')}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {isRTL ? 'الشهادات' : 'Credentials'}
                    </h4>
                    <ul className="text-gray-600 space-y-1">
                      {provider.credentials.map((credential, index) => (
                        <li key={index} className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? '• ' : '• '}{credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal with RTL support */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog 
          open={bookingOpen} 
          onClose={handleClose}
          PaperProps={{
            dir: isRTL ? 'rtl' : 'ltr',
            style: { direction: isRTL ? 'rtl' : 'ltr' }
          }}
        >
          <DialogTitle style={{ textAlign: isRTL ? 'right' : 'left' }}>
            {t('common.bookNow')}
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-col gap-4 mt-2" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              {/* Day selection */}
              <label className="font-medium mb-1">{t('common.selectDay')}</label>
              <select
                value={selectedDay}
                onChange={e => {
                  setSelectedDay(e.target.value);
                  setSelectedSlot('');
                }}
                className="p-2 border rounded-lg"
              >
                <option value="">{t('common.selectDay')}</option>
                {availableDays.map(day => (
                  <option key={day.day} value={day.day}>{t('common.' + day.day.toLowerCase())}</option>
                ))}
              </select>
              {/* Time slot selection */}
              {selectedDay && (
                <>
                  <label className="font-medium mb-1">{t('common.selectTime')}</label>
                  <select
                    value={selectedSlot}
                    onChange={e => setSelectedSlot(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">{t('common.selectTime')}</option>
                    {getTimeSlots(selectedDay).map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
            <Button onClick={handleClose}>
              {t('common.cancel') || (isRTL ? 'إلغاء' : 'Cancel')}
            </Button>
            <Button 
              onClick={() => {
                if (selectedDay && selectedSlot) handleConfirm();
              }} 
              disabled={!selectedDay || !selectedSlot} 
              variant="contained"
            >
              {t('common.confirm') || (isRTL ? 'تأكيد' : 'Confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      <ToastContainer position={isRTL ? 'top-left' : 'top-right'} rtl={isRTL} />
    </div>
  );
};

export default ServiceProviderCard;