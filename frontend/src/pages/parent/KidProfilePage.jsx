import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import usersService from '../../services/users';
import schoolsService from '../../services/schools';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '../../components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '../../components/ui/tabs';
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    GraduationCap,
    BookOpen,
    Users,
    Clock,
    Shield,
    Heart,
    Contact,
    ChevronDown,
    Loader2,
    Briefcase,
    MessageSquare,
    AlertCircle,
    Send
} from 'lucide-react';
import { format } from 'date-fns';
import { ar, fr, enUS } from 'date-fns/locale';
import MessageTeacherDialog from '../../components/communication/MessageTeacherDialog';

const KidProfilePage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [kids, setKids] = useState([]);
    const [selectedKid, setSelectedKid] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState(null);

    // Messaging State
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [activeTeacher, setActiveTeacher] = useState(null);

    // Initial Fetch of Children
    useEffect(() => {
        const fetchKids = async () => {
            try {
                setLoading(true);
                // Assuming user.id is the parent's ID
                if (user?.id) {
                    const response = await usersService.getUserChildren(user.id);
                    // The API returns { parent: {...}, children: [...], total_children: N }
                    const childrenList = response.children || [];
                    setKids(childrenList);

                    if (childrenList.length > 0) {
                        setSelectedKid(childrenList[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch kids:", err);
                setError(t('errors.failedToLoadChildren', 'Failed to load children information.'));
            } finally {
                setLoading(false);
            }
        };

        fetchKids();
    }, [user?.id, t]);

    // Fetch Details when Selected Kid Changes
    useEffect(() => {
        const fetchKidDetails = async () => {
            if (!selectedKid) return;

            try {
                setLoadingDetails(true);

                // 1. Fetch Class Details (for Teachers)
                // Use the derived schoolClassId from the render scope, or recalculate here securely.
                // Access flattened fields or enrollment
                const enrollment = selectedKid.student_enrollments?.find(e => e.is_active);
                const classId = selectedKid.school_class_id ||
                    (enrollment?.school_class && (typeof enrollment.school_class === 'object' ? enrollment.school_class.id : enrollment.school_class));

                if (classId) {
                    const classData = await schoolsService.getClassById(classId);
                    setClassDetails(classData);
                } else {
                    setClassDetails(null);
                }

            } catch (err) {
                console.error("Failed to fetch kid details:", err);
                // Don't block the UI, just show what we have
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchKidDetails();
    }, [selectedKid]);

    const handleKidChange = (kidId) => {
        const kid = kids.find(k => k.id.toString() === kidId.toString());
        if (kid) {
            setSelectedKid(kid);
        }
    };

    // Formatters
    const formatDate = (dateString) => {
        if (!dateString) return t('common.notAvailable', 'N/A');
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return t('common.notAvailable', 'N/A');

        const locales = {
            ar: ar,
            fr: fr,
            en: enUS
        };

        return format(date, 'PPP', { locale: locales[i18n.language] || enUS });
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleOpenMessageModal = (teacher) => {
        setActiveTeacher(teacher);
        setIsMessageModalOpen(true);
    };

    // Components
    const InfoItem = ({ icon: Icon, label, value, isLink = false }) => {
        if (!Icon) return null;
        return (
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-0.5">{label}</p>
                    {isLink && value ? (
                        <a
                            href={value.startsWith('http') ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-indigo-600 hover:underline break-all"
                        >
                            {value}
                        </a>
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 break-words">{value || '-'}</p>
                    )}
                </div>
            </div>
        );
    };

    // Initial Loading State
    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-[600px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium">{t('common.loading', 'Loading profile...')}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout user={user}>
                <div className="p-8 max-w-2xl mx-auto">
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                {t('common.error', 'Error')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600">{error}</p>
                            <Button className="mt-4" onClick={() => window.location.reload()}>
                                {t('common.retry', 'Try Again')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    if (!selectedKid) {
        return (
            <DashboardLayout user={user}>
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Users className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        {t('parent.noKidsFound', 'No children profiles found')}
                    </h2>
                    <p className="text-slate-500 max-w-md">
                        {t('parent.noKidsDescription', 'It looks like there are no students linked to your account yet. Please contact the school administration.')}
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    const currentEnrollment = selectedKid.student_enrollments?.find(e => e.is_active);
    const age = calculateAge(selectedKid.date_of_birth);


    // Localization helper
    const getLocalizedValue = (obj, fieldBase) => {
        if (!obj) return '-';
        const lang = i18n.language;
        // Check for specific field names like grade_arabic, track_arabic, subject_arabic
        if (lang === 'ar') {
            return obj[`${fieldBase}_arabic`] || obj[`ar_${fieldBase}`] || obj[fieldBase] || '-';
        }
        if (lang === 'fr') {
            return obj[`${fieldBase}_french`] || obj[fieldBase] || '-';
        }
        return obj[fieldBase] || '-';
    };

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {t('parentMenu.kidProfile', "Kid's Profile")}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {t('parent.kidProfileSubtitle', "View and manage your child's information")}
                        </p>
                    </div>

                    {/* Kid Selector */}
                    {kids.length > 1 && (
                        <div className="min-w-[240px]">
                            <Select
                                value={selectedKid.id.toString()}
                                onValueChange={handleKidChange}
                            >
                                <SelectTrigger className="h-12 border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={selectedKid.profile_picture_url || selectedKid.profile?.profile_picture} />
                                            <AvatarFallback>{selectedKid.first_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start text-sm">
                                            <span className="font-semibold leading-none">
                                                {getLocalizedValue(selectedKid, 'full_name')}
                                            </span>
                                        </div>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {kids.map((kid) => (
                                        <SelectItem key={kid.id} value={kid.id.toString()}>
                                            {getLocalizedValue(kid, 'full_name')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar - Identity */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className="h-32 bg-gradient-to-b from-indigo-500 to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
                            </div>
                            <CardContent className="pt-0 relative">
                                <div className="flex flex-col items-center -mt-12 text-center">
                                    <Avatar className="h-28 w-28 border-4 border-white shadow-md ring-1 ring-slate-100">
                                        <AvatarImage src={selectedKid.profile_picture_url || selectedKid.profile?.profile_picture} alt={selectedKid.full_name} />
                                        <AvatarFallback className="text-3xl bg-indigo-50 text-indigo-600">
                                            {selectedKid.first_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                                        {getLocalizedValue(selectedKid, 'full_name')}
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        {getLocalizedValue(selectedKid, 'grade')}
                                    </p>

                                    <div className="flex items-center gap-2 mt-4 mb-6">
                                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-3 py-1">
                                            {t('common.studentID', 'ID')}: {selectedKid.student_id || selectedKid.student_number || 'N/A'}
                                        </Badge>
                                        <Badge variant={selectedKid.is_active ? "success" : "secondary"} className={selectedKid.is_active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                                            {selectedKid.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                                        </Badge>
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
                                        <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('common.class', 'Class')}</span>
                                            <span className="font-bold text-slate-900 mt-1">
                                                {selectedKid.class_name || '-'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('common.grade', 'Grade')}</span>
                                            <span className="font-bold text-slate-900 mt-1">
                                                {getLocalizedValue(selectedKid, 'grade')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Contact / Actions */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-500" />
                                    {t('common.quickActions', 'Quick Actions')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/parent/communications/new')}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {t('actions.contactTeacher', 'Contact Teachers')}
                                </Button>
                                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/parent/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    {t('actions.updateInfo', 'Request Info Update')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Content - Tabs */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 mb-6 space-x-2">
                                <TabsTrigger
                                    value="overview"
                                    className="px-6 py-3 rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-all rounded-none"
                                >
                                    {t('tabs.overview', 'Overview')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="academic"
                                    className="px-6 py-3 rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-all rounded-none"
                                >
                                    {t('tabs.academic', 'Academic Info')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="teachers"
                                    className="px-6 py-3 rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-all rounded-none"
                                >
                                    {t('tabs.teachers', 'Teachers')}
                                </TabsTrigger>
                            </TabsList>

                            {isMessageModalOpen && activeTeacher && (
                                <MessageTeacherDialog
                                    open={isMessageModalOpen}
                                    onOpenChange={setIsMessageModalOpen}
                                    teacher={activeTeacher}
                                    studentId={selectedKid.id}
                                    teacherName={activeTeacher.name}
                                    subject={getLocalizedValue(activeTeacher, 'subject') || t('common.teacher', 'Teacher')}
                                />
                            )}

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <Card className="border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                            <User className="h-5 w-5 text-indigo-500" />
                                            {t('section.personalInfo', 'Personal Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={Calendar}
                                            label={t('common.dateOfBirth', 'Date of Birth')}
                                            value={selectedKid.date_of_birth ? `${formatDate(selectedKid.date_of_birth)} (${age} ${t('common.years', 'years')})` : null}
                                        />
                                        <InfoItem
                                            icon={MapPin}
                                            label={t('common.address', 'Address')}
                                            value={selectedKid.address}
                                        />
                                        <InfoItem
                                            icon={Phone}
                                            label={t('common.phone', 'Phone')}
                                            value={selectedKid.phone}
                                        />
                                        <InfoItem
                                            icon={Mail}
                                            label={t('common.email', 'Email')}
                                            value={selectedKid.email}
                                        />
                                    </CardContent>
                                    <div className="px-6 pb-6 pt-2">
                                        <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
                                            <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                {t('common.bio', 'About')} {selectedKid.first_name}
                                            </h4>
                                            <p className="text-sm text-slate-600 italic">
                                                {selectedKid.bio || t('common.noBio', 'No bio available.')}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                            <Heart className="h-5 w-5 text-rose-500" />
                                            {t('section.emergencyInfo', 'Emergency Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={Contact}
                                            label={t('common.emergencyContact', 'Contact Name')}
                                            value={selectedKid.emergency_contact_name}
                                        />
                                        <InfoItem
                                            icon={Phone}
                                            label={t('common.emergencyPhone', 'Contact Phone')}
                                            value={selectedKid.emergency_contact_phone}
                                        />
                                        <div className="md:col-span-2">
                                            <InfoItem
                                                icon={Shield}
                                                label={t('common.medicalNotes', 'Medical Notes')}
                                                value={selectedKid.medical_notes || t('common.none', 'None')}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Academic Tab */}
                            <TabsContent value="academic" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <Card className="border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                            <GraduationCap className="h-5 w-5 text-indigo-500" />
                                            {t('section.academicDetails', 'Academic Details')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <InfoItem
                                                icon={Briefcase}
                                                label={t('common.level', 'Educational Level')}
                                                value={getLocalizedValue(selectedKid, 'grade')?.split(' ')?.[0] || '-'}
                                            />
                                            <InfoItem
                                                icon={GraduationCap}
                                                label={t('common.grade', 'Grade')}
                                                value={getLocalizedValue(selectedKid, 'grade')}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <InfoItem
                                                icon={Users}
                                                label={t('common.class', 'Class')}
                                                value={selectedKid.class_name}
                                            />
                                            <InfoItem
                                                icon={Clock}
                                                label={t('common.academicYear', 'Academic Year')}
                                                value={selectedKid.academic_year}
                                            />
                                        </div>
                                    </CardContent>
                                    <div className="px-6 pb-6">
                                        <InfoItem
                                            icon={BookOpen}
                                            label={t('common.track', 'Track/Stream')}
                                            value={getLocalizedValue(classDetails || currentEnrollment?.school_class, 'track')}
                                        />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Teachers Tab */}
                            <TabsContent value="teachers" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                {loadingDetails ? (
                                    <div className="flex justify-center p-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                    </div>
                                ) : classDetails?.teachers && classDetails.teachers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {classDetails.teachers.map((teacher) => (
                                            <Card key={teacher.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                                <CardContent className="p-0">
                                                    <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-90" />
                                                    <div className="px-6 pb-6 -mt-10">
                                                        <div className="flex justify-between items-end">
                                                            <Avatar className="h-20 w-20 border-4 border-white shadow-sm ring-1 ring-slate-100">
                                                                <AvatarImage src={teacher.profile?.profile_picture} alt={teacher.name} />
                                                                <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-xl">
                                                                    {teacher.name?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="mb-2 gap-2"
                                                                onClick={() => handleOpenMessageModal(teacher)}
                                                            >
                                                                <MessageSquare className="h-4 w-4" />
                                                                {t('common.message', 'Message')}
                                                            </Button>
                                                        </div>
                                                        <div className="mt-4">
                                                            <h4 className="font-bold text-lg text-slate-900">{teacher.name}</h4>
                                                            <div className="flex items-center gap-2 mt-1 mb-3">
                                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                                                                    {getLocalizedValue(teacher, 'subject') || t('common.teacher', 'Teacher')}
                                                                </Badge>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    <span className="truncate">{teacher.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                                        <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                        <h3 className="text-lg font-medium text-slate-900">{t('common.noTeachers', 'No teachers found')}</h3>
                                        <p className="text-slate-500">{t('common.noTeachersDesc', 'Teacher information is not available for this class yet.')}</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default KidProfilePage;
