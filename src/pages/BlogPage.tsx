import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogs } from '../data/blogs';
import { useTranslation } from '../utils/translations';

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find(b => b.id === id);
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        {t('home.blogNotFound') || 'Blog not found.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          {t('home.backToHome') || 'العودة إلى الصفحة الرئيسية'}
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t(`blog.${blog.id}.title`) || blog.title}</h1>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{t(`blog.${blog.id}.author`) || blog.author}</span>
              <span>{blog.date}</span>
            </div>
            <div className="text-gray-700 text-base whitespace-pre-line">{t(`blog.${blog.id}.content`) || blog.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 