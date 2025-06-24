import React from 'react';
import { Star, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../utils/translations';

const Footer: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ServicePro</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footer.brandDesc')}
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@servicepro.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/search" className="hover:text-white transition-colors">{t('nav.findProviders')}</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="/how-it-works" className="hover:text-white transition-colors">{t('footer.howItWorks')}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.forProviders')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/provider/register" className="hover:text-white transition-colors">{t('footer.joinAsProvider')}</a></li>
              <li><a href="/provider/login" className="hover:text-white transition-colors">{t('footer.providerLogin')}</a></li>
              <li><a href="/verification" className="hover:text-white transition-colors">{t('footer.verificationProcess')}</a></li>
              <li><a href="/support" className="hover:text-white transition-colors">{t('footer.providerSupport')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p className="text-gray-400 text-sm">
            © 2024 ServicePro. {t('footer.rightsReserved')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.privacyPolicy')}
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.termsOfService')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;