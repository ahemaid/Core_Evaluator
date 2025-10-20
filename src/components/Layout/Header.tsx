import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, User, LogOut, Menu, X, Award, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation, LanguageContext } from '../../utils/translations';

const Header: React.FC = () => {
  const { user, logout, updateLanguage } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { t, language } = useTranslation();
  const { setLanguage } = React.useContext(LanguageContext);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'en' | 'de' | 'ar');
    if (user) {
      updateLanguage(langCode as 'en' | 'de' | 'ar');
    }
    setShowLanguageMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center h-16 min-h-[4rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ServicePro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={language === 'ar' ? 'hidden md:flex items-center gap-x-6' : 'hidden md:flex items-center space-x-8'}>
            {/* Only show Find Providers for regular users, not providers or admins */}
            {user && (user.role === 'provider' || user.role === 'admin') ? null : (
              <Link to="/search" className={`text-gray-700 hover:text-blue-600 transition-colors${language === 'ar' ? ' ml-6' : ''}`}>
                {t('nav.findProviders')}
              </Link>
            )}
            {user && (
              <>
                {/* Show Dashboard for all logged-in users, but link to appropriate dashboard based on role */}
                <Link 
                  to={user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                {/* Only show points for regular users, not providers or admins */}
                {user.role !== 'provider' && user.role !== 'admin' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>{user.rewardPoints} {t('common.points')}</span>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Language Selector & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">
                  {languages.find(lang => lang.code === language)?.flag}
                </span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {/* Only show Find Providers for regular users, not providers or admins */}
              {user && (user.role === 'provider' || user.role === 'admin') ? null : (
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.findProviders')}
                </Link>
              )}
              {user ? (
                <>
                  {/* Show Dashboard for all logged-in users, but link to appropriate dashboard based on role */}
                  <Link
                    to={user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  {/* Only show points for regular users, not providers or admins */}
                  {user.role !== 'provider' && user.role !== 'admin' && (
                    <div className="flex items-center space-x-2 py-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{user.rewardPoints} {t('common.points')}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 py-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;