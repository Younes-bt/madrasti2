import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Megaphone, Plus, Calendar, Users } from 'lucide-react';
import communicationService from '@/services/communication';
import schoolsService from '@/services/schools';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';

const AnnouncementsPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [grades, setGrades] = useState([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        content: '',
        target_role: 'ALL',
        target_grade: '',
        is_published: true
    });

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [announcementsData, gradesData] = await Promise.all([
                communicationService.getAnnouncements(),
                schoolsService.getGrades()
            ]);
            setAnnouncements(announcementsData.results || announcementsData);
            setGrades(gradesData.results || gradesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(t('Failed to load announcements'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await communicationService.createAnnouncement(announcementForm);
            toast.success(t('Announcement created successfully'));
            setIsCreateDialogOpen(false);
            setAnnouncementForm({
                title: '',
                content: '',
                target_role: 'ALL',
                target_grade: '',
                is_published: true
            });
            fetchData();
        } catch (error) {
            console.error('Error creating announcement:', error);
            toast.error(t('Failed to create announcement'));
        } finally {
            setLoading(false);
        }
    };

    const getTargetBadge = (targetRole, targetGrade) => {
        const roleColors = {
            ALL: 'bg-blue-500',
            PARENTS: 'bg-purple-500',
            TEACHERS: 'bg-green-500',
            STUDENTS: 'bg-yellow-500'
        };

        return (
            <div className="flex gap-1 items-center flex-wrap">
                <Badge className={roleColors[targetRole] || 'bg-gray-500'}>
                    {targetRole}
                </Badge>
                {targetGrade && (
                    <Badge variant="outline">
                        {grades.find(g => g.id === targetGrade)?.name || `Grade ${targetGrade}`}
                    </Badge>
                )}
            </div>
        );
    };

    return (
        <AdminPageLayout
            title={t('Announcements')}
            subtitle={t('Important news and updates from the school')}
            actions={[
                isAdmin && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('New Announcement')}
                    </Button>
                )
            ]}
            loading={loading && announcements.length === 0}
        >
            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>{t('No announcements yet')}</p>
                        </CardContent>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card key={announcement.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Megaphone className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                        </div>
                                        <CardDescription className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </span>
                                            {announcement.created_by_name && (
                                                <span>by {announcement.created_by_name}</span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getTargetBadge(announcement.target_role, announcement.target_grade)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create Announcement Dialog */}
            {isAdmin && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t('Create New Announcement')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Title')}</Label>
                                <Input
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    placeholder={t('Announcement title')}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('Content')}</Label>
                                <Textarea
                                    value={announcementForm.content}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                                    placeholder={t('Announcement content...')}
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('Target Audience')}</Label>
                                    <Select
                                        value={announcementForm.target_role}
                                        onValueChange={(val) => setAnnouncementForm({ ...announcementForm, target_role: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">{t('All Users')}</SelectItem>
                                            <SelectItem value="PARENTS">{t('Parents Only')}</SelectItem>
                                            <SelectItem value="TEACHERS">{t('Teachers Only')}</SelectItem>
                                            <SelectItem value="STUDENTS">{t('Students Only')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('Specific Grade')} ({t('Optional')})</Label>
                                    <Select
                                        value={announcementForm.target_grade || "ALL"}
                                        onValueChange={(val) => setAnnouncementForm({ ...announcementForm, target_grade: val === "ALL" ? "" : val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('All Grades')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">{t('All Grades')}</SelectItem>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade.id} value={String(grade.id)}>
                                                    {grade.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    {t('Cancel')}
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {t('Publish')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AdminPageLayout>
    );
};

export default AnnouncementsPage;
