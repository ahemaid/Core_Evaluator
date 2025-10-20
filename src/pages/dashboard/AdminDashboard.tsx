import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import { User } from '../../types';
import { User as UserIcon, Award, AlertTriangle, CheckCircle, XCircle, Star, ClipboardList, Plus, Trash2, Calendar, MessageSquare, Bell, BarChart3, Shield, Users, FileText, Settings, ChevronDown } from 'lucide-react';
import { blogs as initialBlogs, BlogPost } from '../../data/blogs';
import { mockProviders, mockAppointments } from '../../data/mockData';
import { ServiceProvider, Appointment } from '../../types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useAuth } from '../../context/AuthContext';
import QualityMetrics from '../../components/QualityMetrics';
import MessageSystem from '../../components/MessageSystem';

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
                    <div><b>Legal Ack:</b> {app.legalAck ? t('admin.yes') : t('admin.no')}</div>
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <span className="truncate">{t('admin.dashboardTitle') || 'لوحة تحكم المشرف'}</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">{t('admin.dashboardDesc') || 'إدارة النظام الداخلي وجودة الخدمة.'}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          {/* Mobile Dropdown Navigation */}
          <div className="block sm:hidden p-4 border-b border-gray-100">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="overview">Overview</option>
              <option value="management">Management</option>
              <option value="ratings">Ratings</option>
              <option value="evaluatorRequests">Evaluator</option>
              <option value="blog">Blog</option>
              <option value="auditLogs">Audit</option>
              <option value="appointments">Appointments</option>
              <option value="expertApplications">Expert</option>
              <option value="quality">Quality</option>
              <option value="messages">Chat</option>
              <option value="notifications">Alerts</option>
              <option value="security">Security</option>
            </select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:block border-b border-gray-100 overflow-x-auto">
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 px-2 sm:px-4 md:px-6 min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{t('admin.overview') || 'نظرة عامة'}</span>
                <span className="sm:hidden">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'management' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden md:inline">{t('admin.doctorUserManagement') || 'إدارة الأطباء والمستخدمين'}</span>
                <span className="md:hidden">Management</span>
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'ratings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden md:inline">{t('admin.ratingMonitoring') || 'مراقبة التقييمات'}</span>
                <span className="md:hidden">Ratings</span>
              </button>
              <button
                onClick={() => setActiveTab('evaluatorRequests')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'evaluatorRequests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden lg:inline">{t('admin.evaluatorRequests') || 'طلبات التقييم'}</span>
                <span className="lg:hidden">Evaluator</span>
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'blog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{t('admin.blogManagement') || 'إدارة المدونة'}</span>
                <span className="sm:hidden">Blog</span>
              </button>
              <button
                onClick={() => setActiveTab('auditLogs')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'auditLogs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Audit Logs</span>
                <span className="sm:hidden">Audit</span>
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{t('admin.appointments') || 'المواعيد'}</span>
                <span className="sm:hidden">Appointments</span>
              </button>
              <button
                onClick={() => setActiveTab('expertApplications')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'expertApplications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden lg:inline">Expert Applications</span>
                <span className="lg:hidden">Expert</span>
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'quality' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Quality Metrics</span>
                <span className="sm:hidden">Quality</span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'messages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 md:py-4 border-b-2 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden md:inline">Security & RBAC</span>
                <span className="md:hidden">Security</span>
              </button>
            </div>
          </nav>

          <div className="p-3 sm:p-4 md:p-6">
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
                  <div className="overflow-x-auto">
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
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t('admin.doctorApplications') || 'طلبات الأطباء'}</h2>
                  <div className="overflow-x-auto">
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
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Comprehensive Review Analytics</h3>
                    <p className="text-sm text-gray-600">Detailed review data from patient feedback</p>
                  </div>
                  
                  {/* Review Statistics */}
                  <div className="p-6">
                    {(() => {
                      const reviewsWithData = appointments.filter(apt => apt.hasReview && apt.reviewData);
                      const totalReviews = reviewsWithData.length;
                      
                      if (totalReviews === 0) {
                        return (
                          <div className="text-center py-8">
                            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No reviews submitted yet</p>
                            <p className="text-sm text-gray-500 mt-1">Reviews will appear here once patients submit feedback</p>
                          </div>
                        );
                      }
                      
                      // Calculate average ratings by category
                      const avgCommunication = reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.listenedCarefully || 0), 0) / totalReviews;
                      const avgTimeliness = reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.easyScheduling || 0), 0) / totalReviews;
                      const avgProfessionalism = reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.courtesy || 0), 0) / totalReviews;
                      const avgOverall = reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.overallSatisfaction || 0), 0) / totalReviews;
                      const recommendationRate = reviewsWithData.filter(apt => apt.reviewData?.wouldRecommend).length / totalReviews * 100;
                      
                      return (
                        <div className="space-y-6">
                          {/* Overall Statistics */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-blue-600">Total Reviews</p>
                                  <p className="text-2xl font-bold text-blue-800">{totalReviews}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                              </div>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-600">Avg Overall Rating</p>
                                  <p className="text-2xl font-bold text-green-800">{avgOverall.toFixed(1)}/5</p>
                                </div>
                                <Star className="h-8 w-8 text-green-600" />
                              </div>
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-purple-600">Recommendation Rate</p>
                                  <p className="text-2xl font-bold text-purple-800">{recommendationRate.toFixed(0)}%</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                              </div>
                            </div>
                            
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-orange-600">Avg Communication</p>
                                  <p className="text-2xl font-bold text-orange-800">{avgCommunication.toFixed(1)}/5</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-orange-600" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Category Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Communication</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Listening</span>
                                  <span className="font-medium">{avgCommunication.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Explanations</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.explainedClearly || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Respect</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.feltRespected || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Timeliness</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Scheduling</span>
                                  <span className="font-medium">{avgTimeliness.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Wait Time</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.waitTime || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Punctuality</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.startedOnTime || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Professionalism</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Courtesy</span>
                                  <span className="font-medium">{avgProfessionalism.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Empathy</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.showedEmpathy || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Cultural Respect</span>
                                  <span className="font-medium">{(reviewsWithData.reduce((sum, apt) => sum + (apt.reviewData?.culturalRespect || 0), 0) / totalReviews).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Individual Reviews */}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Individual Reviews</h4>
                            <div className="space-y-4">
                              {reviewsWithData.map((appointment) => {
                                const provider = mockProviders.find(p => p.id === appointment.providerId);
                                const reviewData = appointment.reviewData;
                                
                                return (
                                  <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <img
                                          src={provider?.photo}
                                          alt={provider?.name}
                                          className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div>
                                          <h5 className="font-medium text-gray-900">{provider?.name}</h5>
                                          <p className="text-sm text-gray-600">{provider?.subcategory}</p>
                                          <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < (reviewData.overallSatisfaction || 0)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-1 text-sm font-medium text-gray-700">
                                          {reviewData.overallSatisfaction}/5
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Review Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Communication:</span>
                                        <span className="font-medium">{reviewData.listenedCarefully || 0}/5</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Timeliness:</span>
                                        <span className="font-medium">{reviewData.easyScheduling || 0}/5</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Professionalism:</span>
                                        <span className="font-medium">{reviewData.courtesy || 0}/5</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Recommend:</span>
                                        <span className={`font-medium ${reviewData.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                                          {reviewData.wouldRecommend ? 'Yes' : 'No'}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Improvement Suggestions */}
                                    {reviewData.improvementSuggestions && (
                                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <h6 className="text-sm font-medium text-gray-700 mb-1">Improvement Suggestions:</h6>
                                        <p className="text-sm text-gray-600">{reviewData.improvementSuggestions}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Evaluator Requests Tab */}
            {activeTab === 'evaluatorRequests' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
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

            {/* Quality Metrics Tab */}
            {activeTab === 'quality' && <QualityMetrics />}

            {/* Messages Tab */}
            {activeTab === 'messages' && <MessageSystem />}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Notification Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Send Notification
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                      </div>
                      <Bell className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Unread</p>
                        <p className="text-2xl font-bold text-gray-900">89</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                        <p className="text-2xl font-bold text-gray-900">98.5%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Appointment Confirmed</p>
                              <p className="text-sm text-gray-600">Dr. Ahmed's appointment has been confirmed</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">2 hours ago</p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Delivered
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security & RBAC Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Security & Role-Based Access Control</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Security Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">1,456</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Admin Users</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                        <p className="text-2xl font-bold text-gray-900">23</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Security Score</p>
                        <p className="text-2xl font-bold text-gray-900">95%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Role Permissions</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          { role: 'Admin', permissions: [t('admin.fullAccess'), t('admin.userManagement'), t('admin.systemSettings')] },
                          { role: 'Provider', permissions: [t('admin.profileManagement'), t('admin.appointments'), t('dashboard.reviews')] },
                          { role: 'User', permissions: [t('admin.bookAppointments'), t('admin.leaveReviews'), t('admin.profile')] },
                          { role: 'Evaluator', permissions: [t('admin.qualityAssessment'), t('admin.providerEvaluation')] }
                        ].map((roleInfo, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{roleInfo.role}</h4>
                              <span className="text-sm text-gray-500">
                                {roleInfo.permissions.length} permissions
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {roleInfo.permissions.map((permission, pIndex) => (
                                <span
                                  key={pIndex}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Security Logs</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {[
                          { action: t('admin.loginAttempt'), user: 'admin@example.com', time: `2 ${t('admin.minutesAgo')}`, status: t('admin.success') },
                          { action: t('admin.permissionChange'), user: 'provider@example.com', time: `1 ${t('admin.hourAgo')}`, status: t('admin.success') },
                          { action: t('admin.failedLogin'), user: 'unknown@example.com', time: `3 ${t('admin.hoursAgo')}`, status: t('admin.failed') },
                          { action: t('admin.roleUpdate'), user: 'user@example.com', time: `5 ${t('admin.hoursAgo')}`, status: t('admin.success') }
                        ].map((log, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{log.action}</p>
                              <p className="text-sm text-gray-600">{log.user}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{log.time}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                log.status === t('admin.success')
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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