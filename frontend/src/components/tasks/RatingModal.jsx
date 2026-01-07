import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

export function RatingModal({ isOpen, onClose, task, onSubmit, loading = false }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setFeedback('');
      setError('');
    }
  }, [isOpen, task?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate rating
    if (rating === 0) {
      setError(t('tasks.rating.pleaseSelectRating', 'Please select a rating'));
      return;
    }

    setError('');
    onSubmit({ rating, feedback });
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedback('');
    setError('');
    onClose();
  };

  const getTaskTitle = () => {
    if (!task) return '';
    if (isRTL && task.title_arabic) return task.title_arabic;
    if (i18n.language === 'fr' && task.title_french) return task.title_french;
    return task.title;
  };

  const ratingLabels = {
    1: t('tasks.rating.veryPoor', 'Very Poor'),
    2: t('tasks.rating.poor', 'Poor'),
    3: t('tasks.rating.average', 'Average'),
    4: t('tasks.rating.good', 'Good'),
    5: t('tasks.rating.excellent', 'Excellent'),
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('tasks.rating.rateTask', 'Rate Task')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('tasks.rating.rateTaskDescription', 'Rate the quality and completion of this task')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Task Title */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('tasks.taskTitle', 'Task')}
            </h4>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {getTaskTitle()}
            </p>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white block">
              {t('tasks.rating.rating', 'Rating')} <span className="text-red-500">*</span>
            </label>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-10 h-10 transition-all ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Label */}
            {(rating > 0 || hoveredRating > 0) && (
              <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 animate-in fade-in-50">
                {ratingLabels[hoveredRating || rating]}
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="rating-feedback"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              {t('tasks.rating.feedback', 'Feedback')} ({t('common.optional', 'Optional')})
            </label>
            <Textarea
              id="rating-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
              placeholder={t(
                'tasks.rating.feedbackPlaceholder',
                'Provide feedback on the task completion (optional)'
              )}
              className={`min-h-[100px] ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <p className="text-xs text-gray-500">
              {feedback.length} / 500 {t('common.characters', 'characters')}
            </p>
          </div>

          {/* Submit Buttons */}
          <DialogFooter className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-end gap-2`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <span>{t('common.submitting', 'Submitting...')}</span>
              ) : (
                t('tasks.rating.submitRating', 'Submit Rating')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
