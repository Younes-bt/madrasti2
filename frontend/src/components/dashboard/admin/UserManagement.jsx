import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  Plus,
  Eye,
  ChevronRight
} from 'lucide-react'

const UserManagement = () => {
  const { t } = useLanguage()

  const [users, setUsers] = useState([
    {
      id: 1,
      first_name: 'Ahmed',
      last_name: 'Hassan',
      email: 'ahmed.hassan@student.ma',
      role: 'student',
      status: 'active',
      avatar: null,
      last_login: '2024-09-01T14:30:00Z',
    },
    {
      id: 2,
      first_name: 'Fatima',
      last_name: 'Alaoui',
      email: 'f.alaoui@teacher.ma',
      role: 'teacher',
      status: 'active',
      avatar: null,
      last_login: '2024-09-01T16:45:00Z',
    },
    {
      id: 3,
      first_name: 'Omar',
      last_name: 'Benali',
      email: 'omar.benali@parent.ma',
      role: 'parent',
      status: 'active',
      avatar: null,
      last_login: '2024-08-31T20:15:00Z',
    },
    {
      id: 4,
      first_name: 'Youssef',
      last_name: 'Tazi',
      email: 'y.tazi@student.ma',
      role: 'student',
      status: 'suspended',
      avatar: null,
      last_login: '2024-08-25T10:30:00Z',
    },
    {
      id: 5,
      first_name: 'Khadija',
      last_name: 'Benjelloun',
      email: 'k.benjelloun@admin.ma',
      role: 'admin',
      status: 'active',
      avatar: null,
      last_login: '2024-09-01T17:00:00Z',
    }
  ])

  // Show only the 5 most recent users
  const recentUsers = users.sort((a, b) => new Date(b.last_login) - new Date(a.last_login)).slice(0, 5);

  const getRoleIcon = (role) => {
    switch(role) {
      case 'student': return '🎓'
      case 'teacher': return '👩‍🏫'
      case 'parent': return '👨‍👩‍👧‍👦'
      case 'admin': return '⚙️'
      default: return '👤'
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'student': return 'text-blue-700 bg-blue-100'
      case 'teacher': return 'text-green-700 bg-green-100'
      case 'parent': return 'text-purple-700 bg-purple-100'
      case 'admin': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-700 bg-green-100'
      case 'inactive': return 'text-gray-700 bg-gray-100'
      case 'suspended': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const formatLastLogin = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow')
    if (diffInHours < 24) return `${diffInHours}h ${t('common.ago')}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ${t('common.ago')}`
  }

  const handleCreateUser = () => {
    console.log('Open create user dialog')
  }

  const handleViewAllUsers = () => {
    console.log('Navigate to all users page')
  }

  return (
    <Card>
      <CardHeader className="card-content">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              {t('admin.userManagement')}
            </CardTitle>
            <CardDescription>
              {t('admin.userManagementDescription')}
            </CardDescription>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.createUser')}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors gap-2"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {getRoleIcon(user.role)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {user.first_name} {user.last_name}
                    </span>
                    <Badge className={getRoleColor(user.role)}>
                      {t(`admin.${user.role}`)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-sm">{formatLastLogin(user.last_login)}</div>
                <div className="text-xs text-muted-foreground">{t('admin.lastLogin')}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllUsers}
          >
            {t('admin.viewAllUsers')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserManagement