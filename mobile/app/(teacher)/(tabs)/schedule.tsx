import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, BookOpen, Download } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import attendanceService, { TimetableSession } from '../../../api/attendance';
import { useAuth } from '../../../context/AuthContext';

const SchedulePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<{ sessions: TimetableSession[] }>({ sessions: [] });
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7);

    const weekDays = [
        { key: 'monday', name: t('calendar.monday'), short: t('calendar.short.monday') || 'Mon', value: 1 },
        { key: 'tuesday', name: t('calendar.tuesday'), short: t('calendar.short.tuesday') || 'Tue', value: 2 },
        { key: 'wednesday', name: t('calendar.wednesday'), short: t('calendar.short.wednesday') || 'Wed', value: 3 },
        { key: 'thursday', name: t('calendar.thursday'), short: t('calendar.short.thursday') || 'Thu', value: 4 },
        { key: 'friday', name: t('calendar.friday'), short: t('calendar.short.friday') || 'Fri', value: 5 },
        { key: 'saturday', name: t('calendar.saturday'), short: t('calendar.short.saturday') || 'Sat', value: 6 }
    ];

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await attendanceService.getTimetableSessions({ my_sessions: true });
            setSchedule({
                sessions: response.results || response || [],
            });
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSessionsForDay = (dayValue: number) => {
        return schedule.sessions
            .filter(s => s.day_of_week === dayValue)
            .sort((a, b) => a.session_order - b.session_order);
    };

    const generateAndSharePDF = async () => {
        try {
            if (schedule.sessions.length === 0) {
                Alert.alert(t('common.error'), t('timetables.noSessions'));
                return;
            }

            // Generate HTML content
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body { background-color: #ffffff !important; -webkit-print-color-adjust: exact !important; margin: 0; padding: 0; }
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; color: #000000 !important; }
            @media print {
              html, body { background-color: #ffffff !important; -webkit-print-color-adjust: exact !important; }
              table { background-color: #ffffff !important; }
              th, td { color: #000000 !important; border-color: #dddddd !important; }
              h1, h2 { color: #000000 !important; }
            }
            h1 { text-align: center; color: #333333; margin-bottom: 5px; font-size: 24px; }
            h2 { text-align: center; color: #666666; font-size: 16px; margin-top: 5px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #ffffff; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 10px; color: #000000; }
            th { background-color: #f8f9fa !important; font-weight: bold; color: #333333 !important; }
            .day-col { background-color: #f8f9fa !important; font-weight: bold; width: 60px; color: #333333 !important; }
            .session { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px; }
            .subject { font-weight: bold; color: #2563eb !important; font-size: 11px; margin-bottom: 2px; }
            .class { font-size: 10px; color: #4b5563 !important; }
            .room { font-size: 9px; color: #6b7280 !important; font-style: italic; margin-top: 2px; }
          </style>
        </head>
        <body>
          <h1>Madrasti 2.0 - ${t('timetables.mySchedule')}</h1>
          <h2>${user?.full_name || ''}</h2>
          
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>08:00 - 09:00</th>
                <th>09:00 - 10:00</th>
                <th>10:00 - 11:00</th>
                <th>11:20 - 12:20</th>
                <th>12:20 - 13:20</th>
                <th>14:30 - 15:30</th>
                <th>15:30 - 16:30</th>
                <th>16:30 - 17:30</th>
              </tr>
            </thead>
            <tbody>
              ${weekDays.map(day => {
                const daySessions = schedule.sessions.filter(s => s.day_of_week === day.value);

                // Helper to find session for a specific order (1-8)
                // Note: Gaps like 11:00-11:20 break are implied by period numbering
                // Standard periods: 1, 2, 3, 4, 5, 6, 7, 8

                const cells = [1, 2, 3, 4, 5, 6, 7, 8].map(period => {
                    const session = daySessions.find(s => s.session_order === period);
                    if (session) {
                        return `
                      <td>
                        <div class="session">
                          <div class="subject">${session.subject_name}</div>
                          <div class="class">${session.class_name || session.school_class_name || ''}</div>
                          ${session.room_name ? `<div class="room">${session.room_name}</div>` : ''}
                        </div>
                      </td>
                    `;
                    }
                    return '<td></td>';
                }).join('');

                return `
                  <tr>
                    <td class="day-col">${day.name}</td>
                    ${cells}
                  </tr>
                `;
            }).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

            if (Platform.OS === 'web') {
                await Print.printAsync({ html: htmlContent });
            } else {
                const { uri } = await Print.printToFileAsync({ html: htmlContent });
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert(t('common.error'), t('error.failedToExport'));
        }
    };


    const getSessionColor = (subjectName: string) => {
        const colors = [
            ['#DBEAFE', '#1E40AF'], // Blue
            ['#DCFCE7', '#166534'], // Green
            ['#F3E8FF', '#6B21A8'], // Purple
            ['#FFEDD5', '#9A3412'], // Orange
            ['#FCE7F3', '#9D174D'], // Pink
            ['#FEF9C3', '#854D0E'], // Yellow
            ['#E0E7FF', '#3730A3'], // Indigo
        ];
        const hash = subjectName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    const activeSessions = getSessionsForDay(selectedDay);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 pt-6 pb-4 bg-white dark:bg-slate-800 z-10 border-b border-gray-200 dark:border-slate-700">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('timetables.mySchedule')}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {weekDays.find(d => d.value === selectedDay)?.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={generateAndSharePDF}
                        className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center"
                    >
                        <Download size={20} className="text-blue-600 dark:text-blue-400" />
                    </TouchableOpacity>
                </View>

                {/* Day Selector */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                    contentContainerStyle={{ paddingRight: 20 }}
                >
                    {weekDays.map((day) => {
                        const isActive = selectedDay === day.value;
                        return (
                            <TouchableOpacity
                                key={day.key}
                                onPress={() => setSelectedDay(day.value)}
                                className={`mr-3 px-4 py-2 rounded-full border ${isActive
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                                    }`}
                            >
                                <Text className={`font-medium ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                                    }`}>
                                    {day.short}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-4 pt-4"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {activeSessions.length > 0 ? (
                        activeSessions.map((session, index) => {
                            const [bgColor, textColor] = getSessionColor(session.subject_name);

                            return (
                                <View key={index} className="flex-row mb-4">
                                    {/* Time Column */}
                                    <View className="w-16 items-center pt-2">
                                        <Text className="font-bold text-gray-900 dark:text-white">{session.start_time}</Text>
                                        <View className="w-[1px] h-full bg-gray-200 dark:bg-slate-700 my-1 absolute top-8 left-1/2" />
                                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-8">{session.end_time}</Text>
                                    </View>

                                    {/* Card */}
                                    <View className="flex-1 ml-3">
                                        <View
                                            className="rounded-2xl p-4 border-l-4 border bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"
                                            style={{
                                                borderLeftColor: textColor,
                                                // Removed: shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
                                            }}
                                        >
                                            <View className="flex-row justify-between items-start mb-2">
                                                <View
                                                    className="px-2 py-1 rounded-md"
                                                    style={{ backgroundColor: bgColor }}
                                                >
                                                    <Text
                                                        className="text-xs font-bold"
                                                        style={{ color: textColor }}
                                                    >
                                                        {session.subject_name}
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <Clock size={12} className="text-gray-400 mr-1" />
                                                    <Text className="text-xs text-gray-400">
                                                        {session.session_order === 4 && '11:20' ? 'P4' : `P${session.session_order}`}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="mb-3">
                                                <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                                    {session.class_name || session.school_class_name || session.timetable?.school_class_name || t('classes.class')}
                                                </Text>
                                            </View>

                                            <View className="flex-row items-center gap-4">
                                                {session.room_name && (
                                                    <View className="flex-row items-center">
                                                        <MapPin size={14} className="text-gray-500 dark:text-gray-400 mr-1" />
                                                        <Text className="text-sm text-gray-600 dark:text-gray-300">{session.room_name}</Text>
                                                    </View>
                                                )}
                                                <View className="flex-row items-center">
                                                    <BookOpen size={14} className="text-gray-500 dark:text-gray-400 mr-1" />
                                                    <Text className="text-sm text-gray-600 dark:text-gray-300">{t('common.lesson')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View className="items-center justify-center py-20 px-4">
                            <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-6">
                                <Calendar size={48} className="text-blue-400 dark:text-blue-300 opacity-50" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                                {t('timetables.noSessionsTitle') || 'No Classes Today'}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                                {t('timetables.noSessionsDescription') || 'Enjoy your free time! check other days for your upcoming schedule.'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default SchedulePage;
