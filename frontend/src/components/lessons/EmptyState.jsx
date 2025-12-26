import { X } from 'lucide-react';
import { Button } from '../ui/button';

export function EmptyState({ filterStatus, searchQuery, onClearFilters }) {
  const messages = {
    all: {
      icon: '📚',
      title: 'لا توجد دروس متاحة',
      description: 'لم يتم إضافة أي دروس لهذه الدورة بعد'
    },
    'in_progress': {
      icon: '⏳',
      title: 'لا توجد دروس قيد التقدم',
      description: 'ابدأ درساً جديداً للبدء في التعلم'
    },
    completed: {
      icon: '✅',
      title: 'لم تكمل أي دروس بعد',
      description: 'أكمل أول درس لترى تقدمك هنا'
    },
    locked: {
      icon: '🔒',
      title: 'لا توجد دروس مغلقة',
      description: 'جميع الدروس المتاحة مفتوحة لك'
    }
  };

  const message = searchQuery
    ? {
        icon: '🔍',
        title: 'لا توجد نتائج',
        description: `لم نجد دروساً تطابق "${searchQuery}"`
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
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}
