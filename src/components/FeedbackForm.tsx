import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';



interface FeedbackFormProps {
  onSubmit: (feedback: any) => Promise<void>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tutorName: '',
    rating: 0,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoverRating, setHoverRating] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tutorName.trim()) {
      newErrors.tutorName = 'Please enter the tutor name';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.comment.trim()) {
  newErrors.comment = 'Please enter your comment';
} else if (formData.comment.trim().length < 10) {
  newErrors.comment = 'Comment must be at least 10 characters';
} else if (formData.comment.trim().length > 25) {
  newErrors.comment = 'Comment must not exceed 25 characters';
}

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setFormData({
        tutorName: '',
        rating: 0,
        comment: '',
      });
      setErrors({});
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // Check if form is valid for submit button
  const isFormValid = formData.tutorName.trim() && formData.rating > 0 && formData.comment.trim().length >= 10;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3 animate-fadeInUp">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300 text-sm font-medium">Feedback submitted successfully! Thank you for your input.</span>
        </div>
      )}

      <div className="text-center mb-8">
       
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Submit Feedback</h2>
        <p className="text-slate-600">Share your experience with your tutor</p>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 animate-shake">
          
          <span className="text-red-300 text-sm">{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tutor Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Tutor Name
          </label>
          <div className="relative">
            
            <input
              type="text"
              name="tutorName"
              value={formData.tutorName}
              onChange={handleInputChange}
              placeholder="Enter tutor name"
              className={`w-full pl-4 pr-4 py-3 ...
 ${
                errors.tutorName 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-slate-200 focus:border-blue-500 bg-white'
              }`}
            />
          </div>
          {errors.tutorName && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
              
              {errors.tutorName}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="group transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    star <= (hoverRating || formData.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-slate-600 font-medium">
                {formData.rating}/5 stars
              </span>
            )}
          </div>
          {errors.rating && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
              
              {errors.rating}
            </div>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your experience with the tutor..."
            rows={4}
            maxLength={25}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
              errors.comment 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-slate-200 focus:border-blue-500 bg-white'
            }`}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formData.comment.length} characters</span>
            <span>Minimum 10 characters</span>
          </div>
          {errors.comment && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
              
              {errors.comment}
            </div>
          )}
        </div>

        {/* Required Fields Message */}
        {!isFormValid && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm font-medium">
              Please fill in all required fields to submit your feedback
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting Feedback...
            </>
          ) : (
            <>
              
              {isFormValid ? 'Submit Feedback' : 'Fill Required Fields'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};