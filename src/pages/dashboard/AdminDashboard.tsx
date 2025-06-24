import React, { useState } from 'react';
import { useTranslation } from '../../utils/translations';
import { User } from '../../types';
import { User as UserIcon, Award, AlertTriangle, CheckCircle, XCircle, Star, ClipboardList, Plus, Trash2 } from 'lucide-react';
import { blogs as initialBlogs, BlogPost } from '../../data/blogs';

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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1">{blog.content.slice(0, 90)}...</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{blog.author}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 