import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Input } from '../../ui/input'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Mail
} from 'lucide-react'

const UserManagement = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all') // all, student, teacher, parent, admin
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive, suspended

  const [users, setUsers] = useState([
    {
      id: 1,
      first_name: 'Ahmed',
      last_name: 'Hassan',
      email: 'ahmed.hassan@student.ma',
      role: 'student',
      status: 'active',
      avatar: null,
      class: '1ère Année A',
      last_login: '2024-09-01T14:30:00Z',
      created_at: '2024-08-15T10:00:00Z',
      phone: '+212 6 12 34 56 78'
    },
    {
      id: 2,
      first_name: 'Fatima',
      last_name: 'Alaoui',
      email: 'f.alaoui@teacher.ma',
      role: 'teacher',
      status: 'active',
      avatar: null,
      subjects: ['Mathematics', 'Physics'],
      last_login: '2024-09-01T16:45:00Z',
      created_at: '2024-07-01T09:00:00Z',
      phone: '+212 6 98 76 54 32'
    },
    {
      id: 3,
      first_name: 'Omar',
      last_name: 'Benali',
      email: 'omar.benali@parent.ma',
      role: 'parent',
      status: 'active',
      avatar: null,
      children: ['Ahmed Hassan', 'Fatima Hassan'],
      last_login: '2024-08-31T20:15:00Z',
      created_at: '2024-08-15T11:00:00Z',
      phone: '+212 6 55 44 33 22'
    },
    {
      id: 4,
      first_name: 'Youssef',
      last_name: 'Tazi',
      email: 'y.tazi@student.ma',
      role: 'student',
      status: 'suspended',
      avatar: null,
      class: '2ème Année B',
      last_login: '2024-08-25T10:30:00Z',
      created_at: '2024-08-01T14:00:00Z',
      phone: '+212 6 11 22 33 44'
    },
    {
      id: 5,
      first_name: 'Khadija',
      last_name: 'Benjelloun',
      email: 'k.benjelloun@admin.ma',
      role: 'admin',
      status: 'active',
      avatar: null,
      permissions: ['users', 'system', 'reports'],
      last_login: '2024-09-01T17:00:00Z',
      created_at: '2024-06-01T08:00:00Z',
      phone: '+212 6 77 88 99 00'
    }
  ])

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

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

  const handleEditUser = (user) => {
    console.log('Edit user:', user.id)
  }

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user.id)
  }

  const handleSuspendUser = (user) => {
    console.log('Suspend user:', user.id)
  }

  const handleViewUser = (user) => {
    console.log('View user details:', user.id)
  }

  const handleContactUser = (user) => {
    console.log('Contact user:', user.id)
  }

  return (
    <Card>
      <CardHeader>
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

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('admin.searchUsers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">{t('admin.allRoles')}</option>
              <option value="student">{t('student.students')}</option>
              <option value="teacher">{t('teacher.teachers')}</option>
              <option value="parent">{t('parent.parents')}</option>
              <option value="admin">{t('admin.administrators')}</option>
            </select>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t('admin.allStatuses')}</option>
              <option value="active">{t('admin.active')}</option>
              <option value="inactive">{t('admin.inactive')}</option>
              <option value="suspended">{t('admin.suspended')}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
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
                      <Badge className={getStatusColor(user.status)}>
                        {t(`admin.${user.status}`)}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {user.class && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                          {user.class}
                        </span>
                      )}
                      {user.subjects && (
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">
                          {user.subjects.join(', ')}
                        </span>
                      )}
                      {user.children && (
                        <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                          {user.children.length} {t('parent.children')}
                        </span>
                      )}
                      {user.permissions && (
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          {user.permissions.length} {t('admin.permissions')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <div className="text-right">
                    <div className="text-muted-foreground">{t('admin.lastLogin')}</div>
                    <div className="font-medium">{formatLastLogin(user.last_login)}</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleContactUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {user.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSuspendUser(user)}
                        className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                  ? t('admin.noMatchingUsers')
                  : t('admin.noUsers')
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-between items-center pt-3 mt-3 border-t text-xs text-muted-foreground">
            <span>
              {filteredUsers.length} {t('admin.usersFound')} • 
              {filteredUsers.filter(u => u.status === 'active').length} {t('admin.active')}
            </span>
            <span>
              {filteredUsers.filter(u => u.status === 'suspended').length} {t('admin.suspended')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserManagement