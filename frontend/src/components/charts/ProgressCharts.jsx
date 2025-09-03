/**
 * Progress Charts Component
 * Comprehensive data visualization for student progress, class analytics, and performance metrics
 */

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  LineChart, 
  PieChart, 
  Download,
  RefreshCw,
  Calendar,
  Users,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

// Simple chart components (can be replaced with Chart.js or Recharts later)
const ProgressBar = ({ value, max, color = 'blue', label, showValue = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{label}</span>
          {showValue && <span className="font-medium">{value}/{max}</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-${color}-500 transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
      )}
    </div>
  );
};

const CircularProgress = ({ value, max, size = 'lg', color = 'blue', label }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-${color}-500 transition-all duration-1000 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-bold text-lg">{percentage.toFixed(0)}%</div>
          {label && <div className="text-xs text-gray-600">{label}</div>}
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, height = '200px', color = 'blue' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="flex items-end justify-between space-x-1" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div 
            className={`w-full bg-${color}-500 rounded-t transition-all duration-500 ease-in-out hover:bg-${color}-600`}
            style={{ 
              height: `${(item.value / maxValue) * 80}%`,
              minHeight: item.value > 0 ? '4px' : '0px'
            }}
            title={`${item.label}: ${item.value}`}
          />
          <div className="text-xs text-gray-600 text-center font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, height = '200px', color = 'blue' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  
  const getY = (value) => {
    if (range === 0) return 50;
    return ((maxValue - value) / range) * 80 + 10;
  };

  const points = data.map((item, index) => 
    `${(index / (data.length - 1)) * 100},${getY(item.value)}`
  ).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-300"
          />
        ))}
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className={`text-${color}-500`}
        />
        
        {/* Points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 100}
            cy={getY(item.value)}
            r="1.5"
            fill="currentColor"
            className={`text-${color}-600`}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-600 text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressCharts = ({ 
  studentData = null,
  classData = null,
  subjectData = [],
  timeframeData = [],
  comparisonData = [],
  type = 'student', // 'student', 'class', 'subject'
  timeframe = 'week', // 'week', 'month', 'semester'
  onTimeframeChange = null,
  onExport = null
}) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (type === 'student' && studentData) {
      return {
        overallProgress: studentData.overall_progress || 0,
        completionRate: studentData.completion_rate || 0,
        averageScore: studentData.average_score || 0,
        assignmentsCompleted: studentData.assignments_completed || 0,
        totalAssignments: studentData.total_assignments || 0,
        streak: studentData.current_streak || 0,
        rank: studentData.class_rank || 0,
        totalStudents: studentData.total_students || 0,
        pointsEarned: studentData.points_earned || 0,
        badgesEarned: studentData.badges_earned || 0
      };
    }
    
    if (type === 'class' && classData) {
      return {
        classAverage: classData.class_average || 0,
        completionRate: classData.completion_rate || 0,
        totalStudents: classData.total_students || 0,
        activeStudents: classData.active_students || 0,
        topPerformers: classData.top_performers || 0,
        needsAttention: classData.needs_attention || 0
      };
    }
    
    return {};
  }, [studentData, classData, type]);

  // Generate trend indicator
  const getTrendIndicator = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
    );
  };

  // Sample data for charts (replace with real data)
  const weeklyProgressData = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 88 },
    { label: 'Sat', value: 90 },
    { label: 'Sun', value: 93 }
  ];

  const subjectProgressData = subjectData.length > 0 ? subjectData : [
    { label: 'Math', value: 95 },
    { label: 'Science', value: 88 },
    { label: 'English', value: 92 },
    { label: 'History', value: 86 },
    { label: 'Art', value: 94 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="w-5 h-5 text-blue-600" />
            Progress Analytics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive performance metrics and visualizations
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex rounded-md border">
            {['overview', 'trends', 'comparison'].map((view) => (
              <Button
                key={view}
                variant={activeView === view ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(view)}
                className="capitalize"
              >
                {view}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.overallProgress}%</p>
            </div>
            <CircularProgress value={metrics.overallProgress} max={100} size="md" color="blue" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completionRate}%</p>
            </div>
            <div className="text-green-600">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.averageScore}%</p>
            </div>
            <div className="text-purple-600">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-orange-600">
                {metrics.assignmentsCompleted}/{metrics.totalAssignments}
              </p>
            </div>
            <div className="text-orange-600">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center gap-2">
                <LineChart className="w-4 h-4 text-green-600" />
                Weekly Progress
              </h4>
              <Badge variant="outline">{timeframe}</Badge>
            </div>
            <LineChart data={weeklyProgressData} color="green" />
          </Card>

          {/* Subject Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600" />
                Subject Performance
              </h4>
            </div>
            <BarChart data={subjectProgressData} color="blue" />
          </Card>

          {/* Progress Breakdown */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              Progress Breakdown
            </h4>
            <div className="space-y-4">
              <ProgressBar 
                value={metrics.assignmentsCompleted} 
                max={metrics.totalAssignments}
                color="blue"
                label="Assignments Completed"
              />
              <ProgressBar 
                value={metrics.averageScore} 
                max={100}
                color="green"
                label="Average Score"
              />
              <ProgressBar 
                value={metrics.pointsEarned} 
                max={1000}
                color="purple"
                label="Points Earned"
              />
              <ProgressBar 
                value={metrics.badgesEarned} 
                max={20}
                color="yellow"
                label="Badges Earned"
              />
            </div>
          </Card>

          {/* Class Ranking */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Class Ranking
            </h4>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-indigo-600">
                #{metrics.rank}
              </div>
              <div className="text-sm text-gray-600">
                out of {metrics.totalStudents} students
              </div>
              <div className="mt-4">
                <CircularProgress 
                  value={metrics.totalStudents - metrics.rank + 1} 
                  max={metrics.totalStudents}
                  size="lg"
                  color="indigo"
                  label="Percentile"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <Card className="p-6 col-span-full">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Performance Trend Analysis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">+12%</div>
                <div className="text-sm text-gray-600">This Month</div>
                <div className="text-xs text-green-600 mt-1">↗ Improving</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">+8%</div>
                <div className="text-sm text-gray-600">This Week</div>
                <div className="text-xs text-blue-600 mt-1">↗ Steady Growth</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{metrics.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
                <div className="text-xs text-purple-600 mt-1">🔥 On Fire</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 col-span-full">
            <h4 className="font-semibold mb-4">Performance Comparison</h4>
            <div className="text-center text-gray-500 py-8">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Comparison data will be available once more students complete assignments</p>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Progress Summary</h4>
            <p className="text-blue-700 text-sm">
              {metrics.overallProgress >= 90 && "🎉 Excellent progress! Keep up the outstanding work!"}
              {metrics.overallProgress >= 75 && metrics.overallProgress < 90 && "👍 Good progress! You're doing well!"}
              {metrics.overallProgress >= 50 && metrics.overallProgress < 75 && "💪 Making progress! Keep pushing forward!"}
              {metrics.overallProgress < 50 && "🎯 Focus on improvement! You can do this!"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{metrics.overallProgress}%</div>
            <div className="text-sm text-blue-600">Complete</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressCharts;