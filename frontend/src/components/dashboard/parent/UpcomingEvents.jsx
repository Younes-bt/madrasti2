import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Bell,
  Plus
} from 'lucide-react'

const UpcomingEvents = () => {
  const { t } = useLanguage()
  const [selectedFilter, setSelectedFilter] = useState('all') // all, exams, assignments, meetings, activities

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Mathematics Exam',
      type: 'exam',
      date: '2024-09-05T09:00:00Z',
      duration: 90,
      location: 'Salle 201',
      child_name: 'Ahmed Hassan',
      child_class: '1ère Année A',
      subject: 'Mathematics',
      description: 'Final exam covering chapters 1-5',
      reminder_set: true,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Physics Assignment Due',
      type: 'assignment',
      date: '2024-09-06T23:59:00Z',
      duration: null,
      location: null,
      child_name: 'Ahmed Hassan',
      child_class: '1ère Année A',
      subject: 'Physics',
      description: 'Lab report on electromagnetic waves',
      reminder_set: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Parent-Teacher Conference',
      type: 'meeting',
      date: '2024-09-08T15:30:00Z',
      duration: 30,
      location: 'Teacher\'s Office',
      child_name: 'Fatima Hassan',
      child_class: '3ème Année B',
      subject: 'General',
      description: 'Quarterly progress review',
      reminder_set: true,
      priority: 'high'
    },
    {
      id: 4,
      title: 'Science Fair',
      type: 'activity',
      date: '2024-09-10T10:00:00Z',
      duration: 240,
      location: 'Main Auditorium',
      child_name: 'All Children',
      child_class: 'All Classes',
      subject: 'Science',
      description: 'Annual science project exhibition',
      reminder_set: true,
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Chemistry Test',
      type: 'exam',
      date: '2024-09-12T14:00:00Z',
      duration: 60,
      location: 'Lab 3',
      child_name: 'Fatima Hassan',
      child_class: '3ème Année B',
      subject: 'Chemistry',
      description: 'Chapter 3: Organic compounds',
      reminder_set: false,
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Literature Essay Submission',
      type: 'assignment',
      date: '2024-09-15T23:59:00Z',
      duration: null,
      location: null,
      child_name: 'Fatima Hassan',
      child_class: '3ème Année B',
      subject: 'Literature',
      description: 'Analysis of modern Moroccan poetry',
      reminder_set: true,
      priority: 'low'
    }
  ])

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'all') return true
    return event.type === selectedFilter
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const getEventIcon = (type) => {
    switch(type) {
      case 'exam': return <BookOpen className="h-4 w-4 text-red-600" />
      case 'assignment': return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'meeting': return <Users className="h-4 w-4 text-green-600" />
      case 'activity': return <Calendar className="h-4 w-4 text-purple-600" />
      default: return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getEventColor = (type) => {
    switch(type) {
      case 'exam': return 'bg-red-50 border-red-200 text-red-800'
      case 'assignment': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'meeting': return 'bg-green-50 border-green-200 text-green-800'
      case 'activity': return 'bg-purple-50 border-purple-200 text-purple-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((date - now) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return t('common.soon')
      return `${diffInHours}h ${t('common.remaining')}`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return t('common.tomorrow')
    return `${diffInDays} ${t('common.days')}`
  }

  const isEventSoon = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((date - now) / (1000 * 60 * 60))
    return diffInHours <= 24
  }

  const handleSetReminder = (eventId) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, reminder_set: !event.reminder_set }
          : event
      )
    )
  }

  const handleAddToCalendar = (event) => {
    console.log('Add to calendar:', event.title)
  }

  const handleViewEventDetails = (event) => {
    console.log('View event details:', event.title)
  }

  const upcomingSoonCount = events.filter(event => isEventSoon(event.date)).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          {t('parent.upcomingEvents')}
          {upcomingSoonCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {upcomingSoonCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {t('parent.eventsDescription')}
        </CardDescription>
        
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {[
            { key: 'all', label: t('common.all') },
            { key: 'exams', label: t('homework.exams') },
            { key: 'assignments', label: t('homework.assignments') },
            { key: 'meetings', label: t('parent.meetings') },
            { key: 'activities', label: t('parent.activities') }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key === 'exams' ? 'exam' : filter.key === 'assignments' ? 'assignment' : filter.key === 'meetings' ? 'meeting' : filter.key === 'activities' ? 'activity' : 'all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === (filter.key === 'exams' ? 'exam' : filter.key === 'assignments' ? 'assignment' : filter.key === 'meetings' ? 'meeting' : filter.key === 'activities' ? 'activity' : 'all')
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-colors ${getEventColor(event.type)} ${
                  isEventSoon(event.date) ? 'ring-2 ring-red-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        <Badge className={getPriorityColor(event.priority)} variant="secondary">
                          {t(`parent.${event.priority}Priority`)}
                        </Badge>
                        {isEventSoon(event.date) && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(event.date).toLocaleString()} 
                            {event.duration && ` (${event.duration}min)`}
                          </span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{event.child_name} • {event.child_class}</span>
                        </div>
                        
                        {event.description && (
                          <p className="text-xs mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleSetReminder(event.id)}
                      className={`p-1 rounded ${
                        event.reminder_set 
                          ? 'text-blue-600 bg-blue-100' 
                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={event.reminder_set ? t('parent.reminderSet') : t('parent.setReminder')}
                    >
                      <Bell className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleAddToCalendar(event)}
                      className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50"
                      title={t('parent.addToCalendar')}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                {/* Time until event */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
                  <div className="text-xs font-medium">
                    {formatEventDate(event.date)}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewEventDetails(event)}
                    className="h-6 px-2 text-xs"
                  >
                    {t('common.details')}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {selectedFilter === 'all' 
                  ? t('parent.noUpcomingEvents')
                  : t('parent.noEventsInCategory')
                }
              </p>
            </div>
          )}
        </div>
        
        {filteredEvents.length > 0 && (
          <div className="flex justify-between items-center pt-3 mt-3 border-t text-xs text-muted-foreground">
            <span>
              {filteredEvents.length} {t('parent.events')}
            </span>
            <span>
              {upcomingSoonCount} {t('parent.urgentEvents')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingEvents