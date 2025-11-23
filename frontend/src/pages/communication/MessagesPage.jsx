
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquare, Send, Users, Plus, Check, CheckCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import communicationService from '@/services/communication';
import usersService from '@/services/users';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import TeacherPageLayout from '@/components/teacher/layout/TeacherPageLayout';
import { USER_ROLES } from '@/utils/constants';

const MessagesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    // New Chat State
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Use ref to track if we've already processed the notification conversationId
    const processedConversationId = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
            markAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (selectedRole) {
            fetchUsersByRole(selectedRole);
        } else {
            setUserList([]);
        }
    }, [selectedRole]);

    // Auto-start conversation if navigated with startChatWith parameter
    useEffect(() => {
        const startChatWith = location.state?.startChatWith;
        if (startChatWith && user) {
            handleStartConversationWithUser(startChatWith);
        }
    }, [location.state?.startChatWith, user]);

    // Auto-select conversation if navigated from notification
    useEffect(() => {
        const conversationId = location.state?.conversationId;

        // Only process if we have a conversationId, conversations are loaded, 
        // and we haven't already processed this conversationId
        if (conversationId && conversations.length > 0 && processedConversationId.current !== conversationId) {
            const conversation = conversations.find(c => c.id === Number(conversationId));
            if (conversation) {
                processedConversationId.current = conversationId; // Mark as processed
                setSelectedConversation(conversation);
            }
        }
    }, [location.state?.conversationId, conversations]);


    const fetchConversations = async () => {
        setLoading(true);
        try {
            const data = await communicationService.getConversations();
            const conversationsList = data.results || data;
            setConversations(conversationsList);
            if (conversationsList.length > 0 && !selectedConversation) {
                setSelectedConversation(conversationsList[0]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error(t('Failed to load conversations'));
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const data = await communicationService.getMessages({ conversation: conversationId });
            setMessages(data.results || data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            await communicationService.markAsRead(conversationId);
            // Update the unread count in the conversations list without re-fetching
            setConversations(prev => prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, unread_count: 0 }
                    : conv
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
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
            fetchMessages(selectedConversation.id);
            fetchConversations(); // Update last message
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(t('Failed to send message'));
        } finally {
            setSending(false);
        }
    };

    const fetchUsersByRole = async (role) => {
        setLoadingUsers(true);
        try {
            const response = await usersService.getUsersByRole(role);
            let users = [];
            if (Array.isArray(response)) {
                users = response;
            } else if (response.results && Array.isArray(response.results)) {
                users = response.results;
            } else if (response.data && Array.isArray(response.data)) {
                users = response.data;
            }
            setUserList(users.filter(u => String(u.id) !== String(user?.id)));
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(t('Failed to load users'));
            setUserList([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleStartConversation = async () => {
        if (!selectedUser) return;

        try {
            const conversation = await communicationService.startDirectConversation(selectedUser);
            setIsNewChatOpen(false);
            setSelectedRole('');
            setSelectedUser('');

            // Check if conversation already exists in list
            const existing = conversations.find(c => c.id === conversation.id);
            if (!existing) {
                setConversations([conversation, ...conversations]);
            }

            setSelectedConversation(conversation);
            fetchMessages(conversation.id);
        } catch (error) {
            console.error('Error starting conversation:', error);
            toast.error(t('Failed to start conversation'));
        }
    };

    const handleStartConversationWithUser = async (userId) => {
        try {
            const conversation = await communicationService.startDirectConversation(userId);

            // Update conversations list if needed
            const existing = conversations.find(c => c.id === conversation.id);
            if (!existing) {
                setConversations([conversation, ...conversations]);
            }

            // Select this conversation
            setSelectedConversation(conversation);
            fetchMessages(conversation.id);
        } catch (error) {
            console.error('Error starting conversation with user:', error);
            toast.error(t('Failed to start conversation'));
        }
    };

    const getOtherParticipants = (conversation) => {
        if (!user) return [];
        return conversation.participants.filter(p => String(p.id) !== String(user.id));
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    };

    // Determine Layout based on user role
    const Layout = user?.role === USER_ROLES.TEACHER ? TeacherPageLayout : AdminPageLayout;

    return (
        <Layout
            title={t('Messages')}
            subtitle={t('Communicate with teachers, parents, and staff')}
            actions={[
                <Button key="new-message-btn" onClick={() => setIsNewChatOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('New Message')}
                </Button>
            ]}
            loading={loading}
            breadcrumbItems={user?.role === USER_ROLES.TEACHER ? [
                { label: t('teacherSidebar.dashboard'), href: '/teacher', icon: 'Home' },
                { label: t('teacherSidebar.communication.title'), href: null },
                { label: t('teacherSidebar.communication.messages'), href: null }
            ] : undefined}
        >
            <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 h-full">
                    {/* Conversations List - Hidden on mobile when conversation is selected */}
                    <Card className={`${selectedConversation && 'hidden lg:block'} lg:col-span-4 xl:col-span-3 h-full flex flex-col`}>
                        <CardHeader className="border-b bg-muted/30 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    {t('Conversations')}
                                </CardTitle>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setIsNewChatOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                        <p className="text-sm text-muted-foreground">{t('No conversations yet')}</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => setIsNewChatOpen(true)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t('Start a conversation')}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {conversations.map((conv) => {
                                            const others = getOtherParticipants(conv);
                                            const isSelected = selectedConversation?.id === conv.id;
                                            const otherUser = others[0];

                                            return (
                                                <div
                                                    key={conv.id}
                                                    onClick={() => setSelectedConversation(conv)}
                                                    className={`
                                                        relative p-4 cursor-pointer transition-all duration-200
                                                        hover:bg-accent/50 active:bg-accent/70
                                                        ${isSelected ? 'bg-accent border-l-4 border-l-primary' : ''}
                                                    `}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative flex-shrink-0">
                                                            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                                                <AvatarImage src={otherUser?.profile_picture_url} />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                                    {getInitials(otherUser?.full_name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {otherUser?.is_online && (
                                                                <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background shadow-sm" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className={`font-semibold truncate ${isSelected ? 'text-primary' : ''}`}>
                                                                    {others.length > 0 ? others.map(p => p.full_name).join(', ') : 'Unknown User'}
                                                                </p>
                                                                {conv.last_message && (
                                                                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                                                        {new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {conv.last_message && (
                                                                <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                                                    {conv.last_message.content}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {conv.unread_count > 0 && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="ml-2 h-5 min-w-[20px] flex items-center justify-center px-1.5 text-xs font-semibold shadow-sm"
                                                            >
                                                                {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Messages Area */}
                    <Card className={`${!selectedConversation && 'hidden lg:flex'} lg:col-span-8 xl:col-span-9 h-full flex flex-col`}>
                        {selectedConversation ? (
                            <>
                                <CardHeader className="border-b bg-muted/30 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="lg:hidden h-8 w-8 p-0"
                                            onClick={() => setSelectedConversation(null)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </Button>
                                        <div className="relative flex-shrink-0">
                                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                <AvatarImage src={getOtherParticipants(selectedConversation)[0]?.profile_picture_url} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {getInitials(getOtherParticipants(selectedConversation)[0]?.full_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {getOtherParticipants(selectedConversation)[0]?.is_online && (
                                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-semibold truncate">
                                                {getOtherParticipants(selectedConversation).map(p => p.full_name).join(', ')}
                                            </CardTitle>
                                            {getOtherParticipants(selectedConversation)[0]?.is_online ? (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs text-green-600 font-medium">Online</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="block h-2 w-2 rounded-full bg-gray-400" />
                                                    <span className="text-xs text-muted-foreground">Offline</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                                    {/* Messages */}
                                    <ScrollArea className="flex-1 px-4 py-6">
                                        {messages.length === 0 ? (
                                            <div className="h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                                                    <p className="text-muted-foreground text-sm">
                                                        {t('No messages yet. Start the conversation!')}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {messages.map((msg, index) => {
                                                    const isOwn = String(msg.sender) === String(user?.id);
                                                    const showAvatar = !isOwn && (index === 0 || messages[index - 1].sender !== msg.sender);

                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                                        >
                                                            {!isOwn && (
                                                                <div className="flex-shrink-0 mb-1">
                                                                    {showAvatar ? (
                                                                        <Avatar className="h-7 w-7 border border-background">
                                                                            <AvatarImage src={getOtherParticipants(selectedConversation)[0]?.profile_picture_url} />
                                                                            <AvatarFallback className="text-xs bg-primary/10">
                                                                                {getInitials(msg.sender_name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    ) : (
                                                                        <div className="h-7 w-7" />
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className={`max-w-[75%] md:max-w-[60%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                                                                <div
                                                                    className={`
                                                                        rounded-2xl px-4 py-2.5 shadow-sm
                                                                        ${isOwn
                                                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                                                            : 'bg-muted text-foreground rounded-bl-md'
                                                                        }
                                                                    `}
                                                                >
                                                                    {!isOwn && showAvatar && (
                                                                        <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>
                                                                    )}
                                                                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                                                </div>
                                                                <div className={`flex items-center gap-1 px-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                    {isOwn && (
                                                                        <span className="flex items-center">
                                                                            {msg.is_read ? (
                                                                                <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                                                                            ) : (
                                                                                <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </ScrollArea>

                                    {/* Message Input */}
                                    <div className="border-t bg-background p-4">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder={t('Type your message...')}
                                                disabled={sending}
                                                className="flex-1 rounded-full border-2 focus-visible:ring-primary px-4"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={sending || !newMessage.trim()}
                                                size="icon"
                                                className="rounded-full h-10 w-10 shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                {sending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-muted/20">
                                <div className="text-center p-8">
                                    <div className="bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{t('Select a conversation')}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t('Choose a conversation from the list or start a new one')}
                                    </p>
                                    <Button
                                        variant="default"
                                        onClick={() => setIsNewChatOpen(true)}
                                        className="shadow-md"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('Start New Conversation')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div >

            {/* New Chat Dialog */}
            < Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Start New Conversation')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('Role')}</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('Select role')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEACHER">{t('Teacher')}</SelectItem>
                                    <SelectItem value="PARENT">{t('Parent')}</SelectItem>
                                    <SelectItem value="STUDENT">{t('Student')}</SelectItem>
                                    <SelectItem value="STAFF">{t('Staff')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedRole && (
                            <div className="space-y-2">
                                <Label>{t('User')}</Label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingUsers ? t('Loading...') : t('Select user')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userList.length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground text-center">
                                                {t('No users found')}
                                            </div>
                                        ) : (
                                            userList.map(u => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.full_name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewChatOpen(false)}>
                            {t('Cancel')}
                        </Button>
                        <Button onClick={handleStartConversation} disabled={!selectedUser}>
                            {t('Start Chat')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </Layout >
    );
};

export default MessagesPage;
