import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search,
    Send,
    Plus,
    MessageSquare,
    User,
    ChevronLeft,
    Paperclip,
    MoreVertical,
    Check,
    CheckCheck,
    UserCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { communicationService } from '../../services/communication';
import usersService from '../../services/users';
import DashboardLayout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '../../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const ParentMessagesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showMessagesMobile, setShowMessagesMobile] = useState(false);

    // New Chat State
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [fetchingTeachers, setFetchingTeachers] = useState(false);

    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);

    const fetchChildren = useCallback(async () => {
        try {
            const data = await usersService.getUserChildren(user.id);
            setChildren(data.children || data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    }, [user.id]);

    const handleChildChange = async (childId) => {
        setSelectedChildId(childId);
        setSelectedTeacherId('');
        setTeachers([]);
        if (!childId) return;

        setFetchingTeachers(true);
        try {
            const data = await usersService.getTeachersForStudent(childId);
            setTeachers(data.teachers || data);
        } catch {
            toast.error(t('communication.noTeachersForChild'));
        } finally {
            setFetchingTeachers(false);
        }
    };

    const fetchConversations = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await communicationService.getConversations();
            const conversationsList = data.results || data;
            setConversations(conversationsList);
        } catch {
            toast.error(t('error.failedToLoadData'));
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [t]);

    const fetchMessages = useCallback(async (conversationId) => {
        try {
            const data = await communicationService.getMessages({ conversation: conversationId });
            setMessages(data.results || data); // Handle both paginated and non-paginated

            // Mark as read if there are unread messages
            const hasUnread = conversations?.find(c => c.id === conversationId)?.unread_count > 0;
            if (hasUnread) {
                await communicationService.markAsRead(conversationId);
                fetchConversations(false);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [conversations, fetchConversations]);

    useEffect(() => {
        fetchConversations();
        fetchChildren();

        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // Poll for new messages every 10 seconds
        pollingInterval.current = setInterval(() => {
            fetchConversations(false);
            if (selectedConversation) {
                fetchMessages(selectedConversation.id);
            }
        }, 10000);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [selectedConversation, fetchConversations, fetchChildren, fetchMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.id);
        if (isMobileView) {
            setShowMessagesMobile(true);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            await communicationService.sendMessage({
                conversation: selectedConversation.id,
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages(selectedConversation.id, false);
            fetchConversations(false);
        } catch {
            toast.error(t('error.failedToUpdate'));
        } finally {
            setSending(false);
        }
    };

    const handleStartNewChat = async () => {
        if (!selectedTeacherId) return;

        try {
            const conversation = await communicationService.startDirectConversation(
                selectedTeacherId,
                selectedChildId
            );
            setShowNewChatDialog(false);
            handleSelectConversation(conversation);
            setSelectedChildId('');
            setSelectedTeacherId('');
            setTeachers([]);
        } catch {
            toast.error(t('error.failedToCreate'));
        }
    };

    const getOtherParticipants = (conversation) => {
        return conversation.participants.filter(p => p.id !== user.id);
    };

    const getChatTitle = (conversation) => {
        const others = getOtherParticipants(conversation);
        if (others.length === 0) return 'Me';
        const name = others[0].full_name || `${others[0].first_name} ${others[0].last_name}`;

        if (conversation.related_student_details) {
            const childName = conversation.related_student_details.full_name ||
                `${conversation.related_student_details.first_name} ${conversation.related_student_details.last_name}`;
            return `${name} (${t('communication.messageAbout', { name: childName })})`;
        }
        return name;
    };

    const getInitials = (user) => {
        if (!user) return '?';
        const first = user.first_name?.[0] || '';
        const last = user.last_name?.[0] || '';
        return (first + last).toUpperCase() || user.username?.[0].toUpperCase();
    };

    return (
        <DashboardLayout
            title={t('communication.title')}
            subtitle={t('communication.subtitle')}
        >
            <div className="flex h-[calc(100vh-12rem)] min-h-[500px] overflow-hidden rounded-xl border bg-card shadow-sm">
                {/* Conversation List */}
                <div className={cn(
                    "w-full border-r md:w-80 lg:w-96 flex flex-col",
                    isMobileView && showMessagesMobile ? "hidden" : "flex"
                )}>
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{t('common.messages')}</h2>
                        <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="rounded-full">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{t('communication.newConversation')}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('communication.chooseChild')}</label>
                                        <Select value={selectedChildId} onValueChange={handleChildChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('communication.selectChild')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {children.map(child => (
                                                    <SelectItem key={child.id} value={child.id.toString()}>
                                                        {child.full_name || `${child.first_name} ${child.last_name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('communication.chooseTeacher')}</label>
                                        <Select
                                            value={selectedTeacherId}
                                            onValueChange={setSelectedTeacherId}
                                            disabled={!selectedChildId || fetchingTeachers}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={fetchingTeachers ? t('common.loading') : t('communication.selectUser')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teachers.length > 0 ? (
                                                    teachers.map(teacher => (
                                                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                            {teacher.full_name || `${teacher.first_name} ${teacher.last_name}`}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                                        {selectedChildId ? t('communication.noTeachersForChild') : t('communication.selectChildToMessage')}
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleStartNewChat}
                                        disabled={!selectedTeacherId}
                                        className="w-full"
                                    >
                                        {t('communication.startChat')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ScrollArea className="flex-1">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-sm">{t('common.noConversations')}</p>
                                <p className="text-xs">{t('common.noConversationsDesc')}</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {conversations.map(conv => (
                                    <button
                                        key={conv.id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={cn(
                                            "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                                            selectedConversation?.id === conv.id && "bg-muted"
                                        )}
                                    >
                                        <Avatar className="h-12 w-12 shrink-0 border">
                                            <AvatarImage src={getOtherParticipants(conv)[0]?.profile_picture} />
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {getInitials(getOtherParticipants(conv)[0])}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium truncate pr-2">
                                                    {getChatTitle(conv)}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {conv.last_message_at ? format(new Date(conv.last_message_at), 'p') : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate line-clamp-1">
                                                {conv.last_message_content || t('common.noMessages')}
                                            </p>
                                        </div>
                                        {conv.unread_count > 0 && (
                                            <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-[10px]">
                                                {conv.unread_count}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Messages View */}
                <div className={cn(
                    "flex-1 flex flex-col bg-muted/10",
                    isMobileView && !showMessagesMobile ? "hidden" : "flex"
                )}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b bg-card flex items-center gap-3">
                                {isMobileView && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowMessagesMobile(false)}
                                        className="mr-1"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                )}
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={getOtherParticipants(selectedConversation)[0]?.profile_picture} />
                                    <AvatarFallback className="bg-primary/5 text-primary">
                                        {getInitials(getOtherParticipants(selectedConversation)[0])}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{getChatTitle(selectedConversation)}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        {t('common.online')}
                                    </p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    {messages.map((msg) => {
                                        const isMe = msg.sender === user.id;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex flex-col",
                                                    isMe ? "items-end" : "items-start"
                                                )}
                                            >
                                                <div className={cn(
                                                    "max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                                    isMe
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-card border rounded-tl-none"
                                                )}>
                                                    {msg.content}
                                                    <div className={cn(
                                                        "flex items-center gap-1 mt-1 text-[10px]",
                                                        isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                                    )}>
                                                        {format(new Date(msg.created_at), 'p')}
                                                        {isMe && (
                                                            msg.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 bg-card border-t">
                                <form
                                    onSubmit={handleSendMessage}
                                    className="flex items-center gap-2 max-w-4xl mx-auto"
                                >
                                    <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                    <Input
                                        placeholder={t('common.typeMessage')}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="h-11 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!newMessage.trim() || sending}
                                        className="rounded-full h-11 w-11 shrink-0 shadow-lg"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                <MessageSquare className="h-10 w-10 opacity-20" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">{t('common.selectConversation')}</h2>
                            <p className="max-w-xs">{t('common.selectConversationDesc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentMessagesPage;
