import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
}

const initialState: ExpertApplicationForm = {
  legalAck: false,
  date: '',
  workedForFirm: '',
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  function: '',
  companyActivity: '',
  doneAssessment: '',
  years: '',
  certified: '',
  accreditor: '',
  ageGroup: '',
  income: '',
  education: '',
  availableDays: [],
  motivation: '',
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ageGroups = [
  '18–35',
  '36–50',
  '51–60',
  'Over 61',
];

const incomes = [
  '18,000–34,000',
  '34,000–75,000',
  'over 75,000',
];

export default function ExpertEvaluatorApplication() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<ExpertApplicationForm>(initialState);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'legalAck') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else if (type === 'checkbox' && name === 'availableDays') {
      const checked = (e.target as HTMLInputElement).checked;
      const day = value;
      const days = checked
        ? [...form.availableDays, day]
        : form.availableDays.filter((d) => d !== day);
      setForm({ ...form, availableDays: days });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.legalAck) newErrors.legalAck = t('expertApp.error.legalAck');
    if (!form.date) newErrors.date = t('expertApp.error.dateRequired');
    if (!form.workedForFirm) newErrors.workedForFirm = t('expertApp.error.workedForFirm');
    if (!form.name) newErrors.name = t('expertApp.error.nameRequired');
    if (!form.address) newErrors.address = t('expertApp.error.addressRequired');
    if (!form.city) newErrors.city = t('expertApp.error.cityRequired');
    if (!form.phone) newErrors.phone = t('expertApp.error.phoneRequired');
    if (!form.email) newErrors.email = t('expertApp.error.emailRequired');
    if (!form.function) newErrors.function = t('expertApp.error.functionRequired');
    if (form.function.toLowerCase().includes('employee') && !form.companyActivity) {
      newErrors.companyActivity = t('expertApp.error.companyActivityRequired');
    }
    if (!form.doneAssessment) newErrors.doneAssessment = t('expertApp.error.doneAssessment');
    if (form.doneAssessment === 'yes' && !form.years) newErrors.years = t('expertApp.error.yearsRequired');
    if (!form.certified) newErrors.certified = t('expertApp.error.certified');
    if (form.certified === 'yes' && !form.accreditor) newErrors.accreditor = t('expertApp.error.accreditorRequired');
    if (!form.ageGroup) newErrors.ageGroup = t('expertApp.error.ageGroupRequired');
    if (!form.income) newErrors.income = t('expertApp.error.incomeRequired');
    if (!form.education) newErrors.education = t('expertApp.error.educationRequired');
    if (form.availableDays.length === 0) newErrors.availableDays = t('expertApp.error.availableDaysRequired');
    if (!form.motivation) newErrors.motivation = t('expertApp.error.motivationRequired');
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Save to localStorage
      const prev = localStorage.getItem('expertApplications');
      const applications = prev ? JSON.parse(prev) : [];
      applications.push({ ...form, submittedAt: new Date().toISOString() });
      localStorage.setItem('expertApplications', JSON.stringify(applications));
      setSubmitted(true);
      toast.success(t('expertApp.submittedMessage'));
    } else {
      toast.error(t('common.error') || 'Please fill all required fields.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('expertApp.submittedTitle')}</h2>
        <p>{t('expertApp.submittedMessage')}</p>
      </div>
    );
  }

  // Add a variable for RTL
  const isRTL = language === 'ar';

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8 ${isRTL ? 'text-right' : ''}`}>
      <ToastContainer position={isRTL ? 'top-left' : 'top-right'} rtl={isRTL} autoClose={2000} />
      <h1 className={`text-2xl font-bold mb-4 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.title')}</h1>
      <p className={`mb-4 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.intro1')}</p>
      <p className={`mb-4 text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}><b>{t('expertApp.profileTitle')}</b> {t('expertApp.profileText')}</p>
      <p className={`mb-4 text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.intro2')}</p>
      <p className={`mb-4 text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.thankYou')}</p>
      <form onSubmit={handleSubmit}>
        <fieldset className={`mb-6 border p-4 rounded ${isRTL ? 'text-right' : ''}`}>
          <legend className="font-semibold">{t('expertApp.legalAckTitle')}</legend>
          <p className={`text-xs mb-2 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.legalAckText')}</p>
          <label className={`flex items-center mb-2 ${isRTL ? 'justify-end' : ''}`}>
            <input type="checkbox" name="legalAck" checked={form.legalAck} onChange={handleChange} />
            <span className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>{t('expertApp.legalAckAgree')}</span>
          </label>
          {errors.legalAck && <div className={`text-red-500 text-xs mb-2 ${isRTL ? 'text-right' : ''}`}>{errors.legalAck}</div>}
          <div className={`flex gap-4 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-xs">{t('expertApp.date')}</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-2 py-1 w-32" />
              {errors.date && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.date}</div>}
            </div>
          </div>
        </fieldset>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.workedForFirmQ')}</label>
          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <label>
              <input type="radio" name="workedForFirm" value="yes" checked={form.workedForFirm === 'yes'} onChange={handleChange} /> {t('common.yes')}
            </label>
            <label>
              <input type="radio" name="workedForFirm" value="no" checked={form.workedForFirm === 'no'} onChange={handleChange} /> {t('common.no')}
            </label>
          </div>
          {errors.workedForFirm && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.workedForFirm}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.name')}</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.name && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.name}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.address')}</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.address && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.address}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.city')}</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.city && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.city}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.phone')}</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.phone && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.phone}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.email')}</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.email && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.email}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.function')}</label>
          <input type="text" name="function" value={form.function} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
          {errors.function && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.function}</div>}
        </div>
        {form.function.toLowerCase().includes('employee') && (
          <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
            <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.companyActivityQ')}</label>
            <input type="text" name="companyActivity" value={form.companyActivity} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
            {errors.companyActivity && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.companyActivity}</div>}
          </div>
        )}
        <div className="mb-4">
          <label className="block font-semibold mb-1">{t('expertApp.doneAssessmentQ')}</label>
          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <label>
              <input type="radio" name="doneAssessment" value="yes" checked={form.doneAssessment === 'yes'} onChange={handleChange} /> {t('common.yes')}
            </label>
            <label>
              <input type="radio" name="doneAssessment" value="no" checked={form.doneAssessment === 'no'} onChange={handleChange} /> {t('common.no')}
            </label>
          </div>
          {errors.doneAssessment && <div className="text-red-500 text-xs">{errors.doneAssessment}</div>}
        </div>
        {form.doneAssessment === 'yes' && (
          <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
            <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.yearsQ')}</label>
            <input type="number" name="years" value={form.years} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
            {errors.years && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.years}</div>}
          </div>
        )}
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.certifiedQ')}</label>
          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <label>
              <input type="radio" name="certified" value="yes" checked={form.certified === 'yes'} onChange={handleChange} /> {t('common.yes')}
            </label>
            <label>
              <input type="radio" name="certified" value="no" checked={form.certified === 'no'} onChange={handleChange} /> {t('common.no')}
            </label>
          </div>
          {errors.certified && <div className="text-red-500 text-xs">{errors.certified}</div>}
        </div>
        {form.certified === 'yes' && (
          <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
            <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.accreditorQ')}</label>
            <input type="text" name="accreditor" value={form.accreditor} onChange={handleChange} className={`border rounded px-2 py-1 w-full ${isRTL ? 'text-right' : ''}`} />
            {errors.accreditor && <div className={`text-red-500 text-xs ${isRTL ? 'text-right' : ''}`}>{errors.accreditor}</div>}
          </div>
        )}
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.ageGroupQ')}</label>
          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            {ageGroups.map((group) => (
              <label key={group}>
                <input type="radio" name="ageGroup" value={group} checked={form.ageGroup === group} onChange={handleChange} /> {t(`expertApp.ageGroup.${group}`)}
              </label>
            ))}
          </div>
          {errors.ageGroup && <div className="text-red-500 text-xs">{errors.ageGroup}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.incomeQ')}</label>
          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            {incomes.map((inc) => (
              <label key={inc}>
                <input type="radio" name="income" value={inc} checked={form.income === inc} onChange={handleChange} /> {t(`expertApp.income.${inc}`)}
              </label>
            ))}
          </div>
          {errors.income && <div className="text-red-500 text-xs">{errors.income}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.educationQ')}</label>
          <input type="text" name="education" value={form.education} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
          {errors.education && <div className="text-red-500 text-xs">{errors.education}</div>}
        </div>
        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
          <label className={`block font-semibold mb-1 ${isRTL ? 'text-right' : ''}`}>{t('expertApp.availableDaysQ')}</label>
          <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  name="availableDays"
                  value={day}
                  checked={form.availableDays.includes(day)}
                  onChange={handleChange}
                />
                <span className="ml-1">{t(`common.${day.toLowerCase()}`)}</span>
              </label>
            ))}
          </div>
          {errors.availableDays && <div className="text-red-500 text-xs">{errors.availableDays}</div>}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">{t('expertApp.motivationQ')}</label>
          <textarea
            name="motivation"
            value={form.motivation}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full min-h-[60px]"
          />
          {errors.motivation && <div className="text-red-500 text-xs">{errors.motivation}</div>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t('expertApp.submit')}</button>
        <div className="text-xs text-gray-500 mt-2">{t('expertApp.note')}</div>
      </form>
    </div>
  );
} 