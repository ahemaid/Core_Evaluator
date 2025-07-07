import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, FileText, Star, Award, CheckCircle, XCircle, Download, CreditCard } from 'lucide-react';
import { Appointment } from '../../types';
import { mockAppointments } from '../../data/mockData';

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
  const [activeTab, setActiveTab] = useState('appointments');
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
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            {t('dashboard.providerDashboard') || 'لوحة تحكم مقدم الخدمة'}
          </h1>
          <p className="text-gray-600 text-sm">{t('dashboard.providerWelcome') || 'إدارة المواعيد والتقارير والتقييمات الاحترافية'}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <nav className={language === 'ar' ? 'flex gap-x-4 md:gap-x-6 px-2 sm:px-6' : 'flex space-x-4 md:space-x-8 px-2 sm:px-6 min-w-max border-b border-gray-100 overflow-x-auto'}>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Calendar className="h-5 w-5" />
              <span>{t('dashboard.requestedAppointments') || 'المواعيد المطلوبة'}</span>
            </button>
            <button
              onClick={() => setActiveTab('ratingReport')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'ratingReport' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <FileText className="h-5 w-5" />
              <span>{t('dashboard.personalRatingReport') || 'تقرير التقييم الشخصي'}</span>
            </button>
            <button
              onClick={() => setActiveTab('expertEvaluator')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'expertEvaluator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Star className="h-5 w-5" />
              <span>{t('dashboard.paidExpertEvaluator') || 'طلب تقييم خبير مدفوع'}</span>
            </button>
          </nav>

          <div className="p-2 sm:p-6">
            {/* Requested Appointments Tab */}
            {activeTab === 'appointments' && (
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