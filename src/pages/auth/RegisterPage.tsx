import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Star, Loader, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../utils/translations';
import { serviceCategories } from '../../data/categories';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isLoading, user } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: (searchParams.get('role') as 'user' | 'provider' | 'admin' | 'evaluator') || 'user',
    language: 'en' as 'ar' | 'en' | 'de',
    // Provider-specific fields
    category: '',
    subcategory: '',
    location: '',
    experience: '',
    bio: '',
    isApproved: 'pending' as true | false | 'pending' | 'rejected',
  });
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.errorPasswordsNoMatch'));
      return;
    }

    if (formData.role === 'provider' && step === 1) {
      setStep(2);
      return;
    }

    let photoUrl = '';
    if (formData.role === 'provider' && photoFile) {
      photoUrl = `/provider-photos/${Date.now()}_${photoFile.name}`;
    }

    let isApproved: true | false | 'pending' | 'rejected' = formData.isApproved;
    if (formData.role === 'provider' && (formData.isApproved === 'rejected' || formData.isApproved === undefined)) {
      isApproved = 'pending';
    }

    const success = await register({
      ...formData,
      photo: photoUrl,
      isApproved,
    });
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('register.errorRegistrationFailed'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const getSubcategories = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-8 px-2 sm:px-6 lg:px-8" dir={user?.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">{t('register.create')}</h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">{t('register.preferredLanguage')}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {formData.role === 'provider' && formData.isApproved === 'rejected' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                Your application was rejected. Please review your information and resubmit.
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.registerAs')}
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">{t('register.customer')}</option>
                    <option value="provider">{t('register.serviceProvider')}</option>
                  </select>
                </div>

                {/* Language Selection */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.preferredLanguage')}
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.fullName')}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('register.fullNamePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('register.emailPlaceholder')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.phone')}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('register.phonePlaceholder')}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.password')}
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
                      placeholder={t('register.passwordPlaceholder')}
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.confirmPassword')}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                  />
                </div>
              </div>
            )}

            {step === 2 && formData.role === 'provider' && (
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your category</option>
                    {serviceCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {t(`category.${category.id}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    required
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.category}
                  >
                    <option value="">Select your specialization</option>
                    {getSubcategories(formData.category).map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('home.location')}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Years of experience"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your services and expertise"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Profile Photo
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your profile will not be shown publicly until approved by an admin.</p>
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>
                  {formData.role === 'provider' && step === 1 ? t('register.continue') : t('register.create')}
                </span>
              )}
            </button>

            {/* Links */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                {t('register.alreadyHaveAccount')}{' '}
                <Link
                  to={`/login${formData.role !== 'user' ? `?role=${formData.role}` : ''}`}
                  className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;