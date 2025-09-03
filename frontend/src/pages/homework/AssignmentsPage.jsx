/**
 * Assignments Page - Main assignments interface for all user roles
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  FileText,
  Edit,
  X
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import AssignmentBuilder from '../../components/assignments/AssignmentBuilder';

const AssignmentsPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showAssignmentBuilder, setShowAssignmentBuilder] = useState(false);

  // Mock data - will be replaced with real API
  const mockAssignments = [
    {
      id: 1,
      title: 'Algebra Quiz 1',
      title_arabic: 'اختبار الجبر 1',
      description: 'Test your understanding of basic algebraic concepts',
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      type: 'QCM',
      due_date: '2025-09-10T23:59:00Z',
      time_limit: 45,
      max_attempts: 2,
      total_points: 100,
      questions_count: 20,
      submissions_count: 28,
      completion_rate: 85.7,
      average_score: 78.5,
      is_published: true,
      created_by: 'Mr. Ahmed Hassan',
      status: user?.role === 'STUDENT' ? 'pending' : 'published', // student perspective vs teacher
      student_submission: user?.role === 'STUDENT' ? null : undefined, // for student view
      grade: user?.role === 'STUDENT' ? null : undefined
    },
    {
      id: 2,
      title: 'Cell Biology Lab Report',
      title_arabic: 'تقرير مختبر الأحياء الخلوية',
      description: 'Submit your observations from the cell biology lab',
      subject: 'Biology',
      subject_arabic: 'الأحياء',
      type: 'OPEN',
      due_date: '2025-09-15T23:59:00Z',
      time_limit: null,
      max_attempts: 1,
      total_points: 50,
      questions_count: 5,
      submissions_count: 15,
      completion_rate: 62.5,
      average_score: 82.3,
      is_published: true,
      created_by: 'Dr. Sarah Ahmed',
      status: user?.role === 'STUDENT' ? 'completed' : 'published',
      student_submission: user?.role === 'STUDENT' ? {
        submitted_at: '2025-09-08T14:30:00Z',
        score: 85,
        grade: 'A'
      } : undefined
    },
    {
      id: 3,
      title: 'French Grammar Exercise',
      title_arabic: 'تمرين قواعد اللغة الفرنسية',
      description: 'Practice past tense conjugations',
      subject: 'French',
      subject_arabic: 'الفرنسية',
      type: 'MIXED',
      due_date: '2025-09-05T23:59:00Z',
      time_limit: 30,
      max_attempts: 3,
      total_points: 75,
      questions_count: 15,
      submissions_count: 22,
      completion_rate: 91.7,
      average_score: 88.2,
      is_published: true,
      created_by: 'Mme. Marie Dubois',
      status: user?.role === 'STUDENT' ? 'overdue' : 'published',
      student_submission: user?.role === 'STUDENT' ? null : undefined
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.title_arabic.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      published: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: AlertCircle,
      completed: CheckCircle,
      overdue: XCircle,
      draft: FileText,
      published: CheckCircle
    };
    const Icon = icons[status] || AlertCircle;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      QCM: 'bg-blue-100 text-blue-700',
      OPEN: 'bg-green-100 text-green-700',
      MIXED: 'bg-purple-100 text-purple-700',
      BOOK: 'bg-orange-100 text-orange-700'
    };
    return colors[type] || colors.QCM;
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now;
    
    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOverdue
    };
  };

  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              {isTeacher ? 'My Assignments' : isStudent ? 'My Assignments' : 'Assignments'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isTeacher && 'Create and manage assignments for your classes'}
              {isStudent && 'Complete your assignments and track your progress'}
              {!isTeacher && !isStudent && 'Assignment management system'}
            </p>
          </div>
          
          {isTeacher && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowAssignmentBuilder(true)}
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </Button>
          )}
        </div>

        {/* Quick Stats for Students */}
        {isStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Completed</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5" />
                87%
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {isStudent && (
                <>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </>
              )}
              {isTeacher && (
                <>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </>
              )}
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="French">French</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const dueDate = formatDueDate(assignment.due_date);
            
            return (
              <Card key={assignment.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          <Badge className={getTypeColor(assignment.type)}>
                            {assignment.type}
                          </Badge>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusIcon(assignment.status)}
                            <span className="ml-1 capitalize">{assignment.status}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className={dueDate.isOverdue ? 'text-red-600' : ''}>
                              Due: {dueDate.formatted}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {assignment.time_limit ? `${assignment.time_limit} min` : 'No limit'}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {assignment.questions_count} questions
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            {assignment.total_points} points
                          </div>
                        </div>

                        {/* Student-specific info */}
                        {isStudent && assignment.student_submission && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-700">
                                Submitted on {new Date(assignment.student_submission.submitted_at).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-green-700">
                                  Score: {assignment.student_submission.score}%
                                </span>
                                <Badge variant="secondary">
                                  Grade: {assignment.student_submission.grade}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Teacher-specific info */}
                        {isTeacher && (
                          <div className="mt-3 text-sm text-gray-500">
                            <span>{assignment.submissions_count} submissions • </span>
                            <span>{assignment.completion_rate}% completion rate • </span>
                            <span>Average score: {assignment.average_score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    {isStudent && (
                      <>
                        {assignment.status === 'pending' && (
                          <Button size="sm" className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Start
                          </Button>
                        )}
                        {assignment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                        )}
                      </>
                    )}
                    
                    {isTeacher && (
                      <>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No assignments available yet'}
            </p>
            {isTeacher && (
              <Button 
                className="mt-4"
                onClick={() => setShowAssignmentBuilder(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Assignment
              </Button>
            )}
          </div>
        )}

        {/* Assignment Builder Modal */}
        {showAssignmentBuilder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Create New Assignment</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAssignmentBuilder(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <AssignmentBuilder onClose={() => setShowAssignmentBuilder(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentsPage;