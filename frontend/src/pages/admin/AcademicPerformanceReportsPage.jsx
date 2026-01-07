import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import reportsService from '../../services/reports';
import { schoolsService, usersService } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { getLocalizedName } from '@/lib/utils';

const gradeColorMap = {
  '90-100': 'bg-emerald-500',
  '80-89': 'bg-blue-500',
  '70-79': 'bg-amber-500',
  '60-69': 'bg-orange-500',
  '<60': 'bg-red-500',
};

const academicActions = [
  { title: 'Share top performers with teachers', detail: 'Download PDF and email to subject leads.', type: 'success' },
  { title: 'Follow up on missing work', detail: 'Students with missing submissions need nudges.', type: 'warning' },
  { title: 'Plan math intervention block', detail: 'Flagged cohorts show widening gap in math.', type: 'alert' },
];

const AcademicPerformanceReportsPage = () => {
  const { i18n } = useTranslation();
  const [dateRange, setDateRange] = useState('this_term');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const [summary, setSummary] = useState({
    average_score: 0,
    pass_rate: 0,
    completion_rate: 0,
    missing_submissions: 0,
  });
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [subjectRows, setSubjectRows] = useState([]);
  const [classRows, setClassRows] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [classOptions, setClassOptions] = useState(['all']);
  const [subjectOptions, setSubjectOptions] = useState(['all']);
  const [teacherOptions, setTeacherOptions] = useState(['all']);
  const [gradeOptions, setGradeOptions] = useState(['all']);
  const [yearOptions, setYearOptions] = useState(['all']);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [ordering, setOrdering] = useState('-average_score');
  const [totalStudents, setTotalStudents] = useState(0);
  const [teacherRows, setTeacherRows] = useState([]);

  const { user } = useAuth();
  const role = (user?.role || '').toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'STAFF';
  const isTeacher = role === 'TEACHER';
  const Layout = isTeacher ? TeacherPageLayout : AdminPageLayout;

  const filteredTopStudents = useMemo(() => {
    return topStudents.filter((student) => {
      const matchesClass = classFilter === 'all' || student.class_name === classFilter;
      const matchesSubject = subjectFilter === 'all' || student.subject === subjectFilter;
      return matchesClass && matchesSubject;
    });
  }, [topStudents, classFilter, subjectFilter]);

  const filteredAtRisk = useMemo(() => {
    return atRiskStudents.filter((student) => {
      const matchesClass = classFilter === 'all' || student.class_name === classFilter;
      const matchesSubject = subjectFilter === 'all' || student.subject === subjectFilter;
      return matchesClass && matchesSubject;
    });
  }, [atRiskStudents, classFilter, subjectFilter]);

  const totalGrades = gradeDistribution.reduce((sum, band) => sum + (band.count || 0), 0) || 1;

  useEffect(() => {
    loadFilters();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isTeacher && user?.id) {
      setTeacherFilter(String(user.id));
    }
  }, [isTeacher, user]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, classFilter, subjectFilter, teacherFilter, gradeFilter, yearFilter, page, pageSize, ordering]);

  const loadFilters = async () => {
    try {
      setFilterLoading(true);
      const [classesRes, subjectsRes, teachersRes, gradesRes, yearsRes] = await Promise.allSettled([
        schoolsService.getClasses({ page_size: 200 }),
        schoolsService.getSubjects({ page_size: 200 }),
        usersService.getTeachers({ page_size: 200 }),
        schoolsService.getGrades({ page_size: 200 }),
        schoolsService.getAcademicYears({ page_size: 200 }),
      ]);

      const extractList = (res) => {
        if (res.status !== 'fulfilled') return [];
        const payload = res.value;
        return payload?.results || payload?.data?.results || payload?.data || payload || [];
      };

      const classes = extractList(classesRes).map((c) => ({
        value: String(c.id),
        label: c.name || c.code || `Class ${c.id}`,
      }));
      const subjects = extractList(subjectsRes).map((s) => ({
        value: String(s.id),
        label: getLocalizedName(s, i18n.language) || s.title || `Subject ${s.id}`,
      }));
      const teachers = extractList(teachersRes).map((t) => ({
        value: String(t.id),
        label: t.full_name || `${t.first_name || ''} ${t.last_name || ''}`.trim() || `Teacher ${t.id}`,
      }));
      const gradeList = extractList(gradesRes);
      const yearList = extractList(yearsRes);

      setClassOptions(['all', ...classes]);
      setSubjectOptions(['all', ...subjects]);
      setTeacherOptions(
        !isAdmin && isTeacher && user?.id
          ? ['all', { value: String(user.id), label: user.full_name || 'You' }]
          : ['all', ...teachers]
      );
      setGradeOptions(['all', ...gradeList.map((g) => ({ value: String(g.id), label: getLocalizedName(g, i18n.language) || g.code || `Grade ${g.id}` }))]);
      setYearOptions(['all', ...yearList.map((y) => ({ value: String(y.id), label: getLocalizedName(y, i18n.language) || y.year || y.name || `Year ${y.id}` }))]);
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = await reportsService.fetchStudentPerformance({
        date_range: dateRange,
        ...(classFilter !== 'all' ? { class_id: Number(classFilter) } : {}),
        ...(subjectFilter !== 'all' ? { subject_id: Number(subjectFilter) } : {}),
        ...(isAdmin && teacherFilter !== 'all' ? { teacher_id: Number(teacherFilter) } : {}),
        ...(isTeacher && user?.id ? { teacher_id: user.id } : {}),
        ...(gradeFilter !== 'all' ? { grade_id: Number(gradeFilter) } : {}),
        ...(yearFilter !== 'all' ? { academic_year_id: Number(yearFilter) } : {}),
        page,
        page_size: pageSize,
        ordering,
      });

      setSummary(payload?.summary || {});
      setGradeDistribution(payload?.grade_distribution || []);
      setTopStudents(payload?.top_students || []);
      setAtRiskStudents(payload?.at_risk_students || []);
      setSubjectRows(payload?.subjects || []);
      setClassRows(payload?.classes || []);
      setRecentAssessments(payload?.recent_assessments || []);
      setTotalStudents(payload?.pagination?.total_students || 0);

      // Teacher performance
      const teachersPayload = await reportsService.fetchTeacherPerformance({
        date_range: dateRange,
        ...(classFilter !== 'all' ? { class_id: Number(classFilter) } : {}),
        ...(subjectFilter !== 'all' ? { subject_id: Number(subjectFilter) } : {}),
        ...(isAdmin && teacherFilter !== 'all' ? { teacher_id: Number(teacherFilter) } : {}),
        ...(gradeFilter !== 'all' ? { grade_id: Number(gradeFilter) } : {}),
        ...(yearFilter !== 'all' ? { academic_year_id: Number(yearFilter) } : {}),
      });
      const teacherData = teachersPayload?.teachers || [];
      setTeacherRows(isTeacher && user?.id ? teacherData.filter((t) => t.teacher_id === user.id) : teacherData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load performance data. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const filtersDisabled = loading || filterLoading;
  const totalPages = Math.max(1, Math.ceil((totalStudents || 0) / pageSize));

  return (
    <Layout
      title="Academic Performance Reports"
      subtitle="Track grades, mastery, and improvement across classes and subjects."
      showRefreshButton
      onRefresh={fetchData}
      actions={[
        <Button key="export" variant="outline" size="sm">
          <ClipboardList className="h-4 w-4 mr-2" />
          Export
        </Button>,
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
            {[
              {
                title: 'Average Score',
                value: `${Math.round(summary.average_score || 0)}%`,
                hint: 'From graded submissions',
                icon: TrendingUp,
                tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
              },
              {
                title: 'Pass Rate',
                value: `${Math.round(summary.pass_rate || 0)}%`,
                hint: 'Passing ≥ 50%',
                icon: CheckCircle2,
                tone: 'bg-blue-50 text-blue-700 border-blue-100',
              },
              {
                title: 'Completion Rate',
                value: `${Math.round(summary.completion_rate || 0)}%`,
                hint: `${summary.missing_submissions ?? 0} missing`,
                icon: ClipboardList,
                tone: 'bg-amber-50 text-amber-700 border-amber-100',
              },
              {
                title: 'Improvement Rate',
                value: summary.trend_delta !== null && summary.trend_delta !== undefined
                  ? `${summary.trend_delta > 0 ? '+' : ''}${summary.trend_delta}%`
                  : '—',
                hint: 'Vs previous period',
                icon: Sparkles,
                tone: 'bg-indigo-50 text-indigo-700 border-indigo-100',
              },
            ].map((card) => (
              <Card key={card.title} className={`border-2 ${card.tone}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-semibold">{card.value}</p>
                    <p className="text-xs mt-1 text-muted-foreground">{card.hint}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-white/80 border flex items-center justify-center">
                    <card.icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="min-w-[260px] border-primary/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Date Range</p>
                  <p className="font-semibold">{dateRange === 'this_term' ? 'This Term' : dateRange}</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange} disabled={filtersDisabled}>
                  <SelectTrigger className="w-full" disabled={filtersDisabled}>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_term">This Term</SelectItem>
                    <SelectItem value="last_term">Last Term</SelectItem>
                    <SelectItem value="this_year">This Academic Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchData}>
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Benchmarked against school targets
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Filters</CardTitle>
            <CardDescription>Slice performance by cohort, subject, and time period.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <Select value={classFilter} onValueChange={setClassFilter} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((classOption) => (
                  <SelectItem
                    key={classOption === 'all' ? 'all' : classOption.value}
                    value={classOption === 'all' ? 'all' : classOption.value}
                  >
                    {classOption === 'all' ? 'All Classes' : classOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((subject) => (
                  <SelectItem
                    key={subject === 'all' ? 'all' : subject.value}
                    value={subject === 'all' ? 'all' : subject.value}
                  >
                    {subject === 'all' ? 'All Subjects' : subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={teacherFilter} onValueChange={setTeacherFilter} disabled={filtersDisabled || !isAdmin}>
              <SelectTrigger disabled={filtersDisabled || !isAdmin}>
                <SelectValue placeholder="All Teachers" />
              </SelectTrigger>
              <SelectContent>
                {teacherOptions.map((teacher) => (
                  <SelectItem
                    key={teacher === 'all' ? 'all' : teacher.value}
                    value={teacher === 'all' ? 'all' : teacher.value}
                  >
                    {teacher === 'all' ? 'All Teachers' : teacher.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem
                    key={grade === 'all' ? 'all' : grade.value}
                    value={grade === 'all' ? 'all' : grade.value}
                  >
                    {grade === 'all' ? 'All Grades' : grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem
                    key={year === 'all' ? 'all' : year.value}
                    value={year === 'all' ? 'all' : year.value}
                  >
                    {year === 'all' ? 'All Years' : year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_term">This Term</SelectItem>
                <SelectItem value="last_term">Last Term</SelectItem>
                <SelectItem value="this_year">This Academic Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ordering} onValueChange={(v) => { setOrdering(v); setPage(1); }} disabled={filtersDisabled}>
              <SelectTrigger disabled={filtersDisabled}>
                <SelectValue placeholder="Order By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-average_score">Top Score</SelectItem>
                <SelectItem value="average_score">Lowest Score</SelectItem>
                <SelectItem value="-pass_rate">Top Pass Rate</SelectItem>
                <SelectItem value="-improvement">Most Improved</SelectItem>
                <SelectItem value="-missing_submissions">Most Missing</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading data...</span>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">{isTeacher ? 'My Performance' : 'Teachers'}</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="flags">Flags</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Snapshot of scores by band across the selected range.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gradeDistribution.length === 0 && (
                    <p className="text-sm text-muted-foreground">No graded submissions yet for this filter set.</p>
                  )}
                  {gradeDistribution.map((band) => {
                    const barValue = Math.round((band.count / totalGrades) * 100);
                    const color = gradeColorMap[band.label] || 'bg-muted';
                    return (
                      <div key={band.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{band.label}</span>
                          <span className="text-muted-foreground">
                            {band.percentage !== undefined ? Math.round(band.percentage * 100) / 100 : 0}%
                          </span>
                        </div>
                        <Progress value={barValue} className={color} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>Quick wins based on current performance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {academicActions.map((item) => (
                    <div
                      key={item.title}
                      className="p-3 rounded-lg border bg-muted/50 flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        {item.type === 'success' && <GraduationCap className="h-4 w-4 text-emerald-600" />}
                        {item.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        {item.type === 'alert' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Highest averages in the selected scope.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredTopStudents.length === 0 && (
                    <p className="text-sm text-muted-foreground">No student scores yet for this filter.</p>
                  )}
                  {filteredTopStudents.slice(0, 4).map((student, index) => (
                    <div key={student.student_id || `${student.name}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {student.average_score ? Math.round(student.average_score) : 0}%
                        </p>
                        <p className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                          <ArrowUpRight className="h-3 w-3" />
                          {student.pass_rate ? Math.round(student.pass_rate) : 0}% pass rate
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Improved</CardTitle>
                  <CardDescription>Students with the strongest upward trend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredTopStudents.length === 0 && (
                    <p className="text-sm text-muted-foreground">No student scores yet for this filter.</p>
                  )}
                  {filteredTopStudents.slice(0, 4).map((student, index) => (
                    <div key={student.student_id || `${student.name}-improved-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{(student.name || 'ST').slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class_name}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
                        +{student.pass_rate ? Math.round(student.pass_rate) : 0}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Needs Support</CardTitle>
                  <CardDescription>Flagged for low scores or missing work.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredAtRisk.length === 0 && (
                    <div className="text-muted-foreground text-sm">No active flags.</div>
                  )}
                  {filteredAtRisk.map((student) => (
                    <div key={student.student_id || `${student.name}-risk`} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {student.name}
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            At Risk
                          </Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">{student.class_name} · {student.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {student.average_score ? Math.round(student.average_score) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground">{student.missing_submissions ?? 0} missing</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Completion, dispersion, and average score.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Assessment</th>
                      <th>Subject</th>
                      <th>Average</th>
                      <th>Completion</th>
                      <th>Std Dev</th>
                      <th className="text-right">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentAssessments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-muted-foreground">
                          No recent assessments for this filter set.
                        </td>
                      </tr>
                    )}
                    {recentAssessments.map((assessment) => (
                      <tr key={assessment.homework_id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{assessment.title}</td>
                        <td>{assessment.subject}</td>
                        <td className="font-semibold">{Math.round(assessment.average_score || 0)}%</td>
                        <td className="flex items-center gap-2">
                          <Progress value={Math.round(assessment.completion_rate || 0)} className="w-28" />
                          <span>{Math.round(assessment.completion_rate || 0)}%</span>
                        </td>
                        <td>{Math.round(assessment.std_dev || 0)}%</td>
                        <td className="text-right text-muted-foreground">
                          {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Score, pass rate, and missing submissions.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Student</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Average</th>
                      <th>Pass Rate</th>
                      <th>Improvement</th>
                      <th>Accuracy</th>
                      <th>Missing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredTopStudents.map((student) => (
                      <tr key={`${student.student_id}-${student.subject}-${student.class_name}`} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{student.name}</td>
                        <td>{student.class_name || '—'}</td>
                        <td>{student.subject || '—'}</td>
                        <td className="font-semibold">{Math.round(student.average_score || 0)}%</td>
                        <td>{Math.round(student.pass_rate || 0)}%</td>
                        <td className={student.improvement && student.improvement < 0 ? 'text-red-600' : 'text-emerald-600'}>
                          {student.improvement === null || student.improvement === undefined ? '—' : `${student.improvement > 0 ? '+' : ''}${student.improvement}%`}
                        </td>
                        <td>
                          {student.accuracy === null || student.accuracy === undefined
                            ? '—'
                            : `${Math.round(student.accuracy)}%`}
                        </td>
                        <td className={student.missing_submissions > 2 ? 'text-red-600' : ''}>
                          {student.missing_submissions ?? 0}
                        </td>
                      </tr>
                    ))}
                    {filteredTopStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-muted-foreground">
                          No students found for these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} · {totalStudents} students
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                      disabled={page >= totalPages || loading}
                    >
                      Next
                    </Button>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => {
                        setPageSize(Number(v));
                        setPage(1);
                      }}
                      disabled={filtersDisabled}
                    >
                      <SelectTrigger className="w-28" disabled={filtersDisabled}>
                        <SelectValue placeholder="Page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
                <CardDescription>Average score, pass rate, and on-time submissions.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Subject</th>
                      <th>Average</th>
                      <th>Pass Rate</th>
                      <th>On-Time</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subjectRows.map((subject) => (
                      <tr key={subject.subject_id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {subject.subject_name}
                        </td>
                        <td className="font-semibold">{Math.round(subject.average_score || 0)}%</td>
                        <td>{Math.round(subject.pass_rate || 0)}%</td>
                        <td>{Math.round(subject.on_time_rate || 0)}%</td>
                        <td className="flex items-center gap-1">
                          {subject.trend && subject.trend >= 0 ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-600">+{subject.trend}%</span>
                            </>
                          ) : subject.trend ? (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">{subject.trend}%</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {subjectRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No subject data for these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Cohorts</CardTitle>
                <CardDescription>Compare averages and missing assignments by class.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {classRows.map((row) => (
                  <div key={row.class_id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{row.class_name}</p>
                        <p className="text-xs text-muted-foreground">{row.submission_count} submissions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="font-semibold">
                          {Math.round(row.average_score || 0)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Pass</p>
                        <p className="font-semibold">{Math.round(row.pass_rate || 0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
                {classRows.length === 0 && (
                  <div className="text-sm text-muted-foreground">No class data for these filters.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Flags</CardTitle>
                <CardDescription>Students who need attention based on the latest data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredAtRisk.length === 0 && (
                  <div className="text-muted-foreground text-sm">No active flags.</div>
                )}
                {filteredAtRisk.map((student) => (
                  <div key={student.student_id || `${student.name}-flag`} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {student.name}
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          At Risk
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">{student.class_name} · {student.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {Math.round(student.average_score || 0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">{student.missing_submissions ?? 0} missing</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isTeacher ? 'My Performance' : 'Teacher Performance'}</CardTitle>
                <CardDescription>
                  {isTeacher
                    ? 'Scores and completion across your cohorts.'
                    : 'Scores and completion across each teacher’s cohorts.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Teacher</th>
                      <th>Avg Score</th>
                      <th>Pass Rate</th>
                      <th>Completion</th>
                      <th>On-Time</th>
                      <th>Assignments</th>
                      <th>Classes</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {teacherRows.map((row) => (
                      <tr key={row.teacher_id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{row.name}</td>
                        <td className="font-semibold">{Math.round(row.average_score || 0)}%</td>
                        <td>{Math.round(row.pass_rate || 0)}%</td>
                        <td>{Math.round(row.completion_rate || 0)}%</td>
                        <td>{Math.round(row.on_time_rate || 0)}%</td>
                        <td>{row.assignments}</td>
                        <td>{row.classes}</td>
                        <td>{row.students}</td>
                      </tr>
                    ))}
                    {teacherRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-4 text-center text-muted-foreground">
                          No teacher data for these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AcademicPerformanceReportsPage;
