import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import AssignmentSubmission from '../../components/dashboard/student/AssignmentSubmission'

// Mock assignments data - in real app, this would come from API/context
const mockAssignments = [
  {
    id: 1,
    title: 'Algebra Quiz Chapter 5',
    title_arabic: 'اختبار الجبر الفصل ٥',
    title_french: 'Quiz d\'Algèbre Chapitre 5',
    description: 'Complete exercises 1-15 from the algebra workbook. Show your work for all calculations and explain your reasoning for word problems.',
    subject: 'Mathematics',
    subject_name: 'Mathématiques',
    assignment_type: 'QCM',
    due_date: '2024-09-05T23:59:00Z',
    time_limit: 45,
    max_attempts: 2,
    total_points: 100,
    questions_count: 15,
    status: 'pending',
    submission_status: null,
    score: null,
    attempt_number: 0,
    is_late: false,
    difficulty_level: 'medium',
    estimated_time: 30,
    rewards: {
      base_points: 50,
      time_bonus: 10,
      accuracy_bonus: 25
    },
    instructions: [
      'Read each question carefully before answering',
      'Show all your work for calculation problems',
      'Double-check your answers before submitting',
      'You have 2 attempts, so use them wisely'
    ],
    resources: [
      { name: 'Chapter 5 Notes', url: '/resources/algebra-ch5-notes.pdf' },
      { name: 'Practice Problems', url: '/resources/algebra-ch5-practice.pdf' }
    ]
  },
  {
    id: 2,
    title: 'French Literature Essay',
    title_arabic: 'مقال الأدب الفرنسي',
    title_french: 'Essai de Littérature Française',
    description: 'Write a 500-word essay about Victor Hugo\'s Les Misérables, focusing on the themes of social justice and redemption.',
    subject: 'French Literature',
    subject_name: 'Littérature Française',
    assignment_type: 'OPEN',
    due_date: '2024-09-08T23:59:00Z',
    time_limit: null,
    max_attempts: 1,
    total_points: 80,
    questions_count: 1,
    status: 'pending',
    submission_status: null,
    score: null,
    attempt_number: 0,
    is_late: false,
    difficulty_level: 'hard',
    estimated_time: 120,
    rewards: {
      base_points: 40,
      completion_bonus: 20,
      quality_bonus: 35
    },
    instructions: [
      'Minimum 500 words, maximum 750 words',
      'Include at least 3 specific examples from the text',
      'Cite page numbers for all references',
      'Use proper essay structure with introduction, body, and conclusion'
    ],
    resources: [
      { name: 'Les Misérables PDF', url: '/resources/les-miserables.pdf' },
      { name: 'Essay Writing Guide', url: '/resources/essay-guide.pdf' }
    ]
  }
]

const AssignmentSubmissionPage = () => {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate API call to fetch assignment
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const foundAssignment = mockAssignments.find(
          a => a.id === parseInt(assignmentId)
        )
        
        if (!foundAssignment) {
          setError('Assignment not found')
          return
        }
        
        // Check if user has permission to submit this assignment
        if (user?.role !== 'STUDENT') {
          setError('Only students can submit assignments')
          return
        }
        
        setAssignment(foundAssignment)
      } catch (err) {
        setError('Failed to load assignment')
        console.error('Error fetching assignment:', err)
      } finally {
        setLoading(false)
      }
    }

    if (assignmentId) {
      fetchAssignment()
    } else {
      setError('Invalid assignment ID')
      setLoading(false)
    }
  }, [assignmentId, user])

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  const handleSubmit = async (submissionData) => {
    try {
      console.log('Submitting assignment:', submissionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      alert(t('submission.submitSuccess'))
      
      // Navigate back to assignments list
      navigate('/dashboard/assignments')
      
    } catch (error) {
      console.error('Submission failed:', error)
      alert(t('submission.submitError'))
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{t('common.error')}</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t('common.goBack')}
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <AssignmentSubmission
          assignment={assignment}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  )
}

export default AssignmentSubmissionPage