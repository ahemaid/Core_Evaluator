// This file has been renamed to translations.tsx to support JSX syntax. 

import React, { createContext, useContext, useState } from 'react';

export const translations: {
  [key: string]: {
    en: string;
    de: string;
    ar: string;
  };
} = {
  // Navigation
  'nav.findProviders': {
    en: 'Find Providers',
    de: 'Anbieter finden',
    ar: 'العثور على مقدمي الخدمات'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    de: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'nav.login': {
    en: 'Login',
    de: 'Anmelden',
    ar: 'تسجيل الدخول'
  },
  'nav.signup': {
    en: 'Sign Up',
    de: 'Registrieren',
    ar: 'إنشاء حساب'
  },
  'nav.logout': {
    en: 'Logout',
    de: 'Abmelden',
    ar: 'تسجيل الخروج'
  },

  // Homepage
  'home.title': {
    en: 'Find Qualified Service Providers Near You',
    de: 'Finden Sie qualifizierte Dienstleister in Ihrer Nähe',
    ar: 'اعثر على مقدمي الخدمات المؤهلين بالقرب منك'
  },
  'home.subtitle': {
    en: 'Connect with verified, highly-rated service providers based on transparent reviews and expert evaluations. Quality service, not just popularity.',
    de: 'Verbinden Sie sich mit verifizierten, hoch bewerteten Dienstleistern basierend auf transparenten Bewertungen und Expertenbewertungen. Qualitätsservice, nicht nur Popularität.',
    ar: 'تواصل مع مقدمي الخدمات المعتمدين وعالي التقييم بناءً على المراجعات الشفافة والتقييمات المتخصصة. خدمة عالية الجودة، وليس مجرد شعبية.'
  },
  'home.search': {
    en: 'Search',
    de: 'Suchen',
    ar: 'بحث'
  },
  'home.country': {
    en: 'Country',
    de: 'Land',
    ar: 'البلد'
  },
  'home.category': {
    en: 'Category',
    de: 'Kategorie',
    ar: 'الفئة'
  },
  'home.location': {
    en: 'Location',
    de: 'Standort',
    ar: 'الموقع'
  },
  'home.browseByCategory': {
    en: 'Browse by Category',
    de: 'Nach Kategorie durchsuchen',
    ar: 'تصفح حسب الفئة'
  },
  'home.categorySubtitle': {
    en: 'Find qualified service providers across multiple industries',
    de: 'Finden Sie qualifizierte Dienstleister in verschiedenen Branchen',
    ar: 'اعثر على مقدمي خدمات مؤهلين في مختلف الصناعات'
  },
  'home.whyChoose': {
    en: 'Why Choose ServicePro?',
    de: 'Warum ServicePro wählen?',
    ar: '؟ServicePro لماذا تختار '
  },
  'home.whyChooseSubtitle': {
    en: 'We prioritize quality over popularity, ensuring you connect with the most qualified service providers.',
    de: 'Wir priorisieren Qualität vor Popularität, damit Sie mit den qualifiziertesten Dienstleistern in Kontakt treten.',
    ar: 'نحن نعطي الأولوية للجودة على الشعبية، لضمان تواصلك مع أفضل مقدمي الخدمات.'
  },
  'home.stats.verifiedProviders': {
    en: '25,000+ Verified Providers',
    de: '25.000+ verifizierte Anbieter',
    ar: 'أكثر من 25,000 مقدم خدمة معتمد'
  },
  'home.stats.happyCustomers': {
    en: '100,000+ Happy Customers',
    de: '100.000+ zufriedene Kunden',
    ar: 'أكثر من 100,000 عميل سعيد'
  },
  'home.stats.averageRating': {
    en: '4.9 Average Rating',
    de: '4,9 Durchschnittsbewertung',
    ar: 'متوسط التقييم 4.9'
  },
  'home.stats.supportAvailable': {
    en: '24/7 Support Available',
    de: '24/7 Support verfügbar',
    ar: 'دعم متوفر 24/7'
  },
  'home.ctaTitle': {
    en: 'Ready to Find Your Perfect Service Provider?',
    de: 'Bereit, den perfekten Dienstleister zu finden?',
    ar: 'هل أنت مستعد للعثور على مقدم الخدمة المثالي؟'
  },
  'home.ctaSubtitle': {
    en: 'Join thousands of customers who have found quality services through our platform.',
    de: 'Schließen Sie sich Tausenden von Kunden an, die über unsere Plattform Qualitätsdienstleistungen gefunden haben.',
    ar: 'انضم إلى آلاف العملاء الذين وجدوا خدمات عالية الجودة من خلال منصتنا.'
  },
  'home.startSearching': {
    en: 'Start Searching',
    de: 'Jetzt suchen',
    ar: 'ابدأ البحث'
  },
  'home.createAccount': {
    en: 'Create Account',
    de: 'Konto erstellen',
    ar: 'إنشاء حساب'
  },
  'home.latestBlogs': {
    en: 'Latest Blogs',
    de: 'Neueste Blogs',
    ar: 'أحدث المقالات'
  },
  'home.latestBlogsDesc': {
    en: 'Read the latest articles on health and medical services.',
    de: 'Lesen Sie die neuesten Artikel zu Gesundheit und medizinischen Dienstleistungen.',
    ar: 'اقرأ أحدث المقالات حول الصحة والخدمات الطبية.'
  },
  'home.readMore': {
    en: 'Read more',
    de: 'Mehr lesen',
    ar: 'اقرأ المزيد'
  },
  'home.blogNotFound': {
    en: 'Blog not found.',
    de: 'Blog nicht gefunden.',
    ar: 'المقال غير موجود.'
  },
  'home.backToHome': {
    en: 'Back to Home',
    de: 'Zurück zur Startseite',
    ar: 'العودة إلى الصفحة الرئيسية'
  },

  // Categories
  'category.healthcare': {
    en: 'Healthcare',
    de: 'Gesundheitswesen',
    ar: 'الرعاية الصحية'
  },
  'category.restaurants': {
    en: 'Restaurants',
    de: 'Restaurants',
    ar: 'المطاعم'
  },
  'category.education': {
    en: 'Education',
    de: 'Bildung',
    ar: 'التعليم'
  },
  'category.beauty': {
    en: 'Beauty & Wellness',
    de: 'Schönheit & Wellness',
    ar: 'الجمال والعافية'
  },
  'category.automotive': {
    en: 'Automotive',
    de: 'Automobil',
    ar: 'السيارات'
  },
  'category.home': {
    en: 'Home Services',
    de: 'Hausdienstleistungen',
    ar: 'خدمات المنزل'
  },

  // Common
  'common.bookNow': {
    en: 'Book Now',
    de: 'Jetzt buchen',
    ar: 'احجز الآن'
  },
  'common.loginToBook': {
    en: 'Login to Book',
    de: 'Anmelden zum Buchen',
    ar: 'تسجيل الدخول للحجز'
  },
  'common.verified': {
    en: 'Verified',
    de: 'Verifiziert',
    ar: 'معتمد'
  },
  'common.reviews': {
    en: 'reviews',
    de: 'Bewertungen',
    ar: 'مراجعات'
  },
  'common.points': {
    en: 'points',
    de: 'Punkte',
    ar: 'نقاط'
  },
  'common.cancel': {
    en: 'Cancel',
    de: 'Abbrechen',
    ar: 'إلغاء'
  },
  'common.confirm': {
    en: 'Confirm',
    de: 'Bestätigen',
    ar: 'تأكيد'
  },
  'common.allCategories': {
    en: 'All Categories',
    de: 'Alle Kategorien',
    ar: 'كل الفئات'
  },
  'common.filters': {
    en: 'Filters',
    de: 'Filter',
    ar: 'الفلاتر'
  },
  'common.clearFilters': {
    en: 'Clear Filters',
    de: 'Filter zurücksetzen',
    ar: 'مسح الفلاتر'
  },
  'common.sortByRating': {
    en: 'Sort by Rating',
    de: 'Nach Bewertung sortieren',
    ar: 'ترتيب حسب التقييم'
  },
  'common.sortByPrice': {
    en: 'Sort by Price',
    de: 'Nach Preis sortieren',
    ar: 'ترتيب حسب السعر'
  },
  'common.sortByWaitTime': {
    en: 'Sort by Wait Time',
    de: 'Nach Wartezeit sortieren',
    ar: 'ترتيب حسب وقت الانتظار'
  },
  'common.minRating': {
    en: 'Min Rating',
    de: 'Mindestbewertung',
    ar: 'الحد الأدنى للتقييم'
  },
  'common.maxPrice': {
    en: 'Max Price',
    de: 'Höchstpreis',
    ar: 'أقصى سعر'
  },
  'common.anyRating': {
    en: 'Any Rating',
    de: 'Beliebige Bewertung',
    ar: 'أي تقييم'
  },
  'common.anyPrice': {
    en: 'Any Price',
    de: 'Beliebiger Preis',
    ar: 'أي سعر'
  },
  'common.under50': {
    en: 'Under $50',
    de: 'Unter 50 $',
    ar: '50$ أقل من'
  },
  'common.under100': {
    en: 'Under $100',
    de: 'Unter 100 $',
    ar: '100$ أقل من'
  },
  'common.under200': {
    en: 'Under $200',
    de: 'Unter 200 $',
    ar: '200$ أقل من'
  },
  'common.under300': {
    en: 'Under $300',
    de: 'Unter 300 $',
    ar: '300$ أقل من'
  },
  'common.allSubcategories': {
    en: 'All Subcategories',
    de: 'Alle Unterkategorien',
    ar: 'كل التخصصات الفرعية'
  },
  'common.country': {
    en: 'Country',
    de: 'Land',
    ar: 'الدولة'
  },
  'common.city': {
    en: 'City',
    de: 'Stadt',
    ar: 'المدينة'
  },
  'common.selectCity': {
    en: 'Select City',
    de: 'Stadt auswählen',
    ar: 'اختر المدينة'
  },
  'common.providersFound': {
    en: 'Providers Found',
    de: 'Anbieter gefunden',
    ar: 'مقدمو الخدمات الذين تم العثور عليهم'
  },
  'common.showingQualifiedProviders': {
    en: 'Showing qualified and verified providers',
    de: 'Anzeige qualifizierter und verifizierter Anbieter',
    ar: 'عرض مقدمي الخدمات المؤهلين والمعتمدين'
  },
  'common.hours': {
    en: 'Hours:',
    de: 'Öffnungszeiten:',
    ar: 'ساعات العمل:'
  },

  // Features
  'features.verifiedProviders': {
    en: 'Verified Providers',
    de: 'Verifizierte Anbieter',
    ar: 'مقدمو الخدمات المعتمدون'
  },
  'features.verifiedProvidersDesc': {
    en: 'All service providers are thoroughly verified and evaluated by experts to ensure the highest standards of service.',
    de: 'Alle Dienstleister werden gründlich von Experten verifiziert und bewertet, um höchste Servicestandards zu gewährleisten.',
    ar: 'جميع مقدمي الخدمات معتمدون ومقيمون بدقة من قبل الخبراء لضمان أعلى معايير الخدمة.'
  },
  'features.transparentReviews': {
    en: 'Transparent Reviews',
    de: 'Transparente Bewertungen',
    ar: 'مراجعات شفافة'
  },
  'features.transparentReviewsDesc': {
    en: 'Real reviews from verified customers with receipt validation, ensuring authentic feedback and quality assurance.',
    de: 'Echte Bewertungen von verifizierten Kunden mit Belegvalidierung, die authentisches Feedback und Qualitätssicherung gewährleisten.',
    ar: 'مراجعات حقيقية من العملاء المعتمدين مع التحقق من الإيصالات، مما يضمن التعليقات الأصيلة وضمان الجودة.'
  },
  'features.rewardSystem': {
    en: 'Reward System',
    de: 'Belohnungssystem',
    ar: 'نظام المكافآت'
  },
  'features.rewardSystemDesc': {
    en: 'Earn points for every service and review, redeemable for future services and exclusive benefits.',
    de: 'Sammeln Sie Punkte für jeden Service und jede Bewertung, einlösbar für zukünftige Services und exklusive Vorteile.',
    ar: 'اكسب نقاطاً مع كل خدمة ومراجعة، قابلة للاستبدال للخدمات المستقبلية والمزايا الحصرية.'
  },

  // Footer
  'footer.brandDesc': {
    en: 'Connecting customers with qualified, verified service providers across multiple industries. Quality service through transparent reviews and expert evaluation.',
    de: 'Verbindung von Kunden mit qualifizierten, verifizierten Dienstleistern in verschiedenen Branchen. Qualitätsservice durch transparente Bewertungen und Expertenbewertung.',
    ar: 'ربط العملاء بمقدمي خدمات مؤهلين ومعتمدين عبر صناعات متعددة. خدمة عالية الجودة من خلال مراجعات شفافة وتقييم الخبراء.'
  },
  'footer.quickLinks': {
    en: 'Quick Links',
    de: 'Schnellzugriff',
    ar: 'روابط سريعة'
  },
  'footer.aboutUs': {
    en: 'About Us',
    de: 'Über uns',
    ar: 'معلومات عنا'
  },
  'footer.howItWorks': {
    en: 'How It Works',
    de: 'Wie es funktioniert',
    ar: 'كيف يعمل'
  },
  'footer.contact': {
    en: 'Contact',
    de: 'Kontakt',
    ar: 'اتصل بنا'
  },
  'footer.forProviders': {
    en: 'For Providers',
    de: 'Für Anbieter',
    ar: 'لمقدمي الخدمات'
  },
  'footer.joinAsProvider': {
    en: 'Join as Provider',
    de: 'Als Anbieter beitreten',
    ar: 'انضم كمقدم خدمة'
  },
  'footer.providerLogin': {
    en: 'Provider Login',
    de: 'Anbieter-Login',
    ar: 'تسجيل دخول مقدم الخدمة'
  },
  'footer.verificationProcess': {
    en: 'Verification Process',
    de: 'Verifizierungsprozess',
    ar: 'عملية التحقق'
  },
  'footer.providerSupport': {
    en: 'Provider Support',
    de: 'Anbieter-Support',
    ar: 'دعم مقدم الخدمة'
  },
  'footer.rightsReserved': {
    en: 'All rights reserved.',
    de: 'Alle Rechte vorbehalten.',
    ar: 'جميع الحقوق محفوظة.'
  },
  'footer.privacyPolicy': {
    en: 'Privacy Policy',
    de: 'Datenschutzrichtlinie',
    ar: 'سياسة الخصوصية'
  },
  'footer.termsOfService': {
    en: 'Terms of Service',
    de: 'Nutzungsbedingungen',
    ar: 'شروط الخدمة'
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back, {name}!',
    de: 'Willkommen zurück, {name}!',
    ar: 'مرحباً بعودتك، {name}!'
  },
  'dashboard.manageAppointments': {
    en: 'Manage your appointments and service records',
    de: 'Verwalten Sie Ihre Termine und Serviceaufzeichnungen',
    ar: 'إدارة مواعيدك وسجلات الخدمة الخاصة بك'
  },
  'dashboard.upcoming': {
    en: 'Upcoming',
    de: 'Bevorstehend',
    ar: 'القادمة'
  },
  'dashboard.completed': {
    en: 'Completed',
    de: 'Abgeschlossen',
    ar: 'مكتمل'
  },
  'dashboard.myAppointments': {
    en: 'My Appointments',
    de: 'Meine Termine',
    ar: 'مواعيدي'
  },
  'dashboard.myReviews': {
    en: 'My Reviews',
    de: 'Meine Bewertungen',
    ar: 'مراجعاتي'
  },
  'dashboard.rewards': {
    en: 'Rewards',
    de: 'Belohnungen',
    ar: 'المكافآت'
  },
  'dashboard.upcomingAppointments': {
    en: 'Upcoming Appointments',
    de: 'Bevorstehende Termine',
    ar: 'المواعيد القادمة'
  },
  'dashboard.noUpcomingAppointments': {
    en: 'No upcoming appointments',
    de: 'Keine bevorstehenden Termine',
    ar: 'لا توجد مواعيد قادمة'
  },
  'dashboard.recentAppointments': {
    en: 'Recent Appointments',
    de: 'Kürzliche Termine',
    ar: 'المواعيد الأخيرة'
  },
  'dashboard.noCompletedAppointments': {
    en: 'No completed appointments',
    de: 'Keine abgeschlossenen Termine',
    ar: 'لا توجد مواعيد مكتملة'
  },
  'dashboard.leaveReview': {
    en: 'Leave Review',
    de: 'Bewertung abgeben',
    ar: 'اترك مراجعة'
  },
  'dashboard.uploadReceipt': {
    en: 'Upload Receipt',
    de: 'Beleg hochladen',
    ar: 'تحميل الإيصال'
  },
  'dashboard.completedStatus': {
    en: 'Completed',
    de: 'Abgeschlossen',
    ar: 'مكتمل'
  },
  'dashboard.noReviewsYet': {
    en: 'No reviews yet',
    de: 'Noch keine Bewertungen',
    ar: 'لا توجد مراجعات بعد'
  },
  'dashboard.completeAppointmentsToReview': {
    en: 'Complete appointments to leave reviews and earn reward points',
    de: 'Schließen Sie Termine ab, um Bewertungen zu hinterlassen und Belohnungspunkte zu sammeln',
    ar: 'أكمل المواعيد لترك مراجعات وكسب نقاط المكافأة'
  },
  'dashboard.rewardPoints': {
    en: 'Reward Points',
    de: 'Belohnungspunkte',
    ar: 'نقاط المكافأة'
  },
  'dashboard.availableToRedeem': {
    en: 'Available to redeem',
    de: 'Verfügbar zum Einlösen',
    ar: 'متاح للاسترداد'
  },
  'dashboard.howToEarnPoints': {
    en: 'How to earn points:',
    de: 'Wie man Punkte verdient:',
    ar: 'كيفية كسب النقاط:'
  },
  'dashboard.earnAppointment': {
    en: 'Complete an appointment: +10 points',
    de: 'Termin abschließen: +10 Punkte',
    ar: 'أكمل موعداً: +10 نقاط'
  },
  'dashboard.earnReview': {
    en: 'Leave a verified review: +5 points',
    de: 'Verifizierte Bewertung abgeben: +5 Punkte',
    ar: 'اترك مراجعة موثقة: +5 نقاط'
  },
  'dashboard.earnReceipt': {
    en: 'Upload receipt: +3 points',
    de: 'Beleg hochladen: +3 Punkte',
    ar: 'تحميل إيصال: +3 نقاط'
  },
  'dashboard.appointments': {
    en: 'Appointments',
    de: 'Termine',
    ar: 'المواعيد'
  },
  'dashboard.reviews': {
    en: 'Reviews',
    de: 'Bewertungen',
    ar: 'المراجعات'
  },

  // RegisterPage
  'register.createAccount': {
    en: 'Create your account',
    de: 'Erstellen Sie Ihr Konto',
    ar: 'أنشئ حسابك'
  },
  'register.joinProvider': {
    en: 'Join as a service provider',
    de: 'Als Dienstleister beitreten',
    ar: 'انضم كمقدم خدمة'
  },
  'register.joinCommunity': {
    en: 'Join our service community',
    de: 'Treten Sie unserer Service-Community bei',
    ar: 'انضم إلى مجتمع الخدمة لدينا'
  },
  'register.account': {
    en: 'Account',
    de: 'Konto',
    ar: 'الحساب'
  },
  'register.profile': {
    en: 'Profile',
    de: 'Profil',
    ar: 'الملف الشخصي'
  },
  'register.registerAs': {
    en: 'Register as',
    de: 'Registrieren als',
    ar: 'سجل كـ'
  },
  'register.customer': {
    en: 'Customer',
    de: 'Kunde',
    ar: 'عميل'
  },
  'register.serviceProvider': {
    en: 'Service Provider',
    de: 'Dienstleister',
    ar: 'مقدم خدمة'
  },
  'register.preferredLanguage': {
    en: 'Preferred Language',
    de: 'Bevorzugte Sprache',
    ar: 'اللغة المفضلة'
  },
  'register.fullName': {
    en: 'Full Name',
    de: 'Vollständiger Name',
    ar: 'الاسم الكامل'
  },
  'register.fullNamePlaceholder': {
    en: 'Enter your full name',
    de: 'Geben Sie Ihren vollständigen Namen ein',
    ar: 'أدخل اسمك الكامل'
  },
  'register.email': {
    en: 'Email address',
    de: 'E-Mail-Adresse',
    ar: 'البريد الإلكتروني'
  },
  'register.emailPlaceholder': {
    en: 'Enter your email',
    de: 'Geben Sie Ihre E-Mail-Adresse ein',
    ar: 'أدخل بريدك الإلكتروني'
  },
  'register.phone': {
    en: 'Phone Number',
    de: 'Telefonnummer',
    ar: 'رقم الهاتف'
  },
  'register.phonePlaceholder': {
    en: 'Enter your phone number',
    de: 'Geben Sie Ihre Telefonnummer ein',
    ar: 'أدخل رقم هاتفك'
  },
  'register.password': {
    en: 'Password',
    de: 'Passwort',
    ar: 'كلمة المرور'
  },
  'register.passwordPlaceholder': {
    en: 'Create a password',
    de: 'Erstellen Sie ein Passwort',
    ar: 'أنشئ كلمة مرور'
  },
  'register.confirmPassword': {
    en: 'Confirm Password',
    de: 'Passwort bestätigen',
    ar: 'تأكيد كلمة المرور'
  },
  'register.confirmPasswordPlaceholder': {
    en: 'Confirm your password',
    de: 'Bestätigen Sie Ihr Passwort',
    ar: 'أكد كلمة المرور'
  },
  'register.continue': {
    en: 'Continue',
    de: 'Weiter',
    ar: 'متابعة'
  },
  'register.create': {
    en: 'Create Account',
    de: 'Konto erstellen',
    ar: 'إنشاء حساب'
  },
  'register.alreadyHaveAccount': {
    en: 'Already have an account?',
    de: 'Sie haben bereits ein Konto?',
    ar: 'هل لديك حساب بالفعل؟'
  },
  'register.errorPasswordsNoMatch': {
    en: 'Passwords do not match',
    de: 'Passwörter stimmen nicht überein',
    ar: 'كلمتا المرور غير متطابقتين'
  },
  'register.errorRegistrationFailed': {
    en: 'Registration failed. Please try again.',
    de: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    ar: 'فشل التسجيل. يرجى المحاولة مرة أخرى.'
  },

  // LoginPage
  'login.welcomeBack': {
    en: 'Welcome back',
    de: 'Willkommen zurück',
    ar: 'مرحباً بعودتك'
  },
  'login.signInToContinue': {
    en: 'Sign in to your account to continue',
    de: 'Melden Sie sich an, um fortzufahren',
    ar: 'سجّل الدخول للمتابعة'
  },
  'login.loginAs': {
    en: 'Login as',
    de: 'Anmelden als',
    ar: 'تسجيل الدخول كـ'
  },
  'login.customer': {
    en: 'Customer',
    de: 'Kunde',
    ar: 'عميل'
  },
  'login.serviceProvider': {
    en: 'Service Provider',
    de: 'Dienstleister',
    ar: 'مقدم خدمة'
  },
  'login.administrator': {
    en: 'Administrator',
    de: 'Administrator',
    ar: 'مسؤول'
  },
  'login.expertEvaluator': {
    en: 'Expert Evaluator',
    de: 'Expertenbewerter',
    ar: 'مقيّم خبير'
  },
  'login.email': {
    en: 'Email address',
    de: 'E-Mail-Adresse',
    ar: 'البريد الإلكتروني'
  },
  'login.emailPlaceholder': {
    en: 'Enter your email',
    de: 'Geben Sie Ihre E-Mail-Adresse ein',
    ar: 'أدخل بريدك الإلكتروني'
  },
  'login.password': {
    en: 'Password',
    de: 'Passwort',
    ar: 'كلمة المرور'
  },
  'login.passwordPlaceholder': {
    en: 'Enter your password',
    de: 'Geben Sie Ihr Passwort ein',
    ar: 'أدخل كلمة المرور'
  },
  'login.signingIn': {
    en: 'Signing in...',
    de: 'Anmeldung läuft...',
    ar: 'جاري تسجيل الدخول...'
  },
  'login.forgotPassword': {
    en: 'Forgot your password?',
    de: 'Passwort vergessen?',
    ar: 'هل نسيت كلمة المرور؟'
  },
  'login.dontHaveAccount': {
    en: "Don't have an account?",
    de: 'Sie haben noch kein Konto?',
    ar: 'ليس لديك حساب؟'
  },
  'login.demoCredentials': {
    en: 'Customer Credentials:',
    de: 'Kunden-Zugangsdaten:',
    ar: 'بيانات العميل:'
  },
  'login.demoEmail': {
    en: 'Email: customer@example.com',
    de: 'E-Mail: customer@example.com',
    ar: 'البريد الإلكتروني: customer@example.com'
  },
  'login.demoPassword': {
    en: 'Password: password123',
    de: 'Passwort: password123',
    ar: 'كلمة المرور: password123'
  },
  'login.selectCustomerRole': {
    en: 'Select "Customer" role',
    de: 'Wählen Sie die Rolle "Kunde"',
    ar: 'اختر دور "العميل"'
  },
  'login.demoProviderCredentials': {
    en: 'Provider Credentials:',
    de: 'Anbieter-Zugangsdaten:',
    ar: 'بيانات مقدم الخدمة:'
  },
  'login.demoProviderEmail': {
    en: 'Email: provider@example.com',
    de: 'E-Mail: provider@example.com',
    ar: 'البريد الإلكتروني: provider@example.com'
  },
  'login.demoProviderPassword': {
    en: 'Password: password123',
    de: 'Passwort: password123',
    ar: 'كلمة المرور: password123'
  },
  'login.selectProviderRole': {
    en: 'Select "Service Provider" role',
    de: 'Wählen Sie die Rolle "Dienstleister"',
    ar: 'اختر دور "مقدم الخدمة"'
  },
  'login.demoAdminCredentials': {
    en: 'Admin Credentials:',
    de: 'Admin-Zugangsdaten:',
    ar: 'بيانات المشرف:'
  },
  'login.demoAdminEmail': {
    en: 'Email: admin@example.com',
    de: 'E-Mail: admin@example.com',
    ar: 'البريد الإلكتروني: admin@example.com'
  },
  'login.demoAdminPassword': {
    en: 'Password: password123',
    de: 'Passwort: password123',
    ar: 'كلمة المرور: password123'
  },
  'login.selectAdminRole': {
    en: 'Select "Administrator" role',
    de: 'Wählen Sie die Rolle "Administrator"',
    ar: 'اختر دور "المشرف"'
  },

  // Provider Dashboard
  'dashboard.providerDashboard': {
    en: 'Service Provider Dashboard',
    de: 'Dienstleister-Dashboard',
    ar: 'لوحة تحكم مقدم الخدمة'
  },
  'dashboard.providerWelcome': {
    en: 'Manage your appointments, reports, and expert evaluations.',
    de: 'Verwalten Sie Ihre Termine, Berichte und Expertenbewertungen.',
    ar: 'إدارة المواعيد والتقارير والتقييمات الاحترافية'
  },
  'dashboard.requestedAppointments': {
    en: 'Requested Appointments',
    de: 'Angeforderte Termine',
    ar: 'المواعيد المطلوبة'
  },
  'dashboard.customer': {
    en: 'Customer',
    de: 'Kunde',
    ar: 'العميل'
  },
  'dashboard.date': {
    en: 'Date',
    de: 'Datum',
    ar: 'التاريخ'
  },
  'dashboard.time': {
    en: 'Time',
    de: 'Uhrzeit',
    ar: 'الوقت'
  },
  'dashboard.status': {
    en: 'Status',
    de: 'Status',
    ar: 'الحالة'
  },
  'dashboard.pending': {
    en: 'Pending',
    de: 'Ausstehend',
    ar: 'قيد الانتظار'
  },
  'dashboard.confirmed': {
    en: 'Confirmed',
    de: 'Bestätigt',
    ar: 'تم التأكيد'
  },
  'dashboard.noRequestedAppointments': {
    en: 'No requested appointments.',
    de: 'Keine angeforderten Termine.',
    ar: 'لا توجد مواعيد مطلوبة.'
  },
  'dashboard.personalRatingReport': {
    en: 'Personal Rating Report',
    de: 'Persönlicher Bewertungsbericht',
    ar: 'تقرير التقييم الشخصي'
  },
  'dashboard.ratingReportDesc': {
    en: 'Get a detailed report of your ratings and performance.',
    de: 'Erhalten Sie einen detaillierten Bericht über Ihre Bewertungen und Leistungen.',
    ar: 'احصل على تقرير مفصل عن تقييماتك وأدائك.'
  },
  'dashboard.downloadRatingReport': {
    en: 'Download Report',
    de: 'Bericht herunterladen',
    ar: 'تحميل التقرير'
  },
  'dashboard.mockReportText': {
    en: 'This is a sample report showing your overall rating, number of reviews, and performance compared to other providers.',
    de: 'Dies ist ein Beispielbericht, der Ihre Gesamtbewertung, die Anzahl der Bewertungen und Ihre Leistung im Vergleich zu anderen Anbietern zeigt.',
    ar: 'هذا تقرير تجريبي يوضح تقييمك العام، عدد المراجعات، وأداءك مقارنة بمقدمي الخدمة الآخرين.'
  },
  'dashboard.close': {
    en: 'Close',
    de: 'Schließen',
    ar: 'إغلاق'
  },
  'dashboard.paidExpertEvaluator': {
    en: 'Paid Expert Evaluator',
    de: 'Bezahlter Expertenbewerter',
    ar: 'طلب تقييم خبير مدفوع'
  },
  'dashboard.expertEvaluatorDesc': {
    en: 'You can request a professional expert evaluation for a fee.',
    de: 'Sie können eine professionelle Expertenbewertung gegen Gebühr anfordern.',
    ar: 'يمكنك طلب تقييم خبير احترافي مقابل رسوم.'
  },
  'dashboard.requestExpertEvaluator': {
    en: 'Request Expert Evaluation',
    de: 'Expertenbewertung anfordern',
    ar: 'طلب تقييم خبير مدفوع'
  },
  'dashboard.confirmRequest': {
    en: 'Confirm Request',
    de: 'Anfrage bestätigen',
    ar: 'تأكيد الطلب'
  },
  'dashboard.mockEvaluatorText': {
    en: 'An expert evaluator will contact you within 48 hours after payment is completed.',
    de: 'Ein Expertenbewerter wird Sie innerhalb von 48 Stunden nach Zahlungseingang kontaktieren.',
    ar: 'سيتم التواصل معك من قبل خبير تقييم خلال 48 ساعة بعد إتمام الدفع.'
  },
  'dashboard.evaluatorRequests': {
    en: 'Previous Evaluation Requests',
    de: 'Frühere Bewertungsanfragen',
    ar: 'طلبات التقييم السابقة'
  },
  'dashboard.requestedOn': {
    en: 'Requested On',
    de: 'Angefordert am',
    ar: 'تاريخ الطلب'
  },
  'dashboard.downloadReport': {
    en: 'Download Report',
    de: 'Bericht herunterladen',
    ar: 'تحميل التقرير'
  },

  // Admin Dashboard
  'admin.dashboardTitle': {
    en: 'Admin Panel',
    de: 'Admin-Panel',
    ar: 'لوحة تحكم المشرف'
  },
  'admin.dashboardDesc': {
    en: 'Internal management and quality control.',
    de: 'Interne Verwaltung und Qualitätskontrolle.',
    ar: 'إدارة النظام الداخلي وجودة الخدمة.'
  },
  'admin.overview': {
    en: 'Overview',
    de: 'Übersicht',
    ar: 'نظرة عامة'
  },
  'admin.doctorUserManagement': {
    en: 'Doctor/User Management',
    de: 'Arzt-/Benutzerverwaltung',
    ar: 'إدارة الأطباء والمستخدمين'
  },
  'admin.ratingMonitoring': {
    en: 'Rating Monitoring',
    de: 'Bewertungsüberwachung',
    ar: 'مراقبة التقييمات'
  },
  'admin.evaluatorRequests': {
    en: 'Evaluator Requests',
    de: 'Anfragen für Expertenbewertungen',
    ar: 'طلبات التقييم'
  },
  'admin.totalUsers': {
    en: 'Total Users',
    de: 'Gesamtanzahl Nutzer',
    ar: 'إجمالي المستخدمين'
  },
  'admin.totalDoctors': {
    en: 'Total Doctors',
    de: 'Gesamtanzahl Ärzte',
    ar: 'إجمالي الأطباء'
  },
  'admin.flaggedProfiles': {
    en: 'Flagged Profiles',
    de: 'Markierte Profile',
    ar: 'الملفات المميزة'
  },
  'admin.doctorApplications': {
    en: 'Doctor Applications',
    de: 'Arztanträge',
    ar: 'طلبات الأطباء'
  },
  'admin.name': {
    en: 'Name',
    de: 'Name',
    ar: 'الاسم'
  },
  'admin.email': {
    en: 'Email',
    de: 'E-Mail',
    ar: 'البريد الإلكتروني'
  },
  'admin.status': {
    en: 'Status',
    de: 'Status',
    ar: 'الحالة'
  },
  'admin.actions': {
    en: 'Actions',
    de: 'Aktionen',
    ar: 'إجراءات'
  },
  'admin.pending': {
    en: 'Pending',
    de: 'Ausstehend',
    ar: 'قيد الانتظار'
  },
  'admin.active': {
    en: 'Active',
    de: 'Aktiv',
    ar: 'نشط'
  },
  'admin.approve': {
    en: 'Approve',
    de: 'Genehmigen',
    ar: 'قبول'
  },
  'admin.reject': {
    en: 'Reject',
    de: 'Ablehnen',
    ar: 'رفض'
  },
  'admin.userActivity': {
    en: 'User Activity',
    de: 'Benutzeraktivität',
    ar: 'نشاط المستخدمين'
  },
  'admin.flagged': {
    en: 'Flagged',
    de: 'Markiert',
    ar: 'مميز'
  },
  'admin.avgRating': {
    en: 'Average Rating',
    de: 'Durchschnittsbewertung',
    ar: 'متوسط التقييم'
  },
  'admin.alert': {
    en: 'Alert',
    de: 'Alarm',
    ar: 'تنبيه'
  },
  'admin.disabled': {
    en: 'Temporarily Disabled',
    de: 'Vorübergehend deaktiviert',
    ar: 'معطل مؤقتاً'
  },
  'admin.reviewAndContact': {
    en: 'Review and contact doctor',
    de: 'Arzt überprüfen und kontaktieren',
    ar: 'راجع الطبيب وتواصل معه'
  },
  'admin.doctor': {
    en: 'Doctor',
    de: 'Arzt',
    ar: 'الطبيب'
  },
  'admin.date': {
    en: 'Date',
    de: 'Datum',
    ar: 'التاريخ'
  },
  'admin.open': {
    en: 'Open',
    de: 'Offen',
    ar: 'مفتوح'
  },
  'admin.closed': {
    en: 'Closed',
    de: 'Geschlossen',
    ar: 'مغلق'
  },
  'admin.blogManagement': {
    en: 'Blog Management',
    de: 'Blogverwaltung',
    ar: 'إدارة المدونة'
  },
  'admin.blogTitle': {
    en: 'Blog Title',
    de: 'Blogtitel',
    ar: 'عنوان المقال'
  },
  'admin.blogContent': {
    en: 'Blog Content',
    de: 'Bloginhalt',
    ar: 'محتوى المقال'
  },
  'admin.blogAuthor': {
    en: 'Author',
    de: 'Autor',
    ar: 'الكاتب'
  },
  'admin.blogImage': {
    en: 'Blog Image URL',
    de: 'Bild-URL',
    ar: 'رابط صورة المقال'
  },
  'admin.addBlog': {
    en: 'Add Blog',
    de: 'Blog hinzufügen',
    ar: 'إضافة مقال'
  },
  'admin.deleteBlog': {
    en: 'Delete',
    de: 'Löschen',
    ar: 'حذف'
  },
  'country.Jordan': {
    en: 'Jordan',
    de: 'Jordanien',
    ar: 'الأردن'
  },
  'country.Algeria': {
    en: 'Algeria',
    de: 'Algerien',
    ar: 'الجزائر'
  },
  'country.Egypt': {
    en: 'Egypt',
    de: 'Ägypten',
    ar: 'مصر'
  },
  'country.Germany': {
    en: 'Germany',
    de: 'Deutschland',
    ar: 'ألمانيا'
  },
  'city.Amman': {
    en: 'Amman',
    de: 'Amman',
    ar: 'عمان'
  },
  'city.Irbid': {
    en: 'Irbid',
    de: 'Irbid',
    ar: 'إربد'
  },
  'city.Zarqa': {
    en: 'Zarqa',
    de: 'Zarqa',
    ar: 'الزرقاء'
  },
  'city.Algiers': {
    en: 'Algiers',
    de: 'Algier',
    ar: 'الجزائر العاصمة'
  },
  'city.Oran': {
    en: 'Oran',
    de: 'Oran',
    ar: 'وهران'
  },
  'city.Constantine': {
    en: 'Constantine',
    de: 'Constantine',
    ar: 'قسنطينة'
  },
  'city.Cairo': {
    en: 'Cairo',
    de: 'Kairo',
    ar: 'القاهرة'
  },
  'city.Berlin': {
    en: 'Berlin',
    de: 'Berlin',
    ar: 'برلين'
  },
  // Blog Translations
  'blog.1.title': {
    en: 'How to Choose the Right Doctor for Your Needs',
    de: 'Wie Sie den richtigen Arzt für Ihre Bedürfnisse wählen',
    ar: 'كيف تختار الطبيب المناسب لاحتياجاتك'
  },
  'blog.1.content': {
    en: 'Choosing the right doctor is crucial for your health. In this article, we discuss the main factors to consider, including qualifications, reviews, and communication style...',
    de: 'Die Wahl des richtigen Arztes ist entscheidend für Ihre Gesundheit. In diesem Artikel besprechen wir die wichtigsten Faktoren, darunter Qualifikationen, Bewertungen und Kommunikationsstil...',
    ar: 'اختيار الطبيب المناسب أمر بالغ الأهمية لصحتك. في هذا المقال، نناقش العوامل الرئيسية التي يجب مراعاتها، بما في ذلك المؤهلات، والتقييمات، وأسلوب التواصل...'
  },
  'blog.1.author': {
    en: 'Admin',
    de: 'Verwaltung',
    ar: 'الإدارة'
  },
  'blog.2.title': {
    en: 'The Importance of Regular Health Checkups',
    de: 'Die Bedeutung regelmäßiger Gesundheitschecks',
    ar: 'أهمية الفحوصات الصحية الدورية'
  },
  'blog.2.content': {
    en: 'Regular health checkups help detect problems early and improve treatment and recovery chances. Learn why you should not skip your annual checkup...',
    de: 'Regelmäßige Gesundheitschecks helfen, Probleme frühzeitig zu erkennen und die Chancen auf Behandlung und Genesung zu verbessern. Erfahren Sie, warum Sie Ihren jährlichen Check nicht auslassen sollten...'
    ,ar: 'الفحوصات الصحية الدورية تساعد في اكتشاف المشاكل مبكرًا وتحسين فرص العلاج والشفاء. تعرف على أهمية عدم إهمال الفحص السنوي...'
  },
  'blog.2.author': {
    en: 'Dr. Mona Khaled',
    de: 'Dr. Mona Khaled',
    ar: 'د. منى خالد'
  },
  'blog.3.title': {
    en: 'Understanding Doctor Ratings and Reviews',
    de: 'Arztbewertungen und Rezensionen verstehen',
    ar: 'فهم تقييمات ومراجعات الأطباء'
  },
  'blog.3.content': {
    en: 'Doctor ratings and reviews are a useful tool when choosing a provider. Learn how to interpret them and what to look for...',
    de: 'Arztbewertungen und Rezensionen sind ein nützliches Werkzeug bei der Auswahl eines Anbieters. Erfahren Sie, wie Sie sie interpretieren und worauf Sie achten sollten...'
    ,ar: 'تقييمات ومراجعات الأطباء أداة مفيدة عند اختيار مقدم الخدمة. تعرف كيف تفسرها وما الذي يجب البحث عنه...'
  },
  'blog.3.author': {
    en: 'Admin',
    de: 'Verwaltung',
    ar: 'الإدارة'
  },
};

export type Language = 'en' | 'de' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
});

export function LanguageProvider({ children, initialLanguage = 'ar' }: React.PropsWithChildren<{ initialLanguage?: Language }>) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };
  return { t, language };
}; 