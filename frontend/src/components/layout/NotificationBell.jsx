import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { communicationService } from '@/services/communication';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchNotifications = async () => {
        try {
            const data = await communicationService.getNotifications();
            // Handle pagination if present (DRF default pagination returns { count, next, previous, results })
            const results = data.results || (Array.isArray(data) ? data : []);
            setNotifications(results);

            const countData = await communicationService.getUnreadCount();
            setUnreadCount(countData.count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 5 seconds for near-instant updates
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await communicationService.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async (e) => {
        e.stopPropagation(); // Prevent closing dropdown
        try {
            await communicationService.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        console.log('Notification clicked:', notification);
        console.log('User role:', user?.role);

        if (!notification.is_read) {
            await handleMarkAsRead(notification.id);
        }
        setIsOpen(false);

        // Determine base path based on user role
        const roleBasePaths = {
            'ADMIN': '/admin',
            'TEACHER': '/teacher',
            'STUDENT': '/student',
            'PARENT': '/parent',
            'STAFF': '/admin',
            'DRIVER': '/admin'
        };

        const basePath = roleBasePaths[user?.role] || '/admin';
        console.log('Base path:', basePath);

        // Navigate based on type
        if (notification.notification_type === 'MESSAGE') {
            const conversationId = notification.related_object_id;
            const messagesPath = `${basePath}/communication/messages`;
            console.log('Navigating to messages:', messagesPath, 'with conversation ID:', conversationId);

            navigate(messagesPath, {
                state: { conversationId: conversationId }
            });
        } else if (notification.notification_type === 'ANNOUNCEMENT') {
            const announcementId = notification.related_object_id;
            const announcementsPath = `${basePath}/communication/announcements`;
            console.log('Navigating to announcements:', announcementsPath);

            navigate(announcementsPath, {
                state: { announcementId: announcementId }
            });
        } else if (notification.notification_type === 'HOMEWORK') {
            const homeworkId = notification.related_object_id;
            const homeworkPath = `${basePath}/homework`;
            console.log('Navigating to homework:', homeworkPath);

            navigate(homeworkPath, {
                state: { homeworkId: homeworkId }
            });
        } else if (notification.notification_type === 'SYSTEM' && notification.related_object_type === 'attendance_record') {
            const isAdmin = user?.role === 'ADMIN';
            const isStaff = user?.role === 'STAFF';

            if (isAdmin) {
                navigate('/admin/reports/attendance', { state: { activeTab: 'flags' } });
            } else if (isStaff) {
                navigate('/staff/reports/attendance', { state: { activeTab: 'flags' } });
            }
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs h-auto py-1">
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.is_read ? 'bg-muted/50' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex justify-between w-full mb-1">
                                    <span className="font-medium text-sm">{notification.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
