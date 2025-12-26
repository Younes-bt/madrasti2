import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/Layout';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import lessonsService from '../../services/lessons';
import usersService from '../../services/users';
import schoolsService from '../../services/schools';
import {
  HeroSection,
  FilterSection,
  LessonCard,
  LoadingSkeleton,
  EmptyState,
  Pagination
} from '../../components/lessons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const StudentLessonsPage = () => {
  const { t, isRTL, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [studentGrade, setStudentGrade] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  // Debounce search (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load profile and grade
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResponse, gradesResponse] = await Promise.all([
          usersService.getProfile(),
          schoolsService.getGrades({ page_size: 1000 }),
        ]);

        const gradesList = gradesResponse?.results || [];
        const normalize = (value) => (value || '').toString().trim().toLowerCase();

        const candidateNames = [
          normalize(profileResponse?.grade),
          normalize(profileResponse?.grade_name_arabic),
          normalize(profileResponse?.grade_name_french),
        ].filter(Boolean);

        const matchedGrade = gradesList.find((grade) => {
          const gradeNames = [
            normalize(grade?.name),
            normalize(grade?.name_arabic),
            normalize(grade?.name_french),
          ].filter(Boolean);
          return gradeNames.some((gradeName) => candidateNames.includes(gradeName));
        });

        setStudentGrade(matchedGrade || null);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(t('errors.loadData', 'Unable to load your lessons.'));
      }
    };

    loadProfile();
  }, [t]);


  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, debouncedSearch]);

  // Load lessons with progress
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          page_size: 20,
        };

        // Backend determines grade from enrollment, so we don't pass it
        // Only pass subject and search filters
        if (selectedSubject !== 'all') {
          params.subject = selectedSubject;
        }
        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const response = await lessonsService.getLessonsWithProgress(params);

        setLessons(response.lessons || []);
        setSummary(response.summary || {});
        setPaginationData(response.pagination || null);
        setSubjects(response.subjects || []);
      } catch (err) {
        console.error('Failed to load lessons:', err);
        setError(t('lessons.loadError', 'Unable to load lessons.'));
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [selectedSubject, debouncedSearch, currentPage, t]);

  // Get localized lesson title
  const getLocalizedLessonTitle = (lesson) => {
    if (!lesson) return '';
    switch (currentLanguage) {
      case 'ar':
        return lesson.title_arabic || lesson.title;
      case 'fr':
        return lesson.title_french || lesson.title;
      default:
        return lesson.title;
    }
  };

  // Get localized subject name
  const getLocalizedSubjectName = (subject) => {
    if (!subject) return '';
    switch (currentLanguage) {
      case 'ar':
        return subject.name_arabic || subject.name;
      case 'fr':
        return subject.name_french || subject.name;
      default:
        return subject.name;
    }
  };

  // Add title to each lesson (for LessonCard)
  const lessonsWithLocalizedTitles = useMemo(() => {
    return lessons.map(lesson => ({
      ...lesson,
      title: getLocalizedLessonTitle(lesson)
    }));
  }, [lessons, currentLanguage]);

  // Filter lessons by status (client-side)
  const filteredLessons = useMemo(() => {
    if (filterStatus === 'all') return lessonsWithLocalizedTitles;

    return lessonsWithLocalizedTitles.filter(lesson => {
      if (filterStatus === 'locked') return lesson.is_locked;
      return lesson.progress?.status === filterStatus;
    });
  }, [lessonsWithLocalizedTitles, filterStatus]);

  // Navigation handlers
  const handleLessonClick = (lesson) => {
    if (!lesson.is_locked) {
      navigate(`/student/lessons/${lesson.id}`);
    }
  };

  const handleContinue = (lessonId) => {
    navigate(`/student/lessons/${lessonId}`);
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setSearchTerm('');
    setSelectedSubject('all');
  };

  // Loading state
  if (loading && !lessons.length) {
    return <LoadingSkeleton />;
  }

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        {summary && (
          <HeroSection
            summary={summary}
            onContinue={handleContinue}
          />
        )}

        {/* Filters */}
        <FilterSection
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          isRTL={isRTL}
        />

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="container mx-auto max-w-6xl px-4 pb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                {t('lessons.subject', 'المادة')}:
              </label>
              <Select
                value={selectedSubject}
                onValueChange={(value) => {
                  setSelectedSubject(value);
                }}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder={t('lessons.allSubjects', 'جميع المواد')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('lessons.allSubjects', 'جميع المواد')}
                  </SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {getLocalizedSubjectName(subject)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="container mx-auto max-w-6xl px-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
              {error}
            </div>
          </div>
        )}

        {/* Lessons Grid */}
        <div className="container mx-auto max-w-6xl px-4 pb-12">
          {filteredLessons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onLessonClick={handleLessonClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginationData && (
                <Pagination
                  currentPage={paginationData.current_page}
                  totalPages={paginationData.total_pages}
                  onPageChange={setCurrentPage}
                  isRTL={isRTL}
                />
              )}
            </>
          ) : (
            <EmptyState
              filterStatus={filterStatus}
              searchQuery={debouncedSearch}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentLessonsPage;
