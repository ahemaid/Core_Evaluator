import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, FileText, Star, Award, CheckCircle, XCircle, Download, CreditCard, Settings, BarChart3, MessageSquare, Video, Clock, TrendingUp } from 'lucide-react';
import { Appointment } from '../../types';
import { mockAppointments } from '../../data/mockData';
import ProviderProfileManagement from '../../components/ProviderProfileManagement';
import ProviderAppointmentManagement from '../../components/ProviderAppointmentManagement';
import ProviderAnalytics from '../../components/ProviderAnalytics';

// Mock data for appointments
const mockEvaluatorRequests = [
  {
    id: '1',
    date: '2024-06-20',
    status: 'completed',
    evaluator: 'Dr. Expert',
    reportUrl: '#',
  },
  {
    id: '2',
    date: '2024-07-01',
    status: 'pending',
    evaluator: null,
    reportUrl: null,
  },
];

const ProviderDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEvaluatorModal, setShowEvaluatorModal] = useState(false);
  const [evaluatorRequests, setEvaluatorRequests] = useState(mockEvaluatorRequests);
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

  const providerAppointments = appointments.filter((apt: Appointment) => apt.providerId === user?.id);

  const handleCancel = (id: string) => {
    const updated = appointments.map((apt: Appointment) =>
      apt.id === id ? { ...apt, status: 'cancelled' as 'cancelled' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  // Simulate requesting a new expert evaluator
  const handleRequestEvaluator = () => {
    setEvaluatorRequests([
      ...evaluatorRequests,
      {
        id: (evaluatorRequests.length + 1).toString(),
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
        evaluator: null,
        reportUrl: null,
      },
    ]);
    setShowEvaluatorModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            <span className="truncate">{t('dashboard.providerDashboard') || 'لوحة تحكم مقدم الخدمة'}</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">{t('dashboard.providerWelcome') || 'إدارة المواعيد والتقارير والتقييمات الاحترافية'}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          {/* Desktop Navigation */}
          <nav className="hidden sm:block border-b border-gray-100">
            <div className="flex space-x-4 md:space-x-8 px-2 sm:px-6 overflow-x-auto">
              <div className="min-w-max flex space-x-4 md:space-x-6 lg:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{t('dashboard.dashboard')}</span>
                  <span className="sm:hidden">{t('dashboard.dashboard')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{t('dashboard.requestedAppointments')}</span>
                  <span className="hidden sm:inline md:hidden">{t('dashboard.appointments')}</span>
                  <span className="sm:hidden">{t('dashboard.appointmentsShort')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{t('dashboard.profile')}</span>
                  <span className="hidden sm:inline md:hidden">{t('dashboard.profile')}</span>
                  <span className="sm:hidden">{t('dashboard.profile')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{t('dashboard.analytics')}</span>
                  <span className="hidden sm:inline md:hidden">{t('dashboard.analytics')}</span>
                  <span className="sm:hidden">{t('dashboard.analytics')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('ratingReport')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'ratingReport' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden lg:inline">{t('dashboard.personalRatingReport')}</span>
                  <span className="hidden md:inline lg:hidden">{t('dashboard.ratingReport')}</span>
                  <span className="hidden sm:inline md:hidden">{t('dashboard.reports')}</span>
                  <span className="sm:hidden">{t('dashboard.reports')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('expertEvaluator')}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors text-xs sm:text-sm md:text-base ${activeTab === 'expertEvaluator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden lg:inline">{t('dashboard.paidExpertEvaluator')}</span>
                  <span className="hidden md:inline lg:hidden">{t('dashboard.expertEvaluator')}</span>
                  <span className="hidden sm:inline md:hidden">{t('dashboard.evaluator')}</span>
                  <span className="sm:hidden">{t('dashboard.expert')}</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div className="sm:hidden px-4 py-3 border-b border-gray-100">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="dashboard">📊 {t('dashboard.dashboard')}</option>
              <option value="appointments">📅 {t('dashboard.appointments')}</option>
              <option value="profile">⚙️ {t('dashboard.profile')}</option>
              <option value="analytics">📈 {t('dashboard.analytics')}</option>
              <option value="ratingReport">📄 {t('dashboard.ratingReport')}</option>
              <option value="expertEvaluator">⭐ {t('dashboard.expertEvaluator')}</option>
            </select>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {/* Dashboard Overview Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs sm:text-sm">{t('dashboard.totalAppointments')}</p>
                        <p className="text-xl sm:text-2xl font-bold">{providerAppointments.length}</p>
                      </div>
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs sm:text-sm">{t('dashboard.completed')}</p>
                        <p className="text-xl sm:text-2xl font-bold">{providerAppointments.filter(a => a.status === 'completed').length}</p>
                      </div>
                      <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-xs sm:text-sm">{t('dashboard.pending')}</p>
                        <p className="text-xl sm:text-2xl font-bold">{providerAppointments.filter(a => a.status === 'pending').length}</p>
                      </div>
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs sm:text-sm">{t('dashboard.rating')}</p>
                        <p className="text-xl sm:text-2xl font-bold">4.8</p>
                      </div>
                      <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentAppointments')}</h3>
                    <div className="space-y-3">
                      {providerAppointments.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{app.userId}</p>
                            <p className="text-xs text-gray-500">{app.date} at {app.time}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'completed' ? 'bg-green-100 text-green-800' :
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{t('dashboard.manageAppointments')}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Settings className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">{t('dashboard.updateProfile')}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">{t('dashboard.viewAnalytics')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Appointments Tab */}
            {activeTab === 'appointments' && (
              <ProviderAppointmentManagement />
            )}

            {/* Profile Management Tab */}
            {activeTab === 'profile' && (
              <ProviderProfileManagement />
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <ProviderAnalytics />
            )}

            {/* Legacy Appointments Tab (Fallback) */}
            {activeTab === 'legacy-appointments' && (
              <div className="space-y-4">
                {providerAppointments.length === 0 ? (
                  <p className="text-gray-600 text-center">{t('dashboard.noRequestedAppointments') || 'لا توجد مواعيد مطلوبة.'}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customer') || 'العميل'}</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.date') || 'التاريخ'}</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.time') || 'الوقت'}</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.status') || 'الحالة'}</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.actions') || 'إجراءات'}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {providerAppointments.map((app: Appointment) => (
                          <tr key={app.id}>
                            <td className="px-2 py-2 whitespace-nowrap flex items-center gap-2"><User className="h-4 w-4 text-blue-500" />{app.userId}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{app.date}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{app.time}</td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              {app.status === 'pending' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><XCircle className="h-4 w-4 mr-1" />{t('dashboard.pending') || 'قيد الانتظار'}</span>}
                              {app.status === 'confirmed' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 mr-1" />{t('dashboard.confirmed') || 'تم التأكيد'}</span>}
                              {app.status === 'completed' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="h-4 w-4 mr-1" />{t('dashboard.completed') || 'مكتمل'}</span>}
                              {app.status === 'cancelled' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-4 w-4 mr-1" />{t('dashboard.cancelled') || 'ملغي'}</span>}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              {(app.status !== 'completed' && app.status !== 'cancelled') && (
                                <button onClick={() => handleCancel(app.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                                  {t('dashboard.cancel') || 'إلغاء'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Personal Rating Report Tab */}
            {activeTab === 'ratingReport' && (
              <div className="flex flex-col items-center justify-center gap-6">
                <p className="text-gray-700 text-center text-lg">{t('dashboard.ratingReportDesc') || 'احصل على تقرير مفصل عن تقييماتك وأدائك.'}</p>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  {t('dashboard.downloadRatingReport') || 'تحميل التقرير'}
                </button>
                {/* Modal (mock) */}
                {showReportModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" />{t('dashboard.personalRatingReport') || 'تقرير التقييم الشخصي'}</h2>
                      <p className="mb-4 text-gray-700">{t('dashboard.mockReportText') || 'هذا تقرير تجريبي يوضح تقييمك العام، عدد المراجعات، وأداءك مقارنة بمقدمي الخدمة الآخرين.'}</p>
                      <button
                        onClick={() => setShowReportModal(false)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {t('dashboard.close') || 'إغلاق'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Paid Expert Evaluator Tab */}
            {activeTab === 'expertEvaluator' && (
              <div className="flex flex-col items-center gap-6">
                <p className="text-gray-700 text-center text-lg">{t('dashboard.expertEvaluatorDesc') || 'يمكنك طلب تقييم خبير احترافي مقابل رسوم.'}</p>
                <button
                  onClick={() => setShowEvaluatorModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  {t('dashboard.requestExpertEvaluator') || 'طلب تقييم خبير مدفوع'}
                </button>
                {/* Modal (mock) */}
                {showEvaluatorModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-pink-600" />{t('dashboard.paidExpertEvaluator') || 'طلب تقييم خبير مدفوع'}</h2>
                      <p className="mb-4 text-gray-700">{t('dashboard.mockEvaluatorText') || 'سيتم التواصل معك من قبل خبير تقييم خلال 48 ساعة بعد إتمام الدفع.'}</p>
                      <button
                        onClick={handleRequestEvaluator}
                        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        {t('dashboard.confirmRequest') || 'تأكيد الطلب'}
                      </button>
                      <button
                        onClick={() => setShowEvaluatorModal(false)}
                        className="mt-2 ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        {t('dashboard.close') || 'إغلاق'}
                      </button>
                    </div>
                  </div>
                )}
                {/* List of previous requests */}
                <div className="w-full max-w-2xl mt-6">
                  <h3 className="text-lg font-semibold mb-2">{t('dashboard.evaluatorRequests') || 'طلبات التقييم السابقة'}</h3>
                  <ul className="space-y-2">
                    {evaluatorRequests.map(req => (
                      <li key={req.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{t('dashboard.requestedOn') || 'تاريخ الطلب'}: {req.date}</div>
                          <div className="text-sm text-gray-600">{t('dashboard.status') || 'الحالة'}: {req.status === 'completed' ? t('dashboard.completed') || 'مكتمل' : t('dashboard.pending') || 'قيد الانتظار'}</div>
                        </div>
                        {req.status === 'completed' && req.reportUrl && (
                          <a href={req.reportUrl} className="text-blue-600 hover:underline flex items-center gap-1"><Download className="h-4 w-4" />{t('dashboard.downloadReport') || 'تحميل التقرير'}</a>
                        )}
                        {req.status === 'pending' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><XCircle className="h-4 w-4 mr-1" />{t('dashboard.pending') || 'قيد الانتظار'}</span>
                        )}
                      </li>
                    ))}
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

export default ProviderDashboard; 