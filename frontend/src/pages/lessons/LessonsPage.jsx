/**
 * Lessons Page - Main lessons interface for all user roles
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Clock,
  Users,
  Star,
  Play,
  Download
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const LessonsPage = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock data - will be replaced with real API
  const mockLessons = [
    {
      id: 1,
      title: 'Introduction to Algebra',
      title_arabic: 'مقدمة في الجبر',
      description: 'Learn the fundamentals of algebraic expressions and equations',
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      grade: '9th Grade',
      duration: 45,
      difficulty: 'medium',
      resources_count: 8,
      view_count: 142,
      is_published: true,
      created_by: 'Mr. Ahmed Hassan',
      thumbnail: '/api/placeholder/300/200',
      tags: ['algebra', 'equations', 'fundamentals']
    },
    {
      id: 2,
      title: 'Cell Biology Basics',
      title_arabic: 'أساسيات علم الأحياء الخلوية',
      description: 'Understanding cell structure and functions',
      subject: 'Biology',
      subject_arabic: 'الأحياء',
      grade: '10th Grade',
      duration: 50,
      difficulty: 'easy',
      resources_count: 12,
      view_count: 98,
      is_published: true,
      created_by: 'Dr. Sarah Ahmed',
      thumbnail: '/api/placeholder/300/200',
      tags: ['biology', 'cells', 'structure']
    },
    {
      id: 3,
      title: 'French Grammar - Past Tense',
      title_arabic: 'قواعد اللغة الفرنسية - الزمن الماضي',
      description: 'Master the French past tense conjugations',
      subject: 'French',
      subject_arabic: 'الفرنسية',
      grade: '8th Grade',
      duration: 35,
      difficulty: 'hard',
      resources_count: 6,
      view_count: 76,
      is_published: true,
      created_by: 'Mme. Marie Dubois',
      thumbnail: '/api/placeholder/300/200',
      tags: ['french', 'grammar', 'past-tense']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter lessons based on search and filters
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.title_arabic.includes(searchTerm);
    const matchesSubject = filterSubject === 'all' || lesson.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || colors.medium;
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
              <BookOpen className="w-6 h-6 text-blue-600" />
              {isTeacher ? 'My Lessons' : isStudent ? 'Available Lessons' : 'Lessons'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isTeacher && 'Create and manage your lessons'}
              {isStudent && 'Browse and access your course materials'}
              {!isTeacher && !isStudent && 'Lesson management system'}
            </p>
          </div>
          
          {isTeacher && (
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Lesson
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="French">French</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Lessons Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <Badge className={getDifficultyColor(lesson.difficulty)}>
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {lesson.resources_count} resources
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {lesson.view_count} views
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{lesson.subject}</span>
                      <br />
                      <span>{lesson.grade}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {isStudent && (
                        <Button size="sm" className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                      {isTeacher && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {lesson.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      </div>
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span>{lesson.subject}</span>
                      <span>•</span>
                      <span>{lesson.grade}</span>
                      <span>•</span>
                      <span>{lesson.duration} min</span>
                      <span>•</span>
                      <span>{lesson.resources_count} resources</span>
                      <span>•</span>
                      <span>{lesson.view_count} views</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isStudent && (
                      <Button size="sm" className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Start
                      </Button>
                    )}
                    {isTeacher && (
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No lessons available yet'}
            </p>
            {isTeacher && (
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lesson
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LessonsPage;