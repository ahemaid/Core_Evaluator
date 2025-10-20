import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Star, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface ReviewData {
  // Doctor-Patient Communication
  listenedCarefully: number;
  explainedClearly: number;
  feltRespected: number;
  concernsAddressed: number;
  
  // Timeliness and Access
  easyScheduling: number;
  waitTime: number;
  timeSpent: number;
  startedOnTime: number;
  
  // Professionalism and Empathy
  courtesy: number;
  comfortableDiscussing: boolean;
  showedEmpathy: number;
  culturalRespect: number;
  
  // Quality of Medical Care
  diagnosisAccuracy: number;
  clearInstructions: number;
  healthImproved: boolean;
  testsExplained: number;
  
  // Facility and Service
  cleanliness: number;
  staffProfessional: number;
  coordination: number;
  
  // Overall Satisfaction
  overallSatisfaction: number;
  wouldRecommend: boolean;
  improvementSuggestions: string;
}

interface InteractiveReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
  providerName: string;
}

const InteractiveReviewModal: React.FC<InteractiveReviewModalProps> = ({
  open,
  onClose,
  onSubmit,
  providerName
}) => {
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';
  
  const [reviewData, setReviewData] = useState<ReviewData>({
    listenedCarefully: 0,
    explainedClearly: 0,
    feltRespected: 0,
    concernsAddressed: 0,
    easyScheduling: 0,
    waitTime: 0,
    timeSpent: 0,
    startedOnTime: 0,
    courtesy: 0,
    comfortableDiscussing: false,
    showedEmpathy: 0,
    culturalRespect: 0,
    diagnosisAccuracy: 0,
    clearInstructions: 0,
    healthImproved: false,
    testsExplained: 0,
    cleanliness: 0,
    staffProfessional: 0,
    coordination: 0,
    overallSatisfaction: 0,
    wouldRecommend: false,
    improvementSuggestions: ''
  });

  const updateRating = (field: keyof ReviewData, value: number) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const updateBoolean = (field: keyof ReviewData, value: boolean) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const updateText = (field: keyof ReviewData, value: string) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const StarRating: React.FC<{ value: number; onChange: (value: number) => void; label: string }> = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium min-w-0 flex-shrink-0">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600">{value}/5</span>
    </div>
  );

  const YesNoQuestion: React.FC<{ value: boolean; onChange: (value: boolean) => void; label: string }> = ({ value, onChange, label }) => (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">{label}:</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            value === true ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{t('common.yes') || 'Yes'}</span>
        </button>
        <button
          onClick={() => onChange(false)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            value === false ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span className="text-sm">{t('common.no') || 'No'}</span>
        </button>
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSubmit(reviewData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-center font-bold text-lg">
        {t('review.title') || 'Rate Your Experience'} - {providerName}
      </DialogTitle>
      
      <DialogContent>
        <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          
          {/* Doctor-Patient Communication */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">
              {t('review.communication.title') || '1. Doctor-Patient Communication'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.listenedCarefully}
                onChange={(value) => updateRating('listenedCarefully', value)}
                label={t('review.communication.listened') || 'Did your doctor listen carefully to your concerns?'}
              />
              <StarRating
                value={reviewData.explainedClearly}
                onChange={(value) => updateRating('explainedClearly', value)}
                label={t('review.communication.explained') || 'Did your doctor explain diagnosis and treatment clearly?'}
              />
              <StarRating
                value={reviewData.feltRespected}
                onChange={(value) => updateRating('feltRespected', value)}
                label={t('review.communication.respected') || 'Did you feel respected and understood?'}
              />
              <StarRating
                value={reviewData.concernsAddressed}
                onChange={(value) => updateRating('concernsAddressed', value)}
                label={t('review.communication.addressed') || 'Were your questions fully addressed?'}
              />
            </div>
          </div>

          {/* Timeliness and Access */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">
              {t('review.timeliness.title') || '2. Timeliness and Access to Care'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.easyScheduling}
                onChange={(value) => updateRating('easyScheduling', value)}
                label={t('review.timeliness.scheduling') || 'How easy was it to schedule your appointment?'}
              />
              <StarRating
                value={reviewData.waitTime}
                onChange={(value) => updateRating('waitTime', value)}
                label={t('review.timeliness.waitTime') || 'How long did you wait before seeing the doctor?'}
              />
              <StarRating
                value={reviewData.timeSpent}
                onChange={(value) => updateRating('timeSpent', value)}
                label={t('review.timeliness.timeSpent') || 'Were you satisfied with the time spent with you?'}
              />
              <StarRating
                value={reviewData.startedOnTime}
                onChange={(value) => updateRating('startedOnTime', value)}
                label={t('review.timeliness.onTime') || 'Was your appointment started on time?'}
              />
            </div>
          </div>

          {/* Professionalism and Empathy */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-3">
              {t('review.professionalism.title') || '3. Professionalism and Empathy'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.courtesy}
                onChange={(value) => updateRating('courtesy', value)}
                label={t('review.professionalism.courtesy') || 'How would you rate your doctor\'s courtesy and professionalism?'}
              />
              <YesNoQuestion
                value={reviewData.comfortableDiscussing}
                onChange={(value) => updateBoolean('comfortableDiscussing', value)}
                label={t('review.professionalism.comfortable') || 'Did you feel comfortable discussing personal health issues?'}
              />
              <StarRating
                value={reviewData.showedEmpathy}
                onChange={(value) => updateRating('showedEmpathy', value)}
                label={t('review.professionalism.empathy') || 'Did your doctor show empathy and genuine concern?'}
              />
              <StarRating
                value={reviewData.culturalRespect}
                onChange={(value) => updateRating('culturalRespect', value)}
                label={t('review.professionalism.cultural') || 'Were your cultural or religious values respected?'}
              />
            </div>
          </div>

          {/* Quality of Medical Care */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-3">
              {t('review.quality.title') || '4. Quality of Medical Care'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.diagnosisAccuracy}
                onChange={(value) => updateRating('diagnosisAccuracy', value)}
                label={t('review.quality.diagnosis') || 'How satisfied are you with the accuracy of diagnosis and treatment?'}
              />
              <StarRating
                value={reviewData.clearInstructions}
                onChange={(value) => updateRating('clearInstructions', value)}
                label={t('review.quality.instructions') || 'Did you receive clear instructions for medication and follow-up?'}
              />
              <YesNoQuestion
                value={reviewData.healthImproved}
                onChange={(value) => updateBoolean('healthImproved', value)}
                label={t('review.quality.improved') || 'Do you feel your health improved as a result of treatment?'}
              />
              <StarRating
                value={reviewData.testsExplained}
                onChange={(value) => updateRating('testsExplained', value)}
                label={t('review.quality.tests') || 'Were any tests or procedures explained before being performed?'}
              />
            </div>
          </div>

          {/* Facility and Service */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-800 mb-3">
              {t('review.facility.title') || '5. Facility and Service Experience'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.cleanliness}
                onChange={(value) => updateRating('cleanliness', value)}
                label={t('review.facility.cleanliness') || 'How would you rate the cleanliness and comfort of the clinic?'}
              />
              <StarRating
                value={reviewData.staffProfessional}
                onChange={(value) => updateRating('staffProfessional', value)}
                label={t('review.facility.staff') || 'Were staff members professional and helpful?'}
              />
              <StarRating
                value={reviewData.coordination}
                onChange={(value) => updateRating('coordination', value)}
                label={t('review.facility.coordination') || 'How satisfied were you with the coordination between doctor and staff?'}
              />
            </div>
          </div>

          {/* Overall Satisfaction */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-3">
              {t('review.overall.title') || '6. Overall Satisfaction and Recommendations'}
            </h3>
            <div className="space-y-3">
              <StarRating
                value={reviewData.overallSatisfaction}
                onChange={(value) => updateRating('overallSatisfaction', value)}
                label={t('review.overall.satisfaction') || 'Overall, how satisfied are you with your doctor\'s care?'}
              />
              <YesNoQuestion
                value={reviewData.wouldRecommend}
                onChange={(value) => updateBoolean('wouldRecommend', value)}
                label={t('review.overall.recommend') || 'Would you recommend this doctor or facility to others?'}
              />
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('review.overall.improvements') || 'What could the doctor or clinic do to improve your experience?'}
                </label>
                <textarea
                  value={reviewData.improvementSuggestions}
                  onChange={(e) => updateText('improvementSuggestions', e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder={t('review.overall.improvementsPlaceholder') || 'Share your suggestions for improvement...'}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      
      <DialogActions style={{ justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
        <Button onClick={onClose}>
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={reviewData.overallSatisfaction === 0}
        >
          {t('review.submit') || 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InteractiveReviewModal;
