
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquare, Send, Users, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import communicationService from '@/services/communication';
import usersService from '@/services/users';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';

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
    }, [location.state, user]);

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
            // Refresh conversations to update unread count
            fetchConversations();
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

    return (
        <AdminPageLayout
            title={t('Messages')}
            subtitle={t('Communicate with teachers, parents, and staff')}
            actions={[
                <Button key="new-message-btn" onClick={() => setIsNewChatOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('New Message')}
                </Button>
            ]}
            loading={loading}
        >
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <Card className="col-span-12 md:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            {t('Conversations')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-300px)]">
                            {conversations.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    {t('No conversations yet')}
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const others = getOtherParticipants(conv);
                                    const isSelected = selectedConversation?.id === conv.id;

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`p-4 cursor-pointer border-b hover:bg-accent transition-colors ${isSelected ? 'bg-accent' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Avatar>
                                                    <AvatarImage src={others[0]?.profile_picture_url} />
                                                    <AvatarFallback>{getInitials(others[0]?.full_name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium truncate">
                                                            {others.map(p => p.full_name).join(', ')}
                                                        </p>
                                                        {conv.unread_count > 0 && (
                                                            <Badge variant="destructive" className="ml-2">
                                                                {conv.unread_count}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {conv.last_message && (
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {conv.last_message.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Messages Area */}
                <Card className="col-span-12 md:col-span-8">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5" />
                                    <CardTitle>
                                        {getOtherParticipants(selectedConversation).map(p => p.full_name).join(', ')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col h-[calc(100vh-350px)]">
                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8">
                                            {t('No messages yet. Start the conversation!')}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg) => {
                                                const isOwn = String(msg.sender) === String(user?.id);
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted'
                                                                }`}
                                                        >
                                                            {!isOwn && (
                                                                <p className="text-xs font-semibold mb-1">{msg.sender_name}</p>
                                                            )}
                                                            <p className="text-sm">{msg.content}</p>
                                                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                                {new Date(msg.created_at).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Message Input */}
                                <div className="border-t p-4">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={t('Type your message...')}
                                            disabled={sending}
                                            className="flex-1"
                                        />
                                        <Button type="submit" disabled={sending || !newMessage.trim()}>
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
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>{t('Select a conversation to start messaging')}</p>
                                <Button variant="outline" className="mt-4" onClick={() => setIsNewChatOpen(true)}>
                                    {t('Start New Conversation')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* New Chat Dialog */}
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
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
            </Dialog>
        </AdminPageLayout>
    );
};

export default MessagesPage;
