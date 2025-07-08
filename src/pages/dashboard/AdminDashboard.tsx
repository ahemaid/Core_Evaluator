import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import { User } from '../../types';
import { User as UserIcon, Award, AlertTriangle, CheckCircle, XCircle, Star, ClipboardList, Plus, Trash2, Calendar } from 'lucide-react';
import { blogs as initialBlogs, BlogPost } from '../../data/blogs';
import { mockProviders, mockAppointments } from '../../data/mockData';
import { ServiceProvider, Appointment } from '../../types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useAuth } from '../../context/AuthContext';

// Mock data
const mockUsers = [
  { id: '1', name: 'Ali Hassan', email: 'ali@example.com', role: 'user', flagged: false },
  { id: '2', name: 'Sara Ahmed', email: 'sara@example.com', role: 'user', flagged: true },
  { id: '3', name: 'Mohamed Salah', email: 'mohamed@example.com', role: 'user', flagged: false },
];
const mockDoctors = [
  { id: 'd1', name: 'Dr. Amr Fathy', email: 'amr@example.com', status: 'pending', avgRating: 8.2, flagged: false },
  { id: 'd2', name: 'Dr. Mona Khaled', email: 'mona@example.com', status: 'active', avgRating: 6.5, flagged: true },
  { id: 'd3', name: 'Dr. Youssef Nabil', email: 'youssef@example.com', status: 'active', avgRating: 9.1, flagged: false },
];
const mockEvaluatorRequests = [
  { id: 'e1', doctor: 'Dr. Mona Khaled', date: '2024-07-01', status: 'open' },
  { id: 'e2', doctor: 'Dr. Amr Fathy', date: '2024-07-02', status: 'closed' },
];

// Simulate email notification
function sendEmailNotification(to: string, subject: string, message: string) {
  // In real app, call backend/email service
  console.log(`EMAIL TO: ${to}\nSUBJECT: ${subject}\nMESSAGE: ${message}`);
}

// Audit log utility
function addAuditLog({ adminId, providerId, action, reason }: { adminId: string; providerId: string; action: string; reason?: string }) {
  const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  logs.unshift({ timestamp: new Date().toISOString(), adminId, providerId, action, reason });
  localStorage.setItem('auditLogs', JSON.stringify(logs));
}

// Add the ExpertApplicationForm interface and ExpertApplicationsTable component inline
interface ExpertApplicationForm {
  legalAck: boolean;
  date: string;
  workedForFirm: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  function: string;
  companyActivity: string;
  doneAssessment: string;
  years: string;
  certified: string;
  accreditor: string;
  ageGroup: string;
  income: string;
  education: string;
  availableDays: string[];
  motivation: string;
  submittedAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

const ExpertApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<ExpertApplicationForm[]>([]);
  useEffect(() => {
    const data = localStorage.getItem('expertApplications');
    if (data) {
      const parsed = JSON.parse(data).map((app: ExpertApplicationForm) => ({
        ...app,
        status: app.status || 'pending',
      }));
      setApplications(parsed);
    }
  }, []);
  const updateStatus = (idx: number, status: 'approved' | 'rejected') => {
    const updated = applications.map((app, i) =>
      i === idx ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem('expertApplications', JSON.stringify(updated));
  };
  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Expert Evaluator Applications</h2>
        <p>No applications found.</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Expert Evaluator Applications</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Submitted</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
            <th className="p-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2 border">{app.name}</td>
              <td className="p-2 border">{app.email}</td>
              <td className="p-2 border">{app.phone}</td>
              <td className="p-2 border">{app.city}</td>
              <td className="p-2 border">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''}</td>
              <td className="p-2 border capitalize">{app.status || 'pending'}</td>
              <td className="p-2 border">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
                  disabled={app.status === 'approved'}
                  onClick={() => updateStatus(idx, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  disabled={app.status === 'rejected'}
                  onClick={() => updateStatus(idx, 'rejected')}
                >
                  Reject
                </button>
              </td>
              <td className="p-2 border">
                <details>
                  <summary className="cursor-pointer">View</summary>
                  <div className="mt-2 text-xs text-left">
                    <div><b>Address:</b> {app.address}</div>
                    <div><b>Function:</b> {app.function}</div>
                    {app.companyActivity && <div><b>Company Activity:</b> {app.companyActivity}</div>}
                    <div><b>Worked for Firm:</b> {app.workedForFirm}</div>
                    <div><b>Done Assessment:</b> {app.doneAssessment}</div>
                    {app.years && <div><b>Years:</b> {app.years}</div>}
                    <div><b>Certified:</b> {app.certified}</div>
                    {app.accreditor && <div><b>Accreditor:</b> {app.accreditor}</div>}
                    <div><b>Age Group:</b> {app.ageGroup}</div>
                    <div><b>Income:</b> {app.income}</div>
                    <div><b>Education:</b> {app.education}</div>
                    <div><b>Available Days:</b> {app.availableDays.join(', ')}</div>
                    <div><b>Motivation:</b> {app.motivation}</div>
                    <div><b>Legal Ack:</b> {app.legalAck ? 'Yes' : 'No'}</div>
                    <div><b>Date:</b> {app.date}</div>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });
  const [pendingProviders, setPendingProviders] = useState<ServiceProvider[]>(() => {
    const stored = localStorage.getItem('providers');
    let providers: ServiceProvider[] = mockProviders;
    if (stored) providers = JSON.parse(stored);
    return providers.filter(p => p.isApproved === 'pending');
  });
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user: adminUser } = useAuth();
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

  // Count totals
  const totalUsers = mockUsers.length;
  const totalDoctors = mockDoctors.length;
  const flaggedProfiles = mockUsers.filter(u => u.flagged).length + mockDoctors.filter(d => d.flagged).length;

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.author || !newBlog.image) return;
    setBlogs([
      {
        id: (Date.now()).toString(),
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author,
        date: new Date().toISOString().slice(0, 10),
        image: newBlog.image,
      },
      ...blogs,
    ]);
    setNewBlog({ title: '', content: '', author: '', image: '' });
  };

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const approveProvider = (id: string) => {
    const stored = localStorage.getItem('providers');
    let providers: ServiceProvider[] = mockProviders;
    if (stored) providers = JSON.parse(stored);
    providers = providers.map(p => p.id === id ? { ...p, isApproved: true } : p);
    localStorage.setItem('providers', JSON.stringify(providers));
    setPendingProviders(providers.filter(p => p.isApproved === 'pending'));
    // Email notification
    const provider = providers.find(p => p.id === id);
    if (provider) sendEmailNotification(provider.email, 'Your application has been approved', 'Congratulations! Your provider application has been approved.');
    // Audit log
    addAuditLog({ adminId: adminUser?.id || 'admin', providerId: id, action: 'approved' });
  };

  const rejectProvider = (id: string) => {
    const stored = localStorage.getItem('providers');
    let providers: ServiceProvider[] = mockProviders;
    if (stored) providers = JSON.parse(stored);
    providers = providers.filter(p => p.id !== id);
    localStorage.setItem('providers', JSON.stringify(providers));
    setPendingProviders(providers.filter(p => p.isApproved === 'pending'));
    // Email notification
    const provider = providers.find(p => p.id === id);
    if (provider) sendEmailNotification(provider.email, 'Your application was rejected', 'We regret to inform you that your provider application was rejected.');
    // Audit log
    addAuditLog({ adminId: adminUser?.id || 'admin', providerId: id, action: 'rejected' });
  };

  const openDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setDetailsOpen(true);
  };
  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedProvider(null);
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : userId;
  };
  const getProviderName = (providerId: string) => {
    const provider = mockProviders.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-500" />
            {t('admin.dashboardTitle') || 'لوحة تحكم المشرف'}
          </h1>
          <p className="text-gray-600 text-sm">{t('admin.dashboardDesc') || 'إدارة النظام الداخلي وجودة الخدمة.'}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <nav className={language === 'ar' ? 'flex gap-x-4 md:gap-x-6 px-2 sm:px-6' : 'flex space-x-4 md:space-x-8 px-2 sm:px-6 min-w-max border-b border-gray-100 overflow-x-auto'}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Award className="h-5 w-5" />
              <span>{t('admin.overview') || 'نظرة عامة'}</span>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'management' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <UserIcon className="h-5 w-5" />
              <span>{t('admin.doctorUserManagement') || 'إدارة الأطباء والمستخدمين'}</span>
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'ratings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Star className="h-5 w-5" />
              <span>{t('admin.ratingMonitoring') || 'مراقبة التقييمات'}</span>
            </button>
            <button
              onClick={() => setActiveTab('evaluatorRequests')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'evaluatorRequests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>{t('admin.evaluatorRequests') || 'طلبات التقييم'}</span>
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'blog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Star className="h-5 w-5" />
              <span>{t('admin.blogManagement') || 'إدارة المدونة'}</span>
            </button>
            <button
              onClick={() => setActiveTab('auditLogs')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'auditLogs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Audit Logs</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Calendar className="h-5 w-5" />
              <span>{t('admin.appointments') || 'المواعيد'}</span>
            </button>
            <button
              onClick={() => setActiveTab('expertApplications')}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${activeTab === 'expertApplications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Expert Applications</span>
            </button>
          </nav>

          <div className="p-2 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-700 mb-2">{totalUsers}</div>
                  <div className="text-gray-700">{t('admin.totalUsers') || 'إجمالي المستخدمين'}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-700 mb-2">{totalDoctors}</div>
                  <div className="text-gray-700">{t('admin.totalDoctors') || 'إجمالي الأطباء'}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-red-700 mb-2">{flaggedProfiles}</div>
                  <div className="text-gray-700">{t('admin.flaggedProfiles') || 'الملفات المميزة'}</div>
                </div>
              </div>
            )}

            {/* Doctor/User Management Tab */}
            {activeTab === 'management' && (
              <div className="space-y-8">
                {/* Pending Providers Approval */}
                <div>
                  <h2 className="text-lg font-semibold mb-2">Pending Provider Approvals</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.name') || 'الاسم'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.email') || 'البريد الإلكتروني'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.category') || 'الفئة'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions') || 'إجراءات'}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {pendingProviders.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-500">No pending providers.</td></tr>
                      ) : pendingProviders.map(provider => (
                        <tr key={provider.id}>
                          <td className="px-2 py-2 whitespace-nowrap">{provider.name}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{provider.email}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{provider.category}</td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <button onClick={() => approveProvider(provider.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs mr-2">Approve</button>
                            <button onClick={() => rejectProvider(provider.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs mr-2">Reject</button>
                            <button onClick={() => openDetails(provider)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t('admin.doctorApplications') || 'طلبات الأطباء'}</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.name') || 'الاسم'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.email') || 'البريد الإلكتروني'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status') || 'الحالة'}</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions') || 'إجراءات'}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {mockDoctors.map(doc => (
                        <tr key={doc.id}>
                          <td className="px-2 py-2 whitespace-nowrap">{doc.name}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{doc.email}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{doc.status === 'pending' ? t('admin.pending') || 'قيد الانتظار' : t('admin.active') || 'نشط'}</td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {doc.status === 'pending' ? (
                              <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs mr-2">{t('admin.approve') || 'قبول'}</button>
                            ) : null}
                            <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs">{t('admin.reject') || 'رفض'}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t('admin.userActivity') || 'نشاط المستخدمين'}</h2>
                  <ul className="space-y-2">
                    {mockUsers.map(user => (
                      <li key={user.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                        {user.flagged && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="h-4 w-4 mr-1" />{t('admin.flagged') || 'مميز'}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Rating Monitoring Tab */}
            {activeTab === 'ratings' && (
              <div className="space-y-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.name') || 'الاسم'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.email') || 'البريد الإلكتروني'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.avgRating') || 'متوسط التقييم'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status') || 'الحالة'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.alert') || 'تنبيه'}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mockDoctors.map(doc => (
                      <tr key={doc.id}>
                        <td className="px-2 py-2 whitespace-nowrap">{doc.name}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{doc.email}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{doc.avgRating}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {doc.avgRating < 7 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"><XCircle className="h-4 w-4 mr-1" />{t('admin.disabled') || 'معطل مؤقتاً'}</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 mr-1" />{t('admin.active') || 'نشط'}</span>
                          )}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {doc.avgRating < 7 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="h-4 w-4 mr-1" />{t('admin.reviewAndContact') || 'راجع الطبيب وتواصل معه'}</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Evaluator Requests Tab */}
            {activeTab === 'evaluatorRequests' && (
              <div className="space-y-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.doctor') || 'الطبيب'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.date') || 'التاريخ'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status') || 'الحالة'}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mockEvaluatorRequests.map(req => (
                      <tr key={req.id}>
                        <td className="px-2 py-2 whitespace-nowrap">{req.doctor}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{req.date}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {req.status === 'open' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="h-4 w-4 mr-1" />{t('admin.open') || 'مفتوح'}</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 mr-1" />{t('admin.closed') || 'مغلق'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Blog Management Tab */}
            {activeTab === 'blog' && (
              <div className="space-y-8">
                <h2 className="text-lg font-semibold mb-4">{t('admin.blogManagement') || 'إدارة المدونة'}</h2>
                {/* Add Blog Form */}
                <form onSubmit={handleAddBlog} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{t('admin.blogTitle') || 'عنوان المقال'}</label>
                    <input type="text" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} className="border rounded-lg px-3 py-2" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{t('admin.blogContent') || 'محتوى المقال'}</label>
                    <textarea value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} className="border rounded-lg px-3 py-2" rows={4} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{t('admin.blogAuthor') || 'الكاتب'}</label>
                    <input type="text" value={newBlog.author} onChange={e => setNewBlog({ ...newBlog, author: e.target.value })} className="border rounded-lg px-3 py-2" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{t('admin.blogImage') || 'رابط صورة المقال'}</label>
                    <input type="text" value={newBlog.image} onChange={e => setNewBlog({ ...newBlog, image: e.target.value })} className="border rounded-lg px-3 py-2" required />
                  </div>
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start">
                    <Plus className="h-4 w-4" /> {t('admin.addBlog') || 'إضافة مقال'}
                  </button>
                </form>
                {/* Blog List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {blogs.map(blog => (
                    <div key={blog.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
                      <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover" />
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(`blog.${blog.id}.title`) || blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1">{t(`blog.${blog.id}.content`) || (blog.content.slice(0, 90) + '...')}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{t(`blog.${blog.id}.author`) || blog.author}</span>
                          <span>{blog.date}</span>
                        </div>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="mt-auto bg-red-100 text-red-700 px-3 py-1 rounded-lg flex items-center gap-1 text-xs hover:bg-red-200">
                          <Trash2 className="h-4 w-4" /> {t('admin.deleteBlog') || 'حذف'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'auditLogs' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-2">Audit Logs</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {(JSON.parse(localStorage.getItem('auditLogs') || '[]') as any[]).map((log, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-2 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{log.adminId}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{log.providerId}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{log.action}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{log.reason || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-2">{t('admin.appointments') || 'المواعيد'}</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.customer') || 'العميل'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.provider') || 'المقدم'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.date') || 'التاريخ'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.time') || 'الوقت'}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status') || 'الحالة'}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {appointments.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4 text-gray-500">No appointments found.</td></tr>
                    ) : appointments.map((apt: Appointment) => (
                      <tr key={apt.id}>
                        <td className="px-2 py-2 whitespace-nowrap">{getUserName(apt.userId)}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{getProviderName(apt.providerId)}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{apt.date}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{apt.time}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{apt.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Expert Applications Tab */}
            {activeTab === 'expertApplications' && <ExpertApplicationsTable />}
          </div>
        </div>
      </div>
      <Dialog open={detailsOpen} onClose={closeDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Provider Details</DialogTitle>
        <DialogContent>
          {selectedProvider && (
            <div className="space-y-2">
              <img src={selectedProvider.photo} alt={selectedProvider.name} className="w-24 h-24 rounded-lg object-cover mb-2" />
              <div><strong>Name:</strong> {selectedProvider.name}</div>
              <div><strong>Email:</strong> {selectedProvider.email}</div>
              <div><strong>Category:</strong> {selectedProvider.category}</div>
              <div><strong>Specialization:</strong> {selectedProvider.subcategory}</div>
              <div><strong>Location:</strong> {selectedProvider.location}</div>
              <div><strong>Experience:</strong> {selectedProvider.experience} years</div>
              <div><strong>Bio:</strong> {selectedProvider.bio}</div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { if (selectedProvider) approveProvider(selectedProvider.id); closeDetails(); }} color="success">Approve</Button>
          <Button onClick={() => { if (selectedProvider) rejectProvider(selectedProvider.id); closeDetails(); }} color="error">Reject</Button>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 