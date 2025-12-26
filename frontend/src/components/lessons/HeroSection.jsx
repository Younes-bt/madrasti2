import { Flame } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export function HeroSection({ summary, onContinue }) {
  const {
    total_lessons = 0,
    completed_lessons = 0,
    completion_percentage = 0,
    total_points = 0,
    study_time_hours = 0,
    next_lesson_id = null
  } = summary || {};

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 rounded-b-2xl shadow-2xl">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">📚</span>
            دروسي
          </h1>
          <p className="text-primary-100 text-lg">
            تتبع تقدمك واستمر في رحلة التعلم
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold">التقدم الكلي</span>
            <span className="text-2xl font-bold">
              {completed_lessons}/{total_lessons}
            </span>
          </div>
          <Progress value={completion_percentage} className="h-3 bg-white/20" />
          <p className="text-sm text-primary-100 mt-2">
            {Math.round(completion_percentage)}% مكتمل
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-3xl font-bold mb-1">{completed_lessons}</div>
            <div className="text-sm text-primary-100">درس مكتمل</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20">
            <div className="text-4xl mb-3">⏱️</div>
            <div className="text-3xl font-bold mb-1">{study_time_hours}</div>
            <div className="text-sm text-primary-100">ساعات تعلم</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-3xl font-bold mb-1">{total_points}</div>
            <div className="text-sm text-primary-100">نقطة مكتسبة</div>
          </div>
        </div>

        {/* Primary CTA */}
        {next_lesson_id && (
          <Button
            size="lg"
            className="w-full bg-white text-primary-700 hover:bg-primary-50 hover:shadow-lg transition-all gap-3 text-lg py-6 rounded-xl font-bold"
            onClick={() => onContinue(next_lesson_id)}
          >
            <Flame className="w-6 h-6 text-orange-500" />
            استمر من حيث توقفت
          </Button>
        )}
      </div>
    </div>
  );
}
