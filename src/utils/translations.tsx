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
    en: 'City',
    de: 'Stadt',
    ar: 'المدينة'
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
  // Review System
  'review.title': {
    en: 'Rate Your Experience',
    de: 'Bewerten Sie Ihre Erfahrung',
    ar: 'قيم تجربتك'
  },
  'review.submit': {
    en: 'Submit Review',
    de: 'Bewertung absenden',
    ar: 'إرسال التقييم'
  },
  'review.communication.title': {
    en: '1. Doctor-Patient Communication',
    de: '1. Arzt-Patient Kommunikation',
    ar: '1. التواصل بين الطبيب والمريض'
  },
  'review.communication.listened': {
    en: 'Did your doctor listen carefully to your concerns?',
    de: 'Hat Ihr Arzt sorgfältig auf Ihre Bedenken gehört?',
    ar: 'هل استمع طبيبك بعناية لاهتماماتك؟'
  },
  'review.communication.explained': {
    en: 'Did your doctor explain diagnosis and treatment clearly?',
    de: 'Hat Ihr Arzt Diagnose und Behandlung klar erklärt?',
    ar: 'هل شرح طبيبك التشخيص والعلاج بوضوح؟'
  },
  'review.communication.respected': {
    en: 'Did you feel respected and understood?',
    de: 'Haben Sie sich respektiert und verstanden gefühlt?',
    ar: 'هل شعرت بالاحترام والفهم؟'
  },
  'review.communication.addressed': {
    en: 'Were your questions fully addressed?',
    de: 'Wurden Ihre Fragen vollständig beantwortet?',
    ar: 'هل تم الرد على أسئلتك بالكامل؟'
  },
  'review.timeliness.title': {
    en: '2. Timeliness and Access to Care',
    de: '2. Pünktlichkeit und Zugang zur Versorgung',
    ar: '2. التوقيت والوصول للرعاية'
  },
  'review.timeliness.scheduling': {
    en: 'How easy was it to schedule your appointment?',
    de: 'Wie einfach war es, Ihren Termin zu vereinbaren?',
    ar: 'كم كان سهلاً تحديد موعدك؟'
  },
  'review.timeliness.waitTime': {
    en: 'How long did you wait before seeing the doctor?',
    de: 'Wie lange mussten Sie warten, bevor Sie den Arzt sahen?',
    ar: 'كم من الوقت انتظرت قبل رؤية الطبيب؟'
  },
  'review.timeliness.timeSpent': {
    en: 'Were you satisfied with the time spent with you?',
    de: 'Waren Sie mit der Zeit zufrieden, die mit Ihnen verbracht wurde?',
    ar: 'هل كنت راضياً عن الوقت الذي قضاه معك؟'
  },
  'review.timeliness.onTime': {
    en: 'Was your appointment started on time?',
    de: 'Wurde Ihr Termin pünktlich begonnen?',
    ar: 'هل بدأ موعدك في الوقت المحدد؟'
  },
  'review.professionalism.title': {
    en: '3. Professionalism and Empathy',
    de: '3. Professionalität und Empathie',
    ar: '3. الاحترافية والتعاطف'
  },
  'review.professionalism.courtesy': {
    en: 'How would you rate your doctor\'s courtesy and professionalism?',
    de: 'Wie würden Sie die Höflichkeit und Professionalität Ihres Arztes bewerten?',
    ar: 'كيف تقيم أدب ومهنية طبيبك؟'
  },
  'review.professionalism.comfortable': {
    en: 'Did you feel comfortable discussing personal health issues?',
    de: 'Haben Sie sich wohl gefühlt, persönliche Gesundheitsprobleme zu besprechen?',
    ar: 'هل شعرت بالراحة في مناقشة مشاكل صحتك الشخصية؟'
  },
  'review.professionalism.empathy': {
    en: 'Did your doctor show empathy and genuine concern?',
    de: 'Hat Ihr Arzt Empathie und echte Sorge gezeigt?',
    ar: 'هل أظهر طبيبك التعاطف والاهتمام الحقيقي؟'
  },
  'review.professionalism.cultural': {
    en: 'Were your cultural or religious values respected?',
    de: 'Wurden Ihre kulturellen oder religiösen Werte respektiert?',
    ar: 'هل تم احترام قيمك الثقافية أو الدينية؟'
  },
  'review.quality.title': {
    en: '4. Quality of Medical Care',
    de: '4. Qualität der medizinischen Versorgung',
    ar: '4. جودة الرعاية الطبية'
  },
  'review.quality.diagnosis': {
    en: 'How satisfied are you with the accuracy of diagnosis and treatment?',
    de: 'Wie zufrieden sind Sie mit der Genauigkeit der Diagnose und Behandlung?',
    ar: 'كم أنت راضٍ عن دقة التشخيص والعلاج؟'
  },
  'review.quality.instructions': {
    en: 'Did you receive clear instructions for medication and follow-up?',
    de: 'Haben Sie klare Anweisungen für Medikamente und Nachsorge erhalten?',
    ar: 'هل تلقيت تعليمات واضحة للأدوية والمتابعة؟'
  },
  'review.quality.improved': {
    en: 'Do you feel your health improved as a result of treatment?',
    de: 'Haben Sie das Gefühl, dass sich Ihre Gesundheit durch die Behandlung verbessert hat?',
    ar: 'هل تشعر أن صحتك تحسنت نتيجة للعلاج؟'
  },
  'review.quality.tests': {
    en: 'Were any tests or procedures explained before being performed?',
    de: 'Wurden Tests oder Verfahren vor der Durchführung erklärt?',
    ar: 'هل تم شرح أي فحوصات أو إجراءات قبل تنفيذها؟'
  },
  'review.facility.title': {
    en: '5. Facility and Service Experience',
    de: '5. Einrichtung und Service-Erfahrung',
    ar: '5. تجربة المنشأة والخدمة'
  },
  'review.facility.cleanliness': {
    en: 'How would you rate the cleanliness and comfort of the clinic?',
    de: 'Wie würden Sie die Sauberkeit und den Komfort der Klinik bewerten?',
    ar: 'كيف تقيم نظافة وراحة العيادة؟'
  },
  'review.facility.staff': {
    en: 'Were staff members professional and helpful?',
    de: 'Waren die Mitarbeiter professionell und hilfsbereit?',
    ar: 'هل كان الموظفون مهنيين ومفيدين؟'
  },
  'review.facility.coordination': {
    en: 'How satisfied were you with the coordination between doctor and staff?',
    de: 'Wie zufrieden waren Sie mit der Koordination zwischen Arzt und Personal?',
    ar: 'كم كنت راضياً عن التنسيق بين الطبيب والموظفين؟'
  },
  'review.overall.title': {
    en: '6. Overall Satisfaction and Recommendations',
    de: '6. Gesamtzufriedenheit und Empfehlungen',
    ar: '6. الرضا العام والتوصيات'
  },
  'review.overall.satisfaction': {
    en: 'Overall, how satisfied are you with your doctor\'s care?',
    de: 'Insgesamt, wie zufrieden sind Sie mit der Betreuung Ihres Arztes?',
    ar: 'بشكل عام، كم أنت راضٍ عن رعاية طبيبك؟'
  },
  'review.overall.recommend': {
    en: 'Would you recommend this doctor or facility to others?',
    de: 'Würden Sie diesen Arzt oder diese Einrichtung anderen empfehlen?',
    ar: 'هل تنصح بهذا الطبيب أو المنشأة للآخرين؟'
  },
  'review.overall.improvements': {
    en: 'What could the doctor or clinic do to improve your experience?',
    de: 'Was könnte der Arzt oder die Klinik tun, um Ihre Erfahrung zu verbessern?',
    ar: 'ماذا يمكن للطبيب أو العيادة فعله لتحسين تجربتك؟'
  },
  'review.overall.improvementsPlaceholder': {
    en: 'Share your suggestions for improvement...',
    de: 'Teilen Sie Ihre Verbesserungsvorschläge mit...',
    ar: 'شارك اقتراحاتك للتحسين...'
  },
  'common.selectTime': {
    en: 'Select Time',
    de: 'Uhrzeit auswählen',
    ar: 'اختر الوقت'
  },
  'common.sunday': {
    en: 'Sunday',
    de: 'Sonntag',
    ar: 'الأحد'
  },
  'common.monday': {
    en: 'Monday',
    de: 'Montag',
    ar: 'الاثنين'
  },
  'common.tuesday': {
    en: 'Tuesday',
    de: 'Dienstag',
    ar: 'الثلاثاء'
  },
  'common.wednesday': {
    en: 'Wednesday',
    de: 'Mittwoch',
    ar: 'الأربعاء'
  },
  'common.thursday': {
    en: 'Thursday',
    de: 'Donnerstag',
    ar: 'الخميس'
  },
  'common.friday': {
    en: 'Friday',
    de: 'Freitag',
    ar: 'الجمعة'
  },
  'common.saturday': {
    en: 'Saturday',
    de: 'Samstag',
    ar: 'السبت'
  },
  'common.bookingSuccess': {
    en: 'Booking successful!',
    de: 'Buchung erfolgreich!',
    ar: 'تم الحجز بنجاح!'
  },
  'common.bookingError': {
    en: 'Please select a day and time.',
    de: 'Bitte wählen Sie einen Tag und eine Uhrzeit.',
    ar: 'يرجى اختيار اليوم والوقت.'
  },
  'common.yes': {
    en: 'Yes',
    ar: 'نعم',
    de: 'Ja'
  },
  'common.no': {
    en: 'No',
    ar: 'لا',
    de: 'Nein'
  },
  'common.error': {
    en: 'Please fill all required fields.',
    ar: 'يرجى تعبئة جميع الحقول المطلوبة.',
    de: 'Bitte füllen Sie alle Pflichtfelder aus.'
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
  'dashboard.viewReceipt': {
    en: 'View Receipt',
    de: 'Beleg anzeigen',
    ar: 'عرض الإيصال'
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
  'dashboard.cancel': {
    en: 'Cancel',
    de: 'Abbrechen',
    ar: 'إلغاء'
  },
  'dashboard.completedToast': {
    en: '+10 points for completing an appointment!',
    ar: '+10 نقاط لإكمال الموعد!',
    de: '+10 Punkte für einen abgeschlossenen Termin!'
  },
  'dashboard.reviewToast': {
    en: '+5 points for leaving a review!',
    ar: '+5 نقاط لكتابة تقييم!',
    de: '+5 Punkte für eine Bewertung!'
  },
  'dashboard.receiptToast': {
    en: '+3 points for uploading a receipt!',
    ar: '+3 نقاط لتحميل إيصال!',
    de: '+3 Punkte für das Hochladen eines Belegs!'
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
  'dashboard.actions': {
    en: 'Actions',
    de: 'Aktionen',
    ar: 'إجراءات'
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
  'dashboard.cancelled': {
    en: 'Cancelled',
    de: 'Storniert',
    ar: 'ملغي'
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
  'admin.appointments': {
    en: 'Appointments',
    de: 'Termine',
    ar: 'المواعيد'
  },
  'admin.customer': {
    en: 'Customer',
    de: 'Kunde',
    ar: 'العميل'
  },
  'admin.provider': {
    en: 'Provider',
    de: 'Anbieter',
    ar: 'مقدم الخدمة'
  },
  'admin.time': {
    en: 'Time',
    de: 'Uhrzeit',
    ar: 'الوقت'
  },
  'admin.category': {
    en: 'Category',
    de: 'Kategorie',
    ar: 'الفئة'
  },
  'admin.yes': {
    en: 'Yes',
    de: 'Ja',
    ar: 'نعم'
  },
  'admin.no': {
    en: 'No',
    de: 'Nein',
    ar: 'لا'
  },
  'admin.fullAccess': {
    en: 'Full Access',
    de: 'Vollzugriff',
    ar: 'وصول كامل'
  },
  'admin.userManagement': {
    en: 'User Management',
    de: 'Benutzerverwaltung',
    ar: 'إدارة المستخدمين'
  },
  'admin.systemSettings': {
    en: 'System Settings',
    de: 'Systemeinstellungen',
    ar: 'إعدادات النظام'
  },
  'admin.profileManagement': {
    en: 'Profile Management',
    de: 'Profilverwaltung',
    ar: 'إدارة الملف الشخصي'
  },
  'admin.bookAppointments': {
    en: 'Book Appointments',
    de: 'Termine buchen',
    ar: 'حجز المواعيد'
  },
  'admin.leaveReviews': {
    en: 'Leave Reviews',
    de: 'Bewertungen abgeben',
    ar: 'ترك المراجعات'
  },
  'admin.profile': {
    en: 'Profile',
    de: 'Profil',
    ar: 'الملف الشخصي'
  },
  'admin.qualityAssessment': {
    en: 'Quality Assessment',
    de: 'Qualitätsbewertung',
    ar: 'تقييم الجودة'
  },
  'admin.providerEvaluation': {
    en: 'Provider Evaluation',
    de: 'Anbieterbewertung',
    ar: 'تقييم مقدم الخدمة'
  },
  'admin.loginAttempt': {
    en: 'Login Attempt',
    de: 'Anmeldeversuch',
    ar: 'محاولة تسجيل الدخول'
  },
  'admin.permissionChange': {
    en: 'Permission Change',
    de: 'Berechtigungsänderung',
    ar: 'تغيير الصلاحيات'
  },
  'admin.failedLogin': {
    en: 'Failed Login',
    de: 'Fehlgeschlagene Anmeldung',
    ar: 'تسجيل دخول فاشل'
  },
  'admin.roleUpdate': {
    en: 'Role Update',
    de: 'Rollenaktualisierung',
    ar: 'تحديث الدور'
  },
  'admin.success': {
    en: 'Success',
    de: 'Erfolgreich',
    ar: 'نجح'
  },
  'admin.failed': {
    en: 'Failed',
    de: 'Fehlgeschlagen',
    ar: 'فشل'
  },
  'admin.minutesAgo': {
    en: 'minutes ago',
    de: 'Minuten zuvor',
    ar: 'دقائق مضت'
  },
  'admin.hourAgo': {
    en: 'hour ago',
    de: 'Stunde zuvor',
    ar: 'ساعة مضت'
  },
  'admin.hoursAgo': {
    en: 'hours ago',
    de: 'Stunden zuvor',
    ar: 'ساعات مضت'
  },
  'dashboard.dashboard': {
    en: 'Dashboard',
    de: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'dashboard.profile': {
    en: 'Profile',
    de: 'Profil',
    ar: 'الملف الشخصي'
  },
  'dashboard.analytics': {
    en: 'Analytics',
    de: 'Analytik',
    ar: 'التحليلات'
  },
  'dashboard.appointmentsShort': {
    en: 'Appts',
    de: 'Termine',
    ar: 'المواعيد'
  },
  'dashboard.ratingReport': {
    en: 'Rating Report',
    de: 'Bewertungsbericht',
    ar: 'تقرير التقييم'
  },
  'dashboard.reports': {
    en: 'Reports',
    de: 'Berichte',
    ar: 'التقارير'
  },
  'dashboard.expertEvaluator': {
    en: 'Expert Evaluator',
    de: 'Expertenbewertung',
    ar: 'تقييم الخبراء'
  },
  'dashboard.evaluator': {
    en: 'Evaluator',
    de: 'Bewerter',
    ar: 'المقيم'
  },
  'dashboard.expert': {
    en: 'Expert',
    de: 'Experte',
    ar: 'خبير'
  },
  'dashboard.updateProfile': {
    en: 'Update Profile',
    de: 'Profil aktualisieren',
    ar: 'تحديث الملف الشخصي'
  },
  'dashboard.viewAnalytics': {
    en: 'View Analytics',
    de: 'Analytik anzeigen',
    ar: 'عرض التحليلات'
  },
  'dashboard.quickActions': {
    en: 'Quick Actions',
    de: 'Schnellaktionen',
    ar: 'الإجراءات السريعة'
  },
  'dashboard.totalAppointments': {
    en: 'Total Appointments',
    de: 'Gesamte Termine',
    ar: 'إجمالي المواعيد'
  },
  'dashboard.rating': {
    en: 'Rating',
    de: 'Bewertung',
    ar: 'التقييم'
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
  'expertApp.title': {
    en: 'Request to Join as a Secret Evaluator',
    ar: 'طلب الانضمام كمقيم سري',
    de: 'Bewerbung als Mystery Evaluator'
  },
  'expertApp.intro1': {
    en: 'Would you like to evaluate stores and commercial establishments in your area? For your services, you will receive compensation (up to ___ and/or a fee of ____ dollars).',
    ar: 'هل ترغب في تقييم المتاجر والمنشآت التجارية في منطقتك؟ مقابل خدماتك ستحصل على تعويض (حتى ___ و/أو رسوم قدرها ____ دولار).',
    de: 'Möchten Sie Geschäfte und Betriebe in Ihrer Nähe bewerten? Für Ihre Dienste erhalten Sie eine Vergütung (bis zu ___ und/oder eine Gebühr von ____ Dollar).'
  },
  'expertApp.profileTitle': {
    en: 'Profile:',
    ar: 'الملف التعريفي:',
    de: 'Profil:'
  },
  'expertApp.profileText': {
    en: '(Your Company Name) is a customer service quality appraisal company operating across the Kingdom, aiming to provide business owners with a realistic assessment of how customers perceive their stores and services. The evaluator assumes no legal responsibility. The evaluator acts confidentially as an independent contractor, and client names are not disclosed.',
    ar: '(اسم شركتك) هي شركة تقييم جودة خدمة العملاء تعمل في جميع أنحاء المملكة، وتهدف إلى تزويد أصحاب الأعمال بتقييم واقعي لكيفية رؤية العملاء لمتاجرهم وخدماتهم. لا يتحمل المقيم أي مسؤولية قانونية. يعمل المقيم بشكل سري كمقاول مستقل ولا يتم الكشف عن أسماء العملاء.',
    de: '(Ihr Firmenname) ist ein Unternehmen für Qualitätsbewertung im Kundenservice, das im gesamten Königreich tätig ist und Geschäftsinhabern eine realistische Einschätzung der Kundenerfahrung bietet. Der Bewerter übernimmt keine rechtliche Verantwortung. Die Bewertung erfolgt vertraulich als unabhängiger Auftragnehmer, Kundennamen werden nicht offengelegt.'
  },
  'expertApp.intro2': {
    en: 'This work requires attention to detail. If you are interested, please fill out the application form below. If not, please share this request with anyone (over 25) who may be interested.',
    ar: 'يتطلب هذا العمل الانتباه للتفاصيل. إذا كنت مهتمًا، يرجى تعبئة نموذج الطلب أدناه. إذا لم تكن مهتمًا، يرجى مشاركة هذا الطلب مع أي شخص (فوق سن 25) قد يكون مهتمًا.',
    de: 'Diese Tätigkeit erfordert Aufmerksamkeit für Details. Wenn Sie interessiert sind, füllen Sie bitte das untenstehende Bewerbungsformular aus. Wenn nicht, geben Sie diese Anfrage bitte an jemanden weiter (über 25 Jahre), der interessiert sein könnte.'
  },
  'expertApp.thankYou': {
    en: 'Thank you very much! (Your Name), Chairman (Your Company Name)',
    ar: 'شكرًا جزيلًا! (اسمك)، رئيس مجلس إدارة (اسم شركتك)',
    de: 'Vielen Dank! (Ihr Name), Vorsitzender (Ihr Firmenname)'
  },
  'expertApp.legalAckTitle': {
    en: 'Legal Acknowledgment',
    ar: 'إقرار قانوني',
    de: 'Rechtliche Bestätigung'
  },
  'expertApp.legalAckText': {
    en: 'I acknowledge that the forms and materials of (Your Company Name) are proprietary and confidential. Any evaluator suspected of sharing these forms with other firms will be subject to legal action to the fullest extent permitted by law.',
    ar: 'أقر بأن نماذج ومواد (اسم شركتك) ملكية خاصة وسرية. أي مقيم يشتبه في مشاركته هذه النماذج مع شركات تقييم أخرى سيخضع للإجراءات القانونية إلى أقصى حد يسمح به القانون.',
    de: 'Ich bestätige, dass die Formulare und Materialien von (Ihr Firmenname) urheberrechtlich geschützt und vertraulich sind. Jeder Bewerter, der verdächtigt wird, diese Formulare mit anderen Bewertungsfirmen zu teilen, wird im vollen gesetzlich zulässigen Umfang rechtlich belangt.'
  },
  'expertApp.legalAckAgree': {
    en: 'I agree',
    ar: 'أوافق',
    de: 'Ich stimme zu'
  },
  'expertApp.signature': {
    en: 'Signature',
    ar: 'التوقيع',
    de: 'Unterschrift'
  },
  'expertApp.date': {
    en: 'Date',
    ar: 'التاريخ',
    de: 'Datum'
  },
  'expertApp.workedForFirmQ': {
    en: 'Do you currently work or have you ever worked for a confidential valuation firm as an employee or owner/manager?',
    ar: 'هل تعمل حاليًا أو سبق لك العمل في شركة تقييم سرية كموظف أو مالك/مدير؟',
    de: 'Arbeiten Sie derzeit oder haben Sie jemals für eine vertrauliche Bewertungsfirma als Mitarbeiter oder Inhaber/Manager gearbeitet?'
  },
  'expertApp.name': {
    en: 'Your Name',
    ar: 'اسمك',
    de: 'Ihr Name'
  },
  'expertApp.address': {
    en: 'Address',
    ar: 'العنوان',
    de: 'Adresse'
  },
  'expertApp.city': {
    en: 'City',
    ar: 'المدينة',
    de: 'Stadt'
  },
  'expertApp.phone': {
    en: 'Phone Number',
    ar: 'رقم الهاتف',
    de: 'Telefonnummer'
  },
  'expertApp.email': {
    en: 'Email Address',
    ar: 'البريد الإلكتروني',
    de: 'E-Mail-Adresse'
  },
  'expertApp.function': {
    en: 'Function',
    ar: 'الوظيفة',
    de: 'Funktion'
  },
  'expertApp.companyActivityQ': {
    en: 'For employees: What kind of activity does your company operate in?',
    ar: 'للموظفين: ما نوع النشاط الذي تعمل فيه شركتك؟',
    de: 'Für Angestellte: In welchem Bereich ist Ihr Unternehmen tätig?'
  },
  'expertApp.doneAssessmentQ': {
    en: 'Have you ever done confidential assessment?',
    ar: 'هل سبق لك القيام بتقييم سري؟',
    de: 'Haben Sie jemals eine vertrauliche Bewertung durchgeführt?'
  },
  'expertApp.yearsQ': {
    en: 'Number of years',
    ar: 'عدد السنوات',
    de: 'Anzahl der Jahre'
  },
  'expertApp.certifiedQ': {
    en: 'Are you a certified mystery shopper?',
    ar: 'هل أنت متسوق سري معتمد؟',
    de: 'Sind Sie ein zertifizierter Mystery Shopper?'
  },
  'expertApp.accreditorQ': {
    en: 'If yes, what is the name of the entity that granted you the accreditation?',
    ar: 'إذا كانت الإجابة نعم، ما اسم الجهة التي منحتك الاعتماد؟',
    de: 'Falls ja, wie heißt die akkreditierende Stelle?'
  },
  'expertApp.ageGroupQ': {
    en: 'Age group',
    ar: 'الفئة العمرية',
    de: 'Altersgruppe'
  },
  'expertApp.ageGroup.18–35': {
    en: '18–35',
    ar: '18–35',
    de: '18–35'
  },
  'expertApp.ageGroup.36–50': {
    en: '36–50',
    ar: '36–50',
    de: '36–50'
  },
  'expertApp.ageGroup.51–60': {
    en: '51–60',
    ar: '51–60',
    de: '51–60'
  },
  'expertApp.ageGroup.Over 61': {
    en: 'Over 61',
    ar: 'أكثر من 61',
    de: 'Über 61'
  },
  'expertApp.incomeQ': {
    en: 'Annual household income',
    ar: 'الدخل السنوي للأسرة',
    de: 'Jährliches Haushaltseinkommen'
  },
  'expertApp.income.18,000–34,000': {
    en: '$18,000–34,000',
    ar: '18,000–34,000 $',
    de: '18.000–34.000 $'
  },
  'expertApp.income.34,000–75,000': {
    en: '$34,000–75,000',
    ar: '34,000–75,000 $',
    de: '34.000–75.000 $'
  },
  'expertApp.income.over 75,000': {
    en: 'Over $75,000',
    ar: 'أكثر من $75,000 ',
    de: 'Über 75.000 $'
  },
  'expertApp.educationQ': {
    en: 'Education Level',
    ar: 'المستوى التعليمي',
    de: 'Bildungsniveau'
  },
  'expertApp.availableDaysQ': {
    en: 'Please specify the days during which you can perform confidential assessment tasks:',
    ar: 'يرجى تحديد الأيام التي يمكنك فيها أداء مهام التقييم السري:',
    de: 'Bitte geben Sie die Tage an, an denen Sie vertrauliche Bewertungsaufgaben übernehmen können:'
  },
  'expertApp.motivationQ': {
    en: 'Please write a few lines about why you want to join our program:',
    ar: 'يرجى كتابة بعض السطور حول سبب رغبتك في الانضمام إلى برنامجنا:',
    de: 'Bitte schreiben Sie ein paar Zeilen, warum Sie an unserem Programm teilnehmen möchten:'
  },
  'expertApp.submit': {
    en: 'Submit Application',
    ar: 'إرسال الطلب',
    de: 'Bewerbung absenden'
  },
  'expertApp.note': {
    en: 'Note: Any application with unanswered questions will not be considered.',
    ar: 'ملاحظة: لن يتم النظر في أي طلب لم يتم الإجابة على جميع أسئلته.',
    de: 'Hinweis: Bewerbungen mit unbeantworteten Fragen werden nicht berücksichtigt.'
  },
  'expertApp.submittedTitle': {
    en: 'Application Submitted',
    ar: 'تم إرسال الطلب',
    de: 'Bewerbung eingereicht'
  },
  'expertApp.submittedMessage': {
    en: 'Thank you for your interest! Your application has been sent for review. We will contact you soon.',
    ar: 'شكرًا لاهتمامك! تم إرسال طلبك للمراجعة وسنتواصل معك قريبًا.',
    de: 'Vielen Dank für Ihr Interesse! Ihre Bewerbung wurde zur Überprüfung eingereicht. Wir werden Sie in Kürze kontaktieren.'
  },
  'expertApp.error.legalAck': {
    en: 'You must acknowledge the legal statement.',
    ar: 'يجب الإقرار بالبيان القانوني.',
    de: 'Sie müssen die rechtliche Erklärung bestätigen.'
  },
  'expertApp.error.signatureRequired': {
    en: 'Signature is required.',
    ar: 'التوقيع مطلوب.',
    de: 'Unterschrift erforderlich.'
  },
  'expertApp.error.dateRequired': {
    en: 'Date is required.',
    ar: 'التاريخ مطلوب.',
    de: 'Datum erforderlich.'
  },
  'expertApp.error.workedForFirm': {
    en: 'Please answer this question.',
    ar: 'يرجى الإجابة على هذا السؤال.',
    de: 'Bitte beantworten Sie diese Frage.'
  },
  'expertApp.error.nameRequired': {
    en: 'Name is required.',
    ar: 'الاسم مطلوب.',
    de: 'Name erforderlich.'
  },
  'expertApp.error.addressRequired': {
    en: 'Address is required.',
    ar: 'العنوان مطلوب.',
    de: 'Adresse erforderlich.'
  },
  'expertApp.error.cityRequired': {
    en: 'City is required.',
    ar: 'المدينة مطلوبة.',
    de: 'Stadt erforderlich.'
  },
  'expertApp.error.phoneRequired': {
    en: 'Phone number is required.',
    ar: 'رقم الهاتف مطلوب.',
    de: 'Telefonnummer erforderlich.'
  },
  'expertApp.error.emailRequired': {
    en: 'Email is required.',
    ar: 'البريد الإلكتروني مطلوب.',
    de: 'E-Mail erforderlich.'
  },
  'expertApp.error.functionRequired': {
    en: 'Function is required.',
    ar: 'الوظيفة مطلوبة.',
    de: 'Funktion erforderlich.'
  },
  'expertApp.error.companyActivityRequired': {
    en: 'Please specify your company activity.',
    ar: 'يرجى تحديد نشاط شركتك.',
    de: 'Bitte geben Sie die Tätigkeit Ihres Unternehmens an.'
  },
  'expertApp.error.doneAssessment': {
    en: 'Please answer this question.',
    ar: 'يرجى الإجابة على هذا السؤال.',
    de: 'Bitte beantworten Sie diese Frage.'
  },
  'expertApp.error.yearsRequired': {
    en: 'Please specify number of years.',
    ar: 'يرجى تحديد عدد السنوات.',
    de: 'Bitte geben Sie die Anzahl der Jahre an.'
  },
  'expertApp.error.certified': {
    en: 'Please answer this question.',
    ar: 'يرجى الإجابة على هذا السؤال.',
    de: 'Bitte beantworten Sie diese Frage.'
  },
  'expertApp.error.accreditorRequired': {
    en: 'Please specify accrediting entity.',
    ar: 'يرجى تحديد جهة الاعتماد.',
    de: 'Bitte geben Sie die akkreditierende Stelle an.'
  },
  'expertApp.error.ageGroupRequired': {
    en: 'Please select your age group.',
    ar: 'يرجى اختيار الفئة العمرية.',
    de: 'Bitte wählen Sie Ihre Altersgruppe aus.'
  },
  'expertApp.error.incomeRequired': {
    en: 'Please select your income.',
    ar: 'يرجى اختيار الدخل.',
    de: 'Bitte wählen Sie Ihr Einkommen aus.'
  },
  'expertApp.error.educationRequired': {
    en: 'Please specify your education level.',
    ar: 'يرجى تحديد المستوى التعليمي.',
    de: 'Bitte geben Sie Ihr Bildungsniveau an.'
  },
  'expertApp.error.availableDaysRequired': {
    en: 'Please select at least one day.',
    ar: 'يرجى اختيار يوم واحد على الأقل.',
    de: 'Bitte wählen Sie mindestens einen Tag aus.'
  },
  'expertApp.error.motivationRequired': {
    en: 'Please write a few lines about your motivation.',
    ar: 'يرجى كتابة بعض السطور حول سبب رغبتك في الانضمام.',
    de: 'Bitte schreiben Sie ein paar Zeilen zu Ihrer Motivation.'
  },
  'features.expertEvaluations': {
    en: 'Expert Evaluations',
    de: 'Expertenbewertungen',
    ar: 'تقييمات الخبراء'
  },
  'features.expertEvaluationsDesc': {
    en: 'Get professional evaluations from certified experts to improve your service quality and reputation.',
    de: 'Erhalten Sie professionelle Bewertungen von zertifizierten Experten, um Ihre Servicequalität und Ihren Ruf zu verbessern.',
    ar: 'احصل على تقييمات مهنية من خبراء معتمدين لتحسين جودة خدمتك وسمعتك.'
  }
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