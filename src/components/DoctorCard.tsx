import React from 'react';
import { Star, MapPin, Clock, Award, Phone } from 'lucide-react';
import type { ServiceProvider } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { format, addMinutes } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DoctorCardProps {
  doctor: ServiceProvider;
  onBook?: (doctorId: string) => void;
  showFullDetails?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, showFullDetails = false }) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState('');
  const [selectedSlot, setSelectedSlot] = React.useState('');

  const handleBooking = () => {
    if (user) {
      setBookingOpen(true);
    } else if (onBook) {
      onBook(doctor.id);
    }
  };

  const handleClose = () => {
    setBookingOpen(false);
    setSelectedDay('');
    setSelectedSlot('');
  };

  const handleConfirm = () => {
    if (selectedDay && selectedSlot && user) {
      // Create new appointment
      const newAppointment = {
        id: Date.now().toString(),
        userId: user.id,
        providerId: doctor.id,
        date: selectedDay,
        time: selectedSlot,
        status: 'confirmed',
        notes: '',
        hasReview: false,
        hasReceipt: false,
        serviceType: doctor.subcategory,
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

  const availableDays = doctor.availability || [];

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
            <div className={language === 'ar' ? 'flex items-start justify-start' : 'flex items-start justify-between'}>
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
            <div className={language === 'ar' ? 'flex flex-row-reverse items-center justify-start mt-4 gap-4' : 'flex flex-row items-center justify-between mt-4 gap-4'}>
              <div className="text-2xl font-bold text-gray-900">
                ${doctor.price}
                <span className="text-sm font-normal text-gray-500">/visit</span>
              </div>
              <button
                onClick={handleBooking}
                disabled={!user}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? t('common.bookNow') : t('common.loginToBook')}
              </button>
            </div>

            {/* Booking Modal */}
            <Dialog
              open={bookingOpen}
              onClose={handleClose}
              PaperProps={{
                dir: language === 'ar' ? 'rtl' : 'ltr',
                style: { direction: language === 'ar' ? 'rtl' : 'ltr' }
              }}
            >
              <DialogTitle style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                {t('common.bookNow')}
              </DialogTitle>
              <DialogContent>
                <div className="flex flex-col gap-4 mt-2" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
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
              <DialogActions style={{ justifyContent: language === 'ar' ? 'flex-start' : 'flex-end' }}>
                <Button onClick={handleClose}>
                  {t('common.cancel') || (language === 'ar' ? 'إلغاء' : 'Cancel')}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedDay || !selectedSlot}
                  variant="contained"
                >
                  {t('common.confirm') || (language === 'ar' ? 'تأكيد' : 'Confirm')}
                </Button>
              </DialogActions>
            </Dialog>
            {/* End Booking Modal */}

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
      <ToastContainer position={language === 'ar' ? 'top-left' : 'top-right'} rtl={language === 'ar'} />
    </div>
  );
};

export default DoctorCard;