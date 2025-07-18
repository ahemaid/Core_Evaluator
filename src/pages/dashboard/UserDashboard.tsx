import React, { useState, useEffect } from 'react';
import { Calendar, Star, Award, Receipt, Clock, MapPin, Phone } from 'lucide-react';
import { mockAppointments, mockProviders } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../utils/translations';
import { Appointment } from '../../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) return JSON.parse(stored);
    return mockAppointments;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('appointments');
      if (stored) setAppointments(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const userAppointments = appointments.filter((apt: Appointment) => apt.userId === user?.id);
  const upcomingAppointments = userAppointments.filter((apt: Appointment) => apt.status === 'confirmed');
  const completedAppointments = userAppointments.filter((apt: Appointment) => apt.status === 'completed');

  const getProviderById = (providerId: string) => {
    return mockProviders.find(provider => provider.id === providerId);
  };

  const handleCancel = (id: string) => {
    const updated = appointments.map((apt: Appointment) =>
      apt.id === id ? { ...apt, status: 'cancelled' as 'cancelled' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const handleComplete = (id: string) => {
    const updated = appointments.map((apt: Appointment) =>
      apt.id === id ? { ...apt, status: 'completed' as 'completed' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    if (user) {
      updateUser({ rewardPoints: user.rewardPoints + 10 });
      toast.success(t('dashboard.completedToast') || '+10 points for completing an appointment!');
    }
  };

  const handleReview = (id: string) => {
    const updated = appointments.map((apt: Appointment) =>
      apt.id === id ? { ...apt, hasReview: true } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    if (user) {
      updateUser({ rewardPoints: user.rewardPoints + 5 });
      toast.success(t('dashboard.reviewToast') || '+5 points for leaving a review!');
    }
  };

  const handleReceiptUpload = async (file: File, appointmentId: string) => {
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('appointmentId', appointmentId);
    try {
      const response = await fetch('http://localhost:4000/upload-receipt', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      // Update appointment with receiptUrl and hasReceipt
      const updated = appointments.map((apt: Appointment) =>
        apt.id === appointmentId
          ? { ...apt, hasReceipt: true, receiptUrl: data.fileUrl }
          : apt
      );
      setAppointments(updated);
      localStorage.setItem('appointments', JSON.stringify(updated));
      if (user) {
        updateUser({ rewardPoints: user.rewardPoints + 3 });
      }
      toast.success(t('dashboard.receiptToast') || '+3 points for uploading a receipt!');
    } catch (err) {
      toast.error('Failed to upload receipt');
    }
  };

  const tabs = [
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'rewards', label: 'Rewards', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold text-gray-900${language === 'ar' ? ' mr-4' : ''}`}>{t('dashboard.welcome')}{user?.name ? `, ${user.name}` : ''}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{t('dashboard.manageAppointments')}</p>
            </div>
            <div className={language === 'ar' ? 'flex items-center gap-x-4 md:gap-x-6 mr-4' : 'flex items-center space-x-2 md:space-x-4'}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">{t('dashboard.upcoming')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{completedAppointments.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">{t('dashboard.completed')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">{user?.rewardPoints}</div>
                <div className="text-xs sm:text-sm text-gray-600">{t('common.points')}</div>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'provider' && (
          <div className="mb-6">
            {user.isApproved === 'pending' ? (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-center">
                Your application is pending approval.
              </div>
            ) : user.isApproved === true ? (
              <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-center">
                Your application has been approved!
              </div>
            ) : user.isApproved === 'rejected' ? (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-center">
                Your application was rejected. Please review and resubmit.
              </div>
            ) : null}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100 overflow-x-auto">
            <nav className={language === 'ar' ? 'flex gap-x-4 md:gap-x-6 px-2 sm:px-6' : 'flex space-x-4 md:space-x-8 px-2 sm:px-6 min-w-max'}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className={`font-medium${language === 'ar' ? ' ml-2' : ''}`}>{t(`dashboard.${tab.id}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-2 sm:p-6">
            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.upcomingAppointments')}</h3>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment: Appointment) => {
                        const provider = getProviderById(appointment.providerId);
                        return (
                          <div key={appointment.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={provider?.photo}
                                  alt={provider?.name}
                                  className={`w-12 h-12 rounded-lg object-cover${language === 'ar' ? ' ml-4' : ' mr-4'}`}
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{provider?.name}</h4>
                                  <p className="text-blue-600">{provider?.subcategory}</p>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{appointment.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{appointment.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-4 w-4" />
                                      <span>{provider?.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{provider?.phone}</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Confirmed
                                </span>
                                <button onClick={() => handleComplete(appointment.id)} className="ml-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">
                                  Complete
                                </button>
                                {(appointment.status !== 'completed' && appointment.status !== 'cancelled') && (
                                  <button onClick={() => handleCancel(appointment.id)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                                    {t('dashboard.cancel') || 'Cancel'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">{t('dashboard.noUpcomingAppointments')}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentAppointments')}</h3>
                  {completedAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {completedAppointments.map((appointment: Appointment) => {
                        const provider = getProviderById(appointment.providerId);
                        return (
                          <div key={appointment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={provider?.photo}
                                  alt={provider?.name}
                                  className={`w-12 h-12 rounded-lg object-cover${language === 'ar' ? ' ml-4' : ' mr-4'}`}
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{provider?.name}</h4>
                                  <p className="text-gray-600">{provider?.subcategory}</p>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span>{appointment.date}</span>
                                    <span>{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {!appointment.hasReview && (
                                  <button onClick={() => handleReview(appointment.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                    {t('dashboard.leaveReview')}
                                  </button>
                                )}
                                {!appointment.hasReceipt && (
                                  <label className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-1 cursor-pointer">
                                    <Receipt className="h-4 w-4" />
                                    <span>{t('dashboard.uploadReceipt')}</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      style={{ display: 'none' }}
                                      onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleReceiptUpload(e.target.files[0], appointment.id);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                                {appointment.receiptUrl && (
                                  <a
                                    href={`http://localhost:4000${appointment.receiptUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 underline text-xs"
                                  >
                                    {t('dashboard.viewReceipt') || 'View Receipt'}
                                  </a>
                                )}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {t('dashboard.completedStatus')}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">{t('dashboard.noCompletedAppointments')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.myReviews')}</h3>
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('dashboard.noReviewsYet')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('dashboard.completeAppointmentsToReview')}</p>
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.rewardPoints')}</h3>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-yellow-800">{user?.rewardPoints} {t('common.points')}</h4>
                      <p className="text-yellow-700">{t('dashboard.availableToRedeem')}</p>
                    </div>
                    <Award className="h-12 w-12 text-yellow-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">{t('dashboard.howToEarnPoints')}</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>{t('dashboard.earnAppointment')}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{t('dashboard.earnReview')}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>{t('dashboard.earnReceipt')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;