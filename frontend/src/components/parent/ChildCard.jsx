import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CalendarCheck,
    LineChart,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

/**
 * ChildCard Component
 * Displays a summary of a student's status for the parent dashboard.
 */
const ChildCard = ({ child }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        full_name,
        profile_picture_url,
        grade,
        class_name,
        pending_homework_count,
        uncleared_absence_count,
        id
    } = child;

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 animate-in fade-in slide-in-from-bottom-5">
            {/* Header: Photo and Info */}
            <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-16 w-16 rounded-xl border-2 border-slate-100 group-hover:border-blue-100 transition-colors duration-300">
                    <AvatarImage src={profile_picture_url} className="object-cover" />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-medium text-lg">
                        {full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {full_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-slate-200 font-medium text-[10px] uppercase tracking-wider">
                            {grade || t('parentHome.noGrade', 'Grade info')}
                        </Badge>
                        <span className="text-sm text-slate-400 font-medium">
                            {class_name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/parent/student/${id}/homework`);
                    }}
                    className="h-auto py-3 px-3 flex flex-col items-center gap-2 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group/btn"
                >
                    <div className="relative">
                        <BookOpen className="h-5 w-5 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                        {pending_homework_count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                                {pending_homework_count}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium text-slate-500 group-hover/btn:text-blue-700">
                        {t('parentHome.homework', 'Homework')}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/parent/student/${id}/attendance`);
                    }}
                    className="h-auto py-3 px-3 flex flex-col items-center gap-2 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group/btn"
                >
                    <div className="relative">
                        <CalendarCheck className="h-5 w-5 text-slate-400 group-hover/btn:text-emerald-600 transition-colors" />
                        {uncleared_absence_count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                                {uncleared_absence_count}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium text-slate-500 group-hover/btn:text-emerald-700">
                        {t('parentHome.attendance', 'Attendance')}
                    </span>
                </Button>
            </div>

            {/* View Full Profile / Progress Link */}
            <Button
                variant="outline"
                onClick={() => navigate(`/parent/student/${id}/progress`)}
                className="w-full justify-between h-11 rounded-xl border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all group/main"
            >
                <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-slate-400 group-hover/main:text-blue-600" />
                    <span className="font-medium text-sm">{t('parentHome.viewDetailedProgress', 'View Progress')}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover/main:text-blue-600 group-hover/main:translate-x-0.5 transition-all" />
            </Button>
        </div>
    );
};

export default ChildCard;
