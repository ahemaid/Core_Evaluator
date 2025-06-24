import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Star, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../utils/translations';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, user } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: searchParams.get('role') || 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(formData.email, formData.password, formData.role);
    if (success) {
      if (formData.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-8 px-2 sm:px-6 lg:px-8" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">{t('login.welcomeBack')}</h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">{t('login.signInToContinue')}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.loginAs')}
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">{t('login.customer')}</option>
                  <option value="provider">{t('login.serviceProvider')}</option>
                  <option value="admin">{t('login.administrator')}</option>
                  <option value="evaluator">{t('login.expertEvaluator')}</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('login.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>{t('login.signingIn')}</span>
                </>
              ) : (
                <span>{t('nav.login')}</span>
              )}
            </button>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
              <div className="text-sm text-gray-600">
                {t('login.dontHaveAccount')}{' '}
                <Link
                  to={`/register${formData.role !== 'user' ? `?role=${formData.role}` : ''}`}
                  className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">{t('login.demoCredentials')}</p>
          <p>{t('login.demoEmail')}</p>
          <p>{t('login.demoPassword')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;