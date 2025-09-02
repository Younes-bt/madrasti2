import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  MessageCircle,
  Mail,
  Phone,
  User,
  Clock,
  Send,
  Eye,
  Reply,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const CommunicationCenter = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('messages') // messages, announcements

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender_name: 'Mme. Fatima Alaoui',
      sender_role: 'teacher',
      sender_avatar: null,
      subject: 'Ahmed\'s Math Progress',
      message: 'Ahmed has shown excellent improvement in algebra. Keep encouraging his practice.',
      sent_at: '2024-09-01T14:30:00Z',
      read: false,
      priority: 'normal',
      child_name: 'Ahmed Hassan',
      reply_count: 2
    },
    {
      id: 2,
      sender_name: 'M. Hassan Benali',
      sender_role: 'principal',
      sender_avatar: null,
      subject: 'Parent-Teacher Meeting Reminder',
      message: 'This is a reminder about the upcoming parent-teacher conference scheduled for next week.',
      sent_at: '2024-08-31T10:15:00Z',
      read: true,
      priority: 'high',
      child_name: 'All Children',
      reply_count: 0
    },
    {
      id: 3,
      sender_name: 'Mme. Aicha Zahra',
      sender_role: 'teacher',
      sender_avatar: null,
      subject: 'Fatima\'s Science Project',
      message: 'Fatima\'s science project on renewable energy was outstanding. She deserves recognition.',
      sent_at: '2024-08-30T16:45:00Z',
      read: false,
      priority: 'normal',
      child_name: 'Fatima Hassan',
      reply_count: 1
    },
    {
      id: 4,
      sender_name: 'Administration',
      sender_role: 'admin',
      sender_avatar: null,
      subject: 'School Fee Payment Due',
      message: 'Monthly school fees are due by September 5th. Please ensure timely payment to avoid late fees.',
      sent_at: '2024-08-29T09:00:00Z',
      read: true,
      priority: 'high',
      child_name: 'All Children',
      reply_count: 0
    }
  ])

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Science Fair Registration Open',
      content: 'Registration for the annual science fair is now open. Students can submit their projects until September 15th.',
      posted_by: 'Administration',
      posted_at: '2024-09-01T08:00:00Z',
      priority: 'medium',
      category: 'academic',
      read: false
    },
    {
      id: 2,
      title: 'New Library Hours',
      content: 'The school library will now be open from 7:30 AM to 5:00 PM on weekdays and 9:00 AM to 2:00 PM on Saturdays.',
      posted_by: 'Library Staff',
      posted_at: '2024-08-30T12:30:00Z',
      priority: 'low',
      category: 'general',
      read: true
    },
    {
      id: 3,
      title: 'Sports Day Schedule',
      content: 'Annual sports day is scheduled for September 20th. Please ensure your children bring appropriate sports attire.',
      posted_by: 'Sports Department',
      posted_at: '2024-08-28T15:20:00Z',
      priority: 'medium',
      category: 'activities',
      read: false
    }
  ])

  const unreadMessagesCount = messages.filter(msg => !msg.read).length
  const unreadAnnouncementsCount = announcements.filter(ann => !ann.read).length

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'teacher': return '👩‍🏫'
      case 'principal': return '👔'
      case 'admin': return '🏛️'
      default: return '👤'
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow')
    if (diffInHours < 24) return `${diffInHours}h ${t('common.ago')}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ${t('common.ago')}`
  }

  const handleMarkAsRead = (id, type) => {
    if (type === 'message') {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        )
      )
    } else {
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: true } : ann
        )
      )
    }
  }

  const handleReplyToMessage = (messageId) => {
    console.log('Reply to message:', messageId)
  }

  const handleViewMessage = (messageId) => {
    console.log('View full message:', messageId)
    handleMarkAsRead(messageId, 'message')
  }

  const handleViewAnnouncement = (announcementId) => {
    console.log('View full announcement:', announcementId)
    handleMarkAsRead(announcementId, 'announcement')
  }

  const handleComposeMessage = () => {
    console.log('Open compose message dialog')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-500" />
          {t('parent.communicationCenter')}
        </CardTitle>
        <CardDescription>
          {t('parent.communicationDescription')}
        </CardDescription>
        
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'messages'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageCircle className="h-3 w-3" />
            {t('parent.messages')}
            {unreadMessagesCount > 0 && (
              <Badge className="bg-red-500 text-white ml-1 text-xs px-1 py-0 min-w-4 h-4">
                {unreadMessagesCount}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'announcements'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-3 w-3" />
            {t('parent.announcements')}
            {unreadAnnouncementsCount > 0 && (
              <Badge className="bg-red-500 text-white ml-1 text-xs px-1 py-0 min-w-4 h-4">
                {unreadAnnouncementsCount}
              </Badge>
            )}
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === 'messages' ? (
          // Messages Tab
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    !message.read 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' 
                      : 'bg-card hover:bg-accent/50'
                  }`}
                  onClick={() => handleViewMessage(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback className="text-xs">
                        {getRoleIcon(message.sender_role)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {message.sender_name}
                          </h4>
                          {message.priority === 'high' && (
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(message.sent_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="font-medium text-xs mb-1 truncate">
                        {message.subject}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {message.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {message.child_name}
                          </Badge>
                          <Badge className={getPriorityColor(message.priority)}>
                            {t(`parent.${message.priority}Priority`)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {message.reply_count > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {message.reply_count} {t('parent.replies')}
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReplyToMessage(message.id)
                            }}
                            className="h-6 px-2"
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('parent.noMessages')}</p>
              </div>
            )}
            
            {messages.length > 0 && (
              <div className="pt-3 border-t">
                <Button onClick={handleComposeMessage} className="w-full" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  {t('parent.composeMessage')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Announcements Tab
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    !announcement.read 
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' 
                      : 'bg-card hover:bg-accent/50'
                  }`}
                  onClick={() => handleViewAnnouncement(announcement.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      {!announcement.read && (
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      )}
                    </div>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {t(`parent.${announcement.priority}Priority`)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {announcement.posted_by}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {announcement.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(announcement.posted_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('parent.noAnnouncements')}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Summary */}
        <div className="flex justify-between items-center pt-3 mt-3 border-t text-xs text-muted-foreground">
          {activeTab === 'messages' ? (
            <>
              <span>{messages.length} {t('parent.totalMessages')}</span>
              <span>{unreadMessagesCount} {t('parent.unread')}</span>
            </>
          ) : (
            <>
              <span>{announcements.length} {t('parent.totalAnnouncements')}</span>
              <span>{unreadAnnouncementsCount} {t('parent.unread')}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommunicationCenter