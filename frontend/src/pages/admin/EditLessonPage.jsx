import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import i18n from '../../lib/i18n';
import { ArrowLeft, BookOpen, Save, X } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { MultiSelect } from '../../components/ui/multi-select';
import lessonsService from '../../services/lessons';
import schoolsService from '../../services/schools';
import { toast } from 'sonner';

// Helper function to get localized grade name
const getLocalizedGradeName = (grade) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return grade.name_arabic || grade.name;
    case 'fr':
      return grade.name_french || grade.name;
    default:
      return grade.name;
  }
};

// Helper function to get localized subject name
const getLocalizedSubjectName = (subject) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return subject.name_arabic || subject.name;
    case 'fr':
      return subject.name_french || subject.name;
    default:
      return subject.name;
  }
};

// Helper function to get localized track name
const getLocalizedTrackName = (track) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return track.name_arabic || track.name;
    case 'fr':
      return track.name_french || track.name;
    default:
      return track.name;
  }
};

const EditLessonPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    title_french: '',
    description: '',
    subject: '',
    grade: '',
    tracks: [],
    cycle: 'first',
    order: 1,
    objectives: '',
    prerequisites: '',
    difficulty_level: 'medium',
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Load lesson data and options
  useEffect(() => {
    loadLessonData();
    loadOptions();
  }, [id]);

  const loadLessonData = async () => {
    try {
      setLoadingData(true);
      const lesson = await lessonsService.getLessonById(id);
      setFormData({
        title: lesson.title || '',
        title_arabic: lesson.title_arabic || '',
        title_french: lesson.title_french || '',
        description: lesson.description || '',
        subject: lesson.subject?.toString() || '',
        grade: lesson.grade?.toString() || '',
        tracks: lesson.tracks?.map(t => t.id.toString()) || [],
        cycle: lesson.cycle || 'first',
        order: lesson.order || 1,
        objectives: lesson.objectives || '',
        prerequisites: lesson.prerequisites || '',
        difficulty_level: lesson.difficulty_level || 'medium',
        is_active: lesson.is_active ?? true
      });

      // Load tracks for the current grade
      if (lesson.grade) {
        loadTracksForGrade(lesson.grade);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error(t('lessons.loadError'));
      navigate('/admin/education-management/lessons');
    } finally {
      setLoadingData(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [subjectsRes, gradesRes, levelsRes] = await Promise.all([
        schoolsService.getSubjects(),
        schoolsService.getGrades(),
        schoolsService.getEducationalLevels()
      ]);

      setSubjects(subjectsRes.results || subjectsRes);
      setGrades(gradesRes.results || gradesRes);
      setLevels(levelsRes.results || levelsRes);
    } catch (error) {
      console.error('Error loading options:', error);
      toast.error(t('error.loadingData'));
    }
  };

  // Load tracks when grade is selected
  const loadTracksForGrade = async (gradeId) => {
    if (!gradeId) {
      setTracks([]);
      return;
    }

    try {
      const tracksRes = await schoolsService.getTracksForGrade(gradeId);
      setTracks(tracksRes.results || tracksRes);
    } catch (error) {
      console.error('Error loading tracks:', error);
      setTracks([]);
    }
  };

  // Handle grade change to load tracks
  const handleGradeChange = (gradeId) => {
    setFormData({...formData, grade: gradeId, tracks: []});
    loadTracksForGrade(gradeId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.grade) {
      toast.error(t('lessons.requiredFields'));
      return;
    }

    try {
      setLoading(true);
      await lessonsService.updateLesson(id, formData);
      toast.success(t('lessons.updateSuccess'));
      navigate('/admin/education-management/lessons');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error(error.response?.data?.message || t('lessons.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/education-management/lessons');
  };

  const cycleOptions = [
    { value: 'first', label: t('lessons.firstCycle') },
    { value: 'second', label: t('lessons.secondCycle') }
  ];

  const difficultyOptions = [
    { value: 'easy', label: t('lessons.easy') },
    { value: 'medium', label: t('lessons.medium') },
    { value: 'hard', label: t('lessons.hard') }
  ];

  if (loadingData) {
    return (
      <AdminPageLayout
        title={t('lessons.editLesson')}
        subtitle={t('lessons.editDescription')}
      >
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('lessons.editLesson')}
      subtitle={t('lessons.editDescription')}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('lessons.lessonInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('lessons.title')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('lessons.titlePlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_arabic">{t('lessons.titleArabic')}</Label>
                  <Input
                    id="title_arabic"
                    value={formData.title_arabic}
                    onChange={(e) => setFormData({...formData, title_arabic: e.target.value})}
                    placeholder={t('lessons.titleArabicPlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_french">{t('lessons.titleFrench')}</Label>
                <Input
                  id="title_french"
                  value={formData.title_french}
                  onChange={(e) => setFormData({...formData, title_french: e.target.value})}
                  placeholder={t('lessons.titleFrenchPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('lessons.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('lessons.descriptionPlaceholder')}
                  rows={3}
                />
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('lessons.subject')} *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({...formData, subject: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('lessons.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {getLocalizedSubjectName(subject)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">{t('lessons.grade')} *</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={handleGradeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('lessons.selectGrade')} />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {getLocalizedGradeName(grade)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Track Selection */}
              {tracks.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="tracks">{t('lessons.track')}</Label>
                  <MultiSelect
                    options={tracks.map(track => ({
                      value: track.id.toString(),
                      label: getLocalizedTrackName(track)
                    }))}
                    value={formData.tracks}
                    onChange={(value) => setFormData({ ...formData, tracks: value })}
                    placeholder={t('lessons.selectTracks')}
                  />
                </div>
              )}

              {/* Cycle and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycle">{t('lessons.cycle')} *</Label>
                  <Select
                    value={formData.cycle}
                    onValueChange={(value) => setFormData({...formData, cycle: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cycleOptions.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">{t('lessons.order')} *</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">{t('lessons.difficulty')} *</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData({...formData, difficulty_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Objectives and Prerequisites */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectives">{t('lessons.objectives')}</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    placeholder={t('lessons.objectivesPlaceholder')}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">{t('lessons.prerequisites')}</Label>
                  <Textarea
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                    placeholder={t('lessons.prerequisitesPlaceholder')}
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.subject || !formData.grade}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? t('common.updating') : t('common.update')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default EditLessonPage;