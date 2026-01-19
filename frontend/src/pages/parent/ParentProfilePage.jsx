import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import usersService from '../../services/users';
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
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Shield,
    Globe,
    Linkedin,
    Twitter,
    Heart,
    Contact,
    Loader2,
    Edit3,
    Briefcase,
    Users,
    ChevronRight,
    Clock,
    UserCircle,
    FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ar, fr, enUS } from 'date-fns/locale';

const ParentProfilePage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [profileData, setProfileData] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Profile Data (includes personal/contact info)
                const profileResponse = await usersService.getProfile();
                setProfileData(profileResponse);

                // 2. Fetch Children Data
                if (user?.id) {
                    const childrenResponse = await usersService.getUserChildren(user.id);
                    setChildren(childrenResponse.children || []);
                }
            } catch (err) {
                console.error("Failed to fetch parent profile data:", err);
                setError(t('errors.failedToLoadProfile', 'Failed to load profile information.'));
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user?.id, t]);

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

    // Components
    const InfoItem = ({ icon: Icon, label, value, isLink = false }) => {
        if (!Icon) return null;
        return (
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex-shrink-0">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                    {isLink && value ? (
                        <a
                            href={value.startsWith('http') ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-indigo-600 hover:underline break-all flex items-center gap-1"
                        >
                            {value}
                            <ChevronRight className="h-3 w-3" />
                        </a>
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 break-words">{value || '-'}</p>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-[600px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
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
                    <Card className="border-red-200 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <Shield className="h-5 w-5" />
                                {t('common.error', 'Error')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700">{error}</p>
                            <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.reload()}>
                                {t('common.retry', 'Try Again')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    const profile = profileData?.profile || {};
    const fullName = `${profileData?.first_name} ${profileData?.last_name}`;
    const arFullName = profile.ar_first_name && profile.ar_last_name ?
        `${profile.ar_first_name} ${profile.ar_last_name}` : null;

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                {/* Header with Title and Quick Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {t('parentMenu.profile', 'My Profile')}
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            {t('parent.profileSubtitle', 'Manage your personal information and account settings')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="shadow-sm border-slate-200">
                            <Clock className="mr-2 h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-600">
                                {t('common.memberSince', 'Member since')}: {formatDate(profileData?.created_at)}
                            </span>
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                            onClick={() => navigate('/parent/profile/edit')}
                        >
                            <Edit3 className="mr-2 h-4 w-4" />
                            {t('common.editProfile', 'Edit Profile')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Identity Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl">
                            <div className="h-40 bg-slate-50 border-b border-slate-100 relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.05),_transparent_50%)]"></div>
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                            </div>
                            <CardContent className="pt-0 relative px-6 pb-8">
                                <div className="flex flex-col items-center -mt-20 text-center">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-4 ring-indigo-50">
                                        <AvatarImage src={profileData?.profile_picture_url || profile.profile_picture} alt={fullName} />
                                        <AvatarFallback className="text-4xl bg-indigo-50 text-indigo-700 font-bold">
                                            {profileData?.first_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h2 className="mt-6 text-2xl font-bold text-slate-900 tracking-tight">
                                        {fullName}
                                    </h2>
                                    {arFullName && (
                                        <p className="text-lg font-medium text-slate-600 mt-1" dir="rtl">
                                            {arFullName}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-4">
                                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                                            {t('roles.parent', 'Parent')}
                                        </Badge>
                                        <Badge variant={profileData?.is_active ? "success" : "secondary"} className={profileData?.is_active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                                            {profileData?.is_active ? t('status.active', 'Active Account') : t('status.inactive', 'Inactive Account')}
                                        </Badge>
                                    </div>

                                    <div className="w-full mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('parent.children', 'Children')}</p>
                                            <p className="text-xl font-bold text-indigo-600 mt-1">{children.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                    <UserCircle className="h-5 w-5 text-indigo-500" />
                                    {t('common.accountOverview', 'Account Overview')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm font-medium text-slate-500">{t('common.emailStatus', 'Email Status')}</span>
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Verified</Badge>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm font-medium text-slate-500">{t('common.lastLogin', 'Last Activity')}</span>
                                    <span className="text-sm font-semibold text-slate-700">{profileData?.last_seen ? formatDate(profileData.last_seen) : '-'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-slate-500">{t('common.accountType', 'Account Type')}</span>
                                    <span className="text-sm font-semibold text-slate-700">{t('common.standard', 'Standard')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="w-full justify-start bg-slate-100/50 p-1 rounded-2xl mb-8 border border-slate-200/50">
                                <TabsTrigger
                                    value="personal"
                                    className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all text-slate-600 font-semibold"
                                >
                                    {t('tabs.personalInfo', 'Personal Info')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="contact"
                                    className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all text-slate-600 font-semibold"
                                >
                                    {t('tabs.contactDetails', 'Contact Details')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="children"
                                    className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all text-slate-600 font-semibold"
                                >
                                    {t('tabs.linkedChildren', 'Children')}
                                </TabsTrigger>
                            </TabsList>

                            {/* Personal Info Tab */}
                            <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Card className="border-slate-200 shadow-sm rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-indigo-500" />
                                            {t('section.identity', 'Identity Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4 p-6">
                                        <InfoItem icon={User} label={t('fields.firstName', 'First Name')} value={profileData?.first_name} />
                                        <InfoItem icon={User} label={t('fields.lastName', 'Last Name')} value={profileData?.last_name} />
                                        <InfoItem icon={Globe} label={t('fields.arabicFirstName', 'First Name (Arabic)')} value={profile.ar_first_name} />
                                        <InfoItem icon={Globe} label={t('fields.arabicLastName', 'Last Name (Arabic)')} value={profile.ar_last_name} />
                                        <InfoItem icon={Calendar} label={t('fields.dateOfBirth', 'Date of Birth')} value={formatDate(profile.date_of_birth)} />
                                    </CardContent>
                                    <div className="px-6 pb-8">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                {t('fields.bio', 'About / Professional Bio')}
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed italic">
                                                {profile.bio || t('common.noBioProvided', 'No biography provided yet.')}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Contact Info Tab */}
                            <TabsContent value="contact" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Card className="border-slate-200 shadow-sm rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-emerald-500" />
                                            {t('section.communication', 'Communication & Social')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4 p-6">
                                        <InfoItem icon={Phone} label={t('fields.phone', 'Phone Number')} value={profile.phone || profileData?.phone} />
                                        <InfoItem icon={Mail} label={t('fields.email', 'Email Address')} value={profileData?.email} />
                                        <div className="md:col-span-2">
                                            <InfoItem icon={MapPin} label={t('fields.address', 'Residential Address')} value={profile.address} />
                                        </div>
                                        <InfoItem icon={Linkedin} label="LinkedIn Profile" value={profile.linkedin_url} isLink />
                                        <InfoItem icon={Twitter} label="Twitter / X" value={profile.twitter_url} isLink />
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm rounded-2xl border-l-4 border-l-rose-500">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <Heart className="h-5 w-5 text-rose-500" />
                                            {t('section.emergency', 'Emergency Contact')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4 p-6">
                                        <InfoItem icon={Contact} label={t('fields.emergencyName', 'Contact Name')} value={profile.emergency_contact_name} />
                                        <InfoItem icon={Phone} label={t('fields.emergencyPhone', 'Contact Phone')} value={profile.emergency_contact_phone} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Children Tab */}
                            <TabsContent value="children" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {children.length > 0 ? (
                                        children.map((child) => (
                                            <Card key={child.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 rounded-2xl relative">
                                                <div className="h-2 bg-indigo-500 w-full absolute top-0 left-0"></div>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-5">
                                                        <Avatar className="h-20 w-20 border-2 border-indigo-50 group-hover:scale-105 transition-transform">
                                                            <AvatarImage src={child.profile_picture_url || child.profile?.profile_picture} />
                                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
                                                                {child.first_name[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-xl text-slate-900 truncate">
                                                                {child.full_name || `${child.first_name} ${child.last_name}`}
                                                            </h4>
                                                            <div className="flex flex-col gap-1.5 mt-2">
                                                                <Badge variant="outline" className="w-fit bg-indigo-50 text-indigo-700 border-indigo-100 text-xs py-0.5 px-2">
                                                                    {child.grade || t('common.student', 'Student')}
                                                                </Badge>
                                                                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                                                    <Users className="h-3.5 w-3.5" />
                                                                    <span className="font-medium">{child.class_name || t('common.noClass', 'No active class')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                        <div className="flex -space-x-2">
                                                            {/* Placeholder for small student status icons if needed */}
                                                            <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                                                {t('status.active', 'A')}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold gap-1 p-0 px-2"
                                                            onClick={() => navigate('/parent/kids')}
                                                        >
                                                            {t('actions.viewProfile', 'View Detail')}
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
                                            <div className="p-5 bg-white rounded-2xl shadow-sm mb-4">
                                                <Users className="h-12 w-12 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{t('parent.noKidsTitle', 'No linked children')}</h3>
                                            <p className="text-slate-500 mt-2 max-w-sm">
                                                {t('parent.noKidsMessage', 'We couldn\'t find any students linked to your account. Please contact the school to link your children.')}
                                            </p>
                                            <Button variant="outline" className="mt-8 border-slate-300 font-bold" onClick={() => navigate('/parent/communications/new')}>
                                                {t('actions.contactSupport', 'Contact Support')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentProfilePage;

