import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { useLanguage } from '../../hooks/useLanguage'
import { User, BookOpen, GraduationCap, School } from 'lucide-react'

const StudentInfoCard = ({ student, loading }) => {
  const { t, currentLanguage } = useLanguage()

  if (loading) {
    return (
      <Card className="rounded-2xl border shadow-sm mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full" />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!student) return null

  // Determine which grade name to use based on language
  const getGradeName = () => {
    if (currentLanguage === 'ar' && student.grade_name_arabic) return student.grade_name_arabic
    if (currentLanguage === 'fr' && student.grade_name_french) return student.grade_name_french
    return student.grade || t('common.n/a')
  }

  return (
    <Card className="rounded-2xl border shadow-sm mb-6 bg-white overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/10">
              <AvatarImage src={student.profile_picture_url} alt={student.full_name} />
              <AvatarFallback className="bg-primary/5 text-primary text-xl">
                {student.first_name?.[0]}{student.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {student.is_online && (
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {currentLanguage === 'ar' && student.ar_first_name ? `${student.ar_first_name} ${student.ar_last_name}` : student.full_name}
              </h2>
              {student.student_id && (
                <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md self-center md:self-auto">
                  #{student.student_id}
                </span>
              )}
            </div>
            
            <p className="text-sm md:text-base text-gray-500 flex items-center justify-center md:justify-start gap-1">
              <User size={14} className="text-gray-400" />
              {student.email}
            </p>

            {/* Academic Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-3">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                <GraduationCap size={14} />
                {getGradeName()}
              </Badge>
              
              {student.class_name && (
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                  <School size={14} />
                  {student.class_name}
                </Badge>
              )}

              {student.track && (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {student.track}
                </Badge>
              )}
              
              {student.academic_year && (
                <Badge variant="outline" className="text-gray-500 border-gray-200 rounded-full px-3 py-1">
                  {student.academic_year}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentInfoCard
