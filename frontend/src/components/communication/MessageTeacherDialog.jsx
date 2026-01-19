import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Loader2, Send } from 'lucide-react';
import { communicationService } from '../../services/communication';
import { toast } from 'sonner';

const MessageTeacherDialog = ({ open, onOpenChange, teacher, studentId, teacherName, subject }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            // 1. Start or get existing conversation
            const conversation = await communicationService.startDirectConversation(
                teacher.id,
                studentId
            );

            // 2. Send the message
            await communicationService.sendMessage({
                conversation: conversation.id,
                content: message.trim()
            });

            toast.success(t('communication.messageSentSuccess', 'Message sent successfully!'));
            setMessage('');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error(t('communication.messageSentError', 'Failed to send message. Please try again.'));
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('communication.sendMessage', 'Send Message')}</DialogTitle>
                    <DialogDescription>
                        {t('communication.messageTeacherDescription', 'Compose a message to your child\'s teacher.')}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 my-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={teacher?.profile?.profile_picture} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                            {teacherName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{teacherName}</h4>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px] mt-1">
                            {subject}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-4">
                    <Textarea
                        placeholder={t('communication.typeMessage', 'Type your message here...')}
                        className="min-h-[150px] resize-none border-slate-200 focus:ring-indigo-500 rounded-xl"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={sending}
                    />
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={sending}
                        className="rounded-full"
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-6"
                    >
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Send className="h-4 w-4 mr-2" />
                        )}
                        {t('common.send', 'Send')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MessageTeacherDialog;
