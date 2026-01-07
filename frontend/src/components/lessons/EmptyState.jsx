import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export function EmptyState({ filterStatus, searchQuery, onClearFilters }) {
  const { t } = useTranslation();

  const messages = {
    all: {
      icon: '📚',
      title: t('lessons.noLessonsAvailable'),
      description: t('lessons.noLessonsAvailableDesc')
    },
    'in_progress': {
      icon: '⏳',
      title: t('lessons.noLessonsInProgress'),
      description: t('lessons.noLessonsInProgressDesc')
    },
    completed: {
      icon: '✅',
      title: t('lessons.noLessonsCompleted'),
      description: t('lessons.noLessonsCompletedDesc')
    },
    locked: {
      icon: '🔒',
      title: t('lessons.noLessonsLocked'),
      description: t('lessons.noLessonsLockedDesc')
    }
  };

  const message = searchQuery
    ? {
      icon: '🔍',
      title: t('lessons.noResults'),
      description: t('lessons.noResultsDesc', { query: searchQuery })
    }
    : messages[filterStatus];

  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6">{message.icon}</div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-3">
        {message.title}
      </h3>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        {message.description}
      </p>

      {(searchQuery || filterStatus !== 'all') && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="gap-2"
        >
          <X className="w-4 h-4" />
          {t('lessons.clearFilters')}
        </Button>
      )}
    </div>
  );
}
