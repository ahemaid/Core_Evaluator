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
      // Find the selected date info
      const selectedDateInfo = getAvailableDates().find(d => d.dayName === selectedDay);
      const appointmentDate = selectedDateInfo ? selectedDateInfo.formattedDate : selectedDay;
      
      // Create new appointment
      const newAppointment = {
        id: Date.now().toString(),
        userId: user.id,
        providerId: doctor.id,
        date: appointmentDate,
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

  // Helper: generate available calendar dates for the next 2 weeks
  function getAvailableDates() {
    const dates = [];
    const today = new Date();
    
    // Generate dates for the next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Get day name (e.g., "Monday", "Tuesday")
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Check if doctor is available on this day
      const isAvailable = availableDays.some(day => day.day === dayName);
      
      if (isAvailable) {
        dates.push({
          date: date,
          dayName: dayName,
          formattedDate: date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  }

  // Helper: generate calendar grid for current month
  function getCalendarGrid() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of current month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push({ date: null, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const isAvailable = availableDays.some(d => d.day === dayName);
      const isToday = day === today.getDate();
      const isPast = date < today;
      
      calendar.push({
        date: date,
        day: day,
        dayName: dayName,
        isCurrentMonth: true,
        isAvailable: isAvailable && !isPast,
        isToday: isToday,
        isPast: isPast,
        formattedDate: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return calendar;
  }

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
                  {/* Calendar Date Selection */}
                  <label className="font-medium mb-1">{t('common.selectDate') || 'Select Date'}</label>
                  <div className="border rounded-lg p-4 bg-white">
                    {/* Calendar Header */}
                    <div className="text-center font-semibold text-gray-800 mb-3">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
                      <div className="p-2">S</div>
                      <div className="p-2">M</div>
                      <div className="p-2">T</div>
                      <div className="p-2">W</div>
                      <div className="p-2">T</div>
                      <div className="p-2">F</div>
                      <div className="p-2">S</div>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarGrid().map((dayInfo, index) => {
                        if (!dayInfo.isCurrentMonth) {
                          return <div key={index} className="p-2"></div>;
                        }
                        
                        const isSelected = selectedDay === dayInfo.dayName;
                        const canSelect = dayInfo.isAvailable;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (canSelect) {
                                setSelectedDay(dayInfo.dayName);
                                setSelectedSlot('');
                              }
                            }}
                            disabled={!canSelect}
                            className={`p-2 text-sm rounded transition-colors ${
                              !canSelect
                                ? 'text-gray-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : dayInfo.isToday
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            title={dayInfo.formattedDate}
                          >
                            {dayInfo.day}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Selected Date Display */}
                    {selectedDay && (
                      <div className="mt-3 text-sm text-gray-600 text-center p-2 bg-blue-50 rounded">
                        Selected: {getAvailableDates().find(d => d.dayName === selectedDay)?.formattedDate}
                      </div>
                    )}
                    
                    {/* Legend */}
                    <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-100 rounded"></div>
                        <span>Today</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span>Unavailable</span>
                      </div>
                    </div>
                  </div>
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