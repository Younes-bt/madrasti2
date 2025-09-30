import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  BookOpen,
  GraduationCap,
  Clock,
  Target,
  Brain,
  PlayCircle,
  FileText,
  Settings,
  Award,
  HelpCircle,
  Check,
  X,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { exerciseService } from '../../services/exercises';
import lessonsService from '../../services/lessons';
import schoolsService from '../../services/schools';
import { toast } from 'sonner';
import { useMultilingual } from '../../utils/multilingual';

const EditExercisePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getName, getTitle } = useMultilingual();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [exercise, setExercise] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [lessonFilters, setLessonFilters] = useState({
    search: '',
    subject: 'all',
    grade: 'all'
  });

  const [formData, setFormData] = useState({
    lesson: '',
    title: '',
    title_arabic: '',
    description: '',
    instructions: '',
    exercise_format: 'mixed',
    difficulty_level: 'beginner',
    estimated_duration: '',
    time_limit: '',
    is_timed: false,
    total_points: '0.00',
    auto_grade: true,
    randomize_questions: false,
    show_results_immediately: true,
    allow_multiple_attempts: true,
    max_attempts: '0',
    is_active: true,
    is_published: true,
    available_from: '',
    available_until: '',
    attempt_points: '2',
    completion_points: '5',
    completion_coins: '1',
    perfect_score_bonus: '10',
    high_score_bonus: '5',
    improvement_bonus: '3',
    base_xp: '5',
    bonus_xp: '10',
    difficulty_multiplier: '1.00'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    filterLessons();
  }, [lessonFilters, allLessons]);

  useEffect(() => {
    const total = questions.reduce((sum, q) => sum + parseFloat(q.points || 0), 0);
    setFormData(prev => ({ ...prev, total_points: total.toFixed(2) }));
  }, [questions]);

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const [exerciseResult, lessonsResponse, subjectsResponse, gradesResponse] = await Promise.all([
        exerciseService.getExerciseById(id),
        lessonsService.getMinimalLessons(),
        schoolsService.getSubjects(),
        schoolsService.getGrades()
      ]);

      if (exerciseResult.success) {
        const exerciseData = exerciseResult.data;
        setExercise(exerciseData);
        setQuestions(exerciseData.questions || []);
        setFormData({
          lesson: exerciseData.lesson?.id?.toString() || '',
          title: exerciseData.title || '',
          title_arabic: exerciseData.title_arabic || '',
          description: exerciseData.description || '',
          instructions: exerciseData.instructions || '',
          exercise_format: exerciseData.exercise_format || 'mixed',
          difficulty_level: exerciseData.difficulty_level || 'beginner',
          estimated_duration: exerciseData.estimated_duration?.toString() || '',
          time_limit: exerciseData.time_limit?.toString() || '',
          is_timed: exerciseData.is_timed || false,
          total_points: exerciseData.total_points?.toString() || '0.00',
          auto_grade: exerciseData.auto_grade !== undefined ? exerciseData.auto_grade : true,
          randomize_questions: exerciseData.randomize_questions || false,
          show_results_immediately: exerciseData.show_results_immediately !== undefined ? exerciseData.show_results_immediately : true,
          allow_multiple_attempts: exerciseData.allow_multiple_attempts !== undefined ? exerciseData.allow_multiple_attempts : true,
          max_attempts: exerciseData.max_attempts?.toString() || '0',
          is_active: exerciseData.is_active !== undefined ? exerciseData.is_active : true,
          is_published: exerciseData.is_published !== undefined ? exerciseData.is_published : true,
          available_from: exerciseData.available_from ? new Date(exerciseData.available_from).toISOString().slice(0, 16) : '',
          available_until: exerciseData.available_until ? new Date(exerciseData.available_until).toISOString().slice(0, 16) : '',
          attempt_points: exerciseData.reward_config?.attempt_points?.toString() || '2',
          completion_points: exerciseData.reward_config?.completion_points?.toString() || '5',
          completion_coins: exerciseData.reward_config?.completion_coins?.toString() || '1',
          perfect_score_bonus: exerciseData.reward_config?.perfect_score_bonus?.toString() || '10',
          high_score_bonus: exerciseData.reward_config?.high_score_bonus?.toString() || '5',
          improvement_bonus: exerciseData.reward_config?.improvement_bonus?.toString() || '3',
          base_xp: exerciseData.reward_config?.base_xp?.toString() || '5',
          bonus_xp: exerciseData.reward_config?.bonus_xp?.toString() || '10',
          difficulty_multiplier: exerciseData.reward_config?.difficulty_multiplier?.toString() || '1.00'
        });
      } else {
        toast.error(exerciseResult.error || t('exercises.fetchError'));
        navigate('/admin/education-management/exercises');
        return;
      }

      let lessonsData = (lessonsResponse && Array.isArray(lessonsResponse)) ? lessonsResponse : (lessonsResponse?.results || []);
      let subjectsData = (subjectsResponse && Array.isArray(subjectsResponse)) ? subjectsResponse : (subjectsResponse?.results || []);
      let gradesData = (gradesResponse && Array.isArray(gradesResponse)) ? gradesResponse : (gradesResponse?.results || []);
      setAllLessons(lessonsData);
      setLessons(lessonsData);
      setSubjects(subjectsData);
      setGrades(gradesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t('common.error'));
      navigate('/admin/education-management/exercises');
    } finally {
      setInitialLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...allLessons];
    if (lessonFilters.search.trim()) {
      const searchTerm = lessonFilters.search.toLowerCase().trim();
      filtered = filtered.filter(lesson =>
        getTitle(lesson)?.toLowerCase().includes(searchTerm) ||
        getName({ name: lesson.subject_name, name_arabic: lesson.subject_name_arabic })?.toLowerCase().includes(searchTerm) ||
        getName({ name: lesson.grade_name, name_arabic: lesson.grade_name_arabic })?.toLowerCase().includes(searchTerm)
      );
    }
    if (lessonFilters.subject !== 'all') {
      filtered = filtered.filter(lesson => lesson.subject?.toString() === lessonFilters.subject);
    }
    if (lessonFilters.grade !== 'all') {
      filtered = filtered.filter(lesson => lesson.grade?.toString() === lessonFilters.grade);
    }
    setLessons(filtered);
  };

  const handleLessonFilterChange = (field, value) => setLessonFilters(prev => ({ ...prev, [field]: value }));
  const clearLessonFilters = () => setLessonFilters({ search: '', subject: 'all', grade: 'all' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      question_text: '',
      question_type: 'qcm_single',
      points: '1.00',
      order: prev.length,
      choices: [{ choice_text: '', is_correct: true }, { choice_text: '', is_correct: false }]
    }]);
  };

  const removeQuestion = (index) => setQuestions(prev => prev.filter((_, i) => i !== index));

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    if (field === 'question_type') {
      if (value === 'open_long' || value === 'open_short') {
        newQuestions[index].choices = [];
      } else if (!newQuestions[index].choices || newQuestions[index].choices.length === 0) {
        newQuestions[index].choices = [{ choice_text: '', is_correct: true }, { choice_text: '', is_correct: false }];
      }
    }
    setQuestions(newQuestions);
  };

  const addChoice = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.push({ choice_text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  const removeChoice = (qIndex, cIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices = newQuestions[qIndex].choices.filter((_, i) => i !== cIndex);
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (qIndex, cIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices[cIndex].choice_text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChoiceChange = (qIndex, cIndex, type) => {
    const newQuestions = [...questions];
    if (type === 'qcm_single' || type === 'true_false') {
      newQuestions[qIndex].choices.forEach((choice, i) => {
        choice.is_correct = i === cIndex;
      });
    } else {
      newQuestions[qIndex].choices[cIndex].is_correct = !newQuestions[qIndex].choices[cIndex].is_correct;
    }
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lesson) newErrors.lesson = t('exercises.validation.lessonRequired');
    if (!formData.title.trim()) newErrors.title = t('exercises.validation.titleRequired');
    if (!formData.description.trim()) newErrors.description = t('exercises.validation.descriptionRequired');
    if (questions.length === 0) newErrors.questions = t('exercises.validation.questionsRequired');

    questions.forEach((q, i) => {
      if (!q.question_text.trim()) newErrors[`q_${i}_text`] = t('exercises.validation.questionTextRequired');
      if (['qcm_single', 'qcm_multiple', 'true_false'].includes(q.question_type)) {
        if (q.choices && !q.choices.some(c => c.is_correct)) newErrors[`q_${i}_choice`] = t('exercises.validation.correctChoiceRequired');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t('exercises.validation.formErrors'));
      return;
    }
    setLoading(true);

    try {
      const exerciseData = {
        lesson: parseInt(formData.lesson),
        title: formData.title.trim(),
        title_arabic: formData.title_arabic.trim() || null,
        description: formData.description.trim(),
        instructions: formData.instructions.trim() || null,
        exercise_format: formData.exercise_format,
        difficulty_level: formData.difficulty_level,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
        time_limit: formData.is_timed && formData.time_limit ? parseInt(formData.time_limit) : null,
        is_timed: formData.is_timed,
        total_points: parseFloat(formData.total_points),
        auto_grade: formData.auto_grade,
        randomize_questions: formData.randomize_questions,
        show_results_immediately: formData.show_results_immediately,
        allow_multiple_attempts: formData.allow_multiple_attempts,
        max_attempts: formData.max_attempts ? parseInt(formData.max_attempts) : 0,
        is_active: formData.is_active,
        is_published: formData.is_published,
        available_from: formData.available_from || null,
        available_until: formData.available_until || null,
        reward_config: {
          attempt_points: parseInt(formData.attempt_points),
          completion_points: parseInt(formData.completion_points),
          completion_coins: parseInt(formData.completion_coins),
          perfect_score_bonus: parseInt(formData.perfect_score_bonus),
          high_score_bonus: parseInt(formData.high_score_bonus),
          improvement_bonus: parseInt(formData.improvement_bonus),
          base_xp: parseInt(formData.base_xp),
          bonus_xp: parseInt(formData.bonus_xp),
          difficulty_multiplier: parseFloat(formData.difficulty_multiplier)
        }
      };

      await exerciseService.updateExercise(id, exerciseData);

      const originalQuestionIds = exercise.questions?.map(q => q.id) || [];
      const currentQuestionIds = questions.map(q => q.id).filter(Boolean);

      const questionIdsToDelete = originalQuestionIds.filter(qId => !currentQuestionIds.includes(qId));
      const questionsToUpdate = questions.filter(q => q.id);
      const questionsToCreate = questions.filter(q => !q.id);

      const deletePromises = questionIdsToDelete.map(qId => exerciseService.deleteQuestion(qId));
      const updatePromises = questionsToUpdate.map(q => exerciseService.updateQuestion(q.id, q));
      const createPromises = questionsToCreate.map(q => exerciseService.createQuestion({ ...q, exercise: id }));

      await Promise.all([...deletePromises, ...updatePromises, ...createPromises]);

      toast.success(t('exercises.updateSuccess'));
      navigate('/admin/education-management/exercises');

    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error(t('exercises.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'qcm_only': return <Target className="h-4 w-4" />;
      case 'open_only': return <FileText className="h-4 w-4" />;
      case 'practical': return <Brain className="h-4 w-4" />;
      case 'interactive': return <PlayCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-orange-600';
      case 'expert': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (initialLoading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!exercise) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">{t('exercises.notFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/education-management/exercises')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('exercises.editExercise')}</h1>
            <p className="text-muted-foreground">{t('exercises.editDescription')}</p>
          </div>
        </div>

        {exercise.completion_count > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('exercises.editWarning', { count: exercise.completion_count })}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />{t('exercises.basicInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>{t('exercises.lesson')} *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Input placeholder={t('exercises.searchLessons')} value={lessonFilters.search} onChange={(e) => handleLessonFilterChange('search', e.target.value)} />
                      </div>
                      <Select value={lessonFilters.subject} onValueChange={(v) => handleLessonFilterChange('subject', v)}>
                        <SelectTrigger><SelectValue placeholder={t('exercises.filterBySubject')} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('exercises.allSubjects')}</SelectItem>
                          {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{getName(s)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={lessonFilters.grade} onValueChange={(v) => handleLessonFilterChange('grade', v)}>
                        <SelectTrigger><SelectValue placeholder={t('exercises.filterByGrade')} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('exercises.allGrades')}</SelectItem>
                          {grades.map(g => <SelectItem key={g.id} value={g.id.toString()}>{getName(g)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {(lessonFilters.search || lessonFilters.subject !== 'all' || lessonFilters.grade !== 'all') && (
                      <div className="flex justify-between items-center">
                        <Button type="button" variant="outline" size="sm" onClick={clearLessonFilters}>{t('exercises.clearFilters')}</Button>
                        <span className="text-sm text-muted-foreground">{t('exercises.lessonsFound', { count: lessons.length })}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Select value={formData.lesson} onValueChange={(v) => handleInputChange('lesson', v)} disabled={initialLoading}>
                      <SelectTrigger className={errors.lesson ? 'border-destructive' : ''}><SelectValue placeholder={initialLoading ? t('common.loading') : t('exercises.selectLesson')} /></SelectTrigger>
                      <SelectContent className="max-h-64">
                        {lessons.length === 0 && !initialLoading ? (
                          <div className="p-4 text-center text-muted-foreground">{t('exercises.noLessonsFound')}</div>
                        ) : (
                          lessons.map(lesson => (
                            <SelectItem key={lesson.id} value={lesson.id.toString()}>
                              <div className="flex items-center gap-2 w-full">
                                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{getTitle(lesson)}</div>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">{getName({ name: lesson.subject_name, name_arabic: lesson.subject_name_arabic })}</Badge>
                                    <Badge variant="secondary" className="text-xs">{getName({ name: lesson.grade_name, name_arabic: lesson.grade_name_arabic })}</Badge>
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.lesson && <p className="text-sm text-destructive mt-1">{errors.lesson}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">{t('exercises.title')} *</Label>
                      <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder={t('exercises.titlePlaceholder')} className={errors.title ? 'border-destructive' : ''} />
                      {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <Label htmlFor="title_arabic">{t('exercises.titleArabic')}</Label>
                      <Input id="title_arabic" value={formData.title_arabic} onChange={(e) => handleInputChange('title_arabic', e.target.value)} placeholder={t('exercises.titleArabicPlaceholder')} dir="rtl" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">{t('exercises.description')} *</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder={t('exercises.descriptionPlaceholder')} rows={3} className={errors.description ? 'border-destructive' : ''} />
                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                  </div>
                  <div>
                    <Label htmlFor="instructions">{t('exercises.instructions')}</Label>
                    <Textarea id="instructions" value={formData.instructions} onChange={(e) => handleInputChange('instructions', e.target.value)} placeholder={t('exercises.instructionsPlaceholder')} rows={3} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      {t('exercises.questions')}
                    </div>
                    <Badge variant="secondary">{t('exercises.totalPointsValue', { value: formData.total_points })}</Badge>
                  </CardTitle>
                  {errors.questions && <p className="text-sm text-destructive mt-2">{errors.questions}</p>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <motion.div key={q.id || qIndex} layout className="border p-4 rounded-lg space-y-4 bg-background/50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`q_text_${qIndex}`}>{t('exercises.question')} #{qIndex + 1}</Label>
                          <Textarea id={`q_text_${qIndex}`} value={q.question_text} onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)} placeholder={t('exercises.questionTextPlaceholder')} className={errors[`q_${qIndex}_text`] ? 'border-destructive' : ''} />
                          {errors[`q_${qIndex}_text`] && <p className="text-sm text-destructive mt-1">{errors[`q_${qIndex}_text`]}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)} className="ml-2 shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`q_type_${qIndex}`}>{t('exercises.questionType')}</Label>
                          <Select value={q.question_type} onValueChange={(v) => handleQuestionChange(qIndex, 'question_type', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="qcm_single">{t('exercises.questionTypes.qcm_single')}</SelectItem>
                              <SelectItem value="qcm_multiple">{t('exercises.questionTypes.qcm_multiple')}</SelectItem>
                              <SelectItem value="true_false">{t('exercises.questionTypes.true_false')}</SelectItem>
                              <SelectItem value="open_short">{t('exercises.questionTypes.open_short')}</SelectItem>
                              <SelectItem value="open_long">{t('exercises.questionTypes.open_long')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`q_points_${qIndex}`}>{t('exercises.points')}</Label>
                          <Input id={`q_points_${qIndex}`} type="number" step="0.01" value={q.points} onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)} min="0" />
                        </div>
                      </div>
                      {['qcm_single', 'qcm_multiple', 'true_false'].includes(q.question_type) && q.choices && (
                        <div className="space-y-3 pt-2">
                          <Label>{t('exercises.choices')}</Label>
                          {errors[`q_${qIndex}_choice`] && <p className="text-sm text-destructive">{errors[`q_${qIndex}_choice`]}</p>}
                          <div className="space-y-2">
                            {q.choices.map((c, cIndex) => (
                              <div key={c.id || cIndex} className="flex items-center gap-2">
                                <Checkbox id={`q_${qIndex}_c_${cIndex}_correct`} checked={c.is_correct} onCheckedChange={() => handleCorrectChoiceChange(qIndex, cIndex, q.question_type)} />
                                <Input value={c.choice_text} onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)} placeholder={`${t('exercises.choice')} ${cIndex + 1}`} />
                                <Button variant="ghost" size="icon" onClick={() => removeChoice(qIndex, cIndex)} disabled={q.choices.length <= 2}><X className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => addChoice(qIndex)}><Plus className="h-4 w-4 mr-2" />{t('exercises.addChoice')}</Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addQuestion} className="w-full"><Plus className="h-4 w-4 mr-2" />{t('exercises.addQuestion')}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />{t('exercises.rewardConfiguration')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><Label htmlFor="attempt_points">{t('exercises.rewards.attemptPoints')}</Label><Input id="attempt_points" type="number" value={formData.attempt_points} onChange={(e) => handleInputChange('attempt_points', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="completion_points">{t('exercises.rewards.completionPoints')}</Label><Input id="completion_points" type="number" value={formData.completion_points} onChange={(e) => handleInputChange('completion_points', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="completion_coins">{t('exercises.rewards.completionCoins')}</Label><Input id="completion_coins" type="number" value={formData.completion_coins} onChange={(e) => handleInputChange('completion_coins', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="perfect_score_bonus">{t('exercises.rewards.perfectScoreBonus')}</Label><Input id="perfect_score_bonus" type="number" value={formData.perfect_score_bonus} onChange={(e) => handleInputChange('perfect_score_bonus', e.target.value)} min="0" /></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><Label htmlFor="high_score_bonus">{t('exercises.rewards.highScoreBonus')}</Label><Input id="high_score_bonus" type="number" value={formData.high_score_bonus} onChange={(e) => handleInputChange('high_score_bonus', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="improvement_bonus">{t('exercises.rewards.improvementBonus')}</Label><Input id="improvement_bonus" type="number" value={formData.improvement_bonus} onChange={(e) => handleInputChange('improvement_bonus', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="base_xp">{t('exercises.rewards.baseXP')}</Label><Input id="base_xp" type="number" value={formData.base_xp} onChange={(e) => handleInputChange('base_xp', e.target.value)} min="0" /></div>
                    <div><Label htmlFor="bonus_xp">{t('exercises.rewards.bonusXP')}</Label><Input id="bonus_xp" type="number" value={formData.bonus_xp} onChange={(e) => handleInputChange('bonus_xp', e.target.value)} min="0" /></div>
                  </div>
                  <div className="max-w-xs">
                    <Label htmlFor="difficulty_multiplier">{t('exercises.rewards.difficultyMultiplier')}</Label>
                    <Input id="difficulty_multiplier" type="number" step="0.01" value={formData.difficulty_multiplier} onChange={(e) => handleInputChange('difficulty_multiplier', e.target.value)} min="0.01" max="5.00" />
                    <p className="text-xs text-muted-foreground mt-1">{t('exercises.rewards.multiplierHint')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />{t('exercises.configuration')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exercise_format">{t('exercises.format')}</Label>
                      <Select value={formData.exercise_format} onValueChange={(v) => handleInputChange('exercise_format', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixed"><div className="flex items-center gap-2">{getFormatIcon('mixed')}{t('exercises.format.mixed')}</div></SelectItem>
                          <SelectItem value="qcm_only"><div className="flex items-center gap-2">{getFormatIcon('qcm_only')}{t('exercises.format.qcmOnly')}</div></SelectItem>
                          <SelectItem value="open_only"><div className="flex items-center gap-2">{getFormatIcon('open_only')}{t('exercises.format.openOnly')}</div></SelectItem>
                          <SelectItem value="practical"><div className="flex items-center gap-2">{getFormatIcon('practical')}{t('exercises.format.practical')}</div></SelectItem>
                          <SelectItem value="interactive"><div className="flex items-center gap-2">{getFormatIcon('interactive')}{t('exercises.format.interactive')}</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty_level">{t('exercises.difficulty')}</Label>
                      <Select value={formData.difficulty_level} onValueChange={(v) => handleInputChange('difficulty_level', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner"><span className={getDifficultyColor('beginner')}>{t('exercises.difficulty.beginner')}</span></SelectItem>
                          <SelectItem value="intermediate"><span className={getDifficultyColor('intermediate')}>{t('exercises.difficulty.intermediate')}</span></SelectItem>
                          <SelectItem value="advanced"><span className={getDifficultyColor('advanced')}>{t('exercises.difficulty.advanced')}</span></SelectItem>
                          <SelectItem value="expert"><span className={getDifficultyColor('expert')}>{t('exercises.difficulty.expert')}</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimated_duration">{t('exercises.estimatedDuration')}</Label>
                      <div className="relative">
                        <Input id="estimated_duration" type="number" value={formData.estimated_duration} onChange={(e) => handleInputChange('estimated_duration', e.target.value)} placeholder="30" min="1" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t('exercises.minutesHint')}</p>
                    </div>
                    <div>
                      <Label htmlFor="max_attempts">{t('exercises.maxAttempts')}</Label>
                      <Input id="max_attempts" type="number" value={formData.max_attempts} onChange={(e) => handleInputChange('max_attempts', e.target.value)} placeholder="0" min="0" className={errors.max_attempts ? 'border-destructive' : ''} />
                      <p className="text-xs text-muted-foreground mt-1">{t('exercises.unlimitedHint')}</p>
                      {errors.max_attempts && <p className="text-sm text-destructive mt-1">{errors.max_attempts}</p>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="is_timed" checked={formData.is_timed} onCheckedChange={(c) => handleInputChange('is_timed', c)} />
                      <Label htmlFor="is_timed">{t('exercises.isTimedExercise')}</Label>
                    </div>
                    {formData.is_timed && (
                      <div className="ml-6">
                        <Label htmlFor="time_limit">{t('exercises.timeLimit')} *</Label>
                        <div className="relative max-w-xs">
                          <Input id="time_limit" type="number" value={formData.time_limit} onChange={(e) => handleInputChange('time_limit', e.target.value)} placeholder="60" min="1" className={errors.time_limit ? 'border-destructive' : ''} />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t('exercises.minutesHint')}</p>
                        {errors.time_limit && <p className="text-sm text-destructive mt-1">{errors.time_limit}</p>}
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="auto_grade">{t('exercises.autoGrade')}</Label><p className="text-xs text-muted-foreground">{t('exercises.autoGradeDesc')}</p></div>
                    <Switch id="auto_grade" checked={formData.auto_grade} onCheckedChange={(c) => handleInputChange('auto_grade', c)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="randomize_questions">{t('exercises.randomizeQuestions')}</Label><p className="text-xs text-muted-foreground">{t('exercises.randomizeQuestionsDesc')}</p></div>
                    <Switch id="randomize_questions" checked={formData.randomize_questions} onCheckedChange={(c) => handleInputChange('randomize_questions', c)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="show_results_immediately">{t('exercises.showResultsImmediately')}</Label><p className="text-xs text-muted-foreground">{t('exercises.showResultsImmediatelyDesc')}</p></div>
                    <Switch id="show_results_immediately" checked={formData.show_results_immediately} onCheckedChange={(c) => handleInputChange('show_results_immediately', c)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="allow_multiple_attempts">{t('exercises.allowMultipleAttempts')}</Label><p className="text-xs text-muted-foreground">{t('exercises.allowMultipleAttemptsDesc')}</p></div>
                    <Switch id="allow_multiple_attempts" checked={formData.allow_multiple_attempts} onCheckedChange={(c) => handleInputChange('allow_multiple_attempts', c)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />{t('exercises.availability')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="is_active">{t('exercises.isActive')}</Label><p className="text-xs text-muted-foreground">{t('exercises.isActiveDesc')}</p></div>
                    <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => handleInputChange('is_active', c)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label htmlFor="is_published">{t('exercises.isPublished')}</Label><p className="text-xs text-muted-foreground">{t('exercises.isPublishedDesc')}</p></div>
                    <Switch id="is_published" checked={formData.is_published} onCheckedChange={(c) => handleInputChange('is_published', c)} />
                  </div>
                  <Separator />
                  <div><Label htmlFor="available_from">{t('exercises.availableFrom')}</Label><Input id="available_from" type="datetime-local" value={formData.available_from} onChange={(e) => handleInputChange('available_from', e.target.value)} /></div>
                  <div><Label htmlFor="available_until">{t('exercises.availableUntil')}</Label><Input id="available_until" type="datetime-local" value={formData.available_until} onChange={(e) => handleInputChange('available_until', e.target.value)} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{t('common.updating')}</> : <><Save className="h-4 w-4 mr-2" />{t('exercises.updateExercise')}</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/education-management/exercises')} disabled={loading} className="w-full">{t('common.cancel')}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default EditExercisePage;
