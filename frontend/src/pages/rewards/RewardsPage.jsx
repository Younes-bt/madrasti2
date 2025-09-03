/**
 * Rewards Page - Gamification and achievements page for students
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Trophy, 
  Award, 
  Star, 
  Target,
  TrendingUp,
  Gift,
  Crown,
  Zap,
  Medal,
  Coins,
  Calendar
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import AchievementBadgeSystem from '../../components/gamification/AchievementBadgeSystem';
import LeaderboardCompetitions from '../../components/gamification/LeaderboardCompetitions';
import PointSystemLeveling from '../../components/gamification/PointSystemLeveling';
import ProgressStreaksRewards from '../../components/gamification/ProgressStreaksRewards';

const RewardsPage = () => {
  const { user } = useAuth();
  const [studentWallet, setStudentWallet] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'badges', 'leaderboard', 'history'

  // Mock data - will be replaced with real API
  const mockWallet = {
    total_points: 2450,
    total_coins: 185,
    available_points: 2200,
    available_coins: 150,
    level: 8,
    level_progress: 75, // percentage to next level
    next_level_points: 2800,
    streak: 12, // days
    rank: 3,
    total_students: 28
  };

  const mockBadges = [
    {
      id: 1,
      name: 'Math Champion',
      name_arabic: 'بطل الرياضيات',
      description: 'Complete 10 math assignments with 90%+ score',
      icon: '🏆',
      rarity: 'LEGENDARY',
      points_reward: 100,
      earned_at: '2025-09-01T10:00:00Z',
      earned: true
    },
    {
      id: 2,
      name: 'Perfect Attendance',
      name_arabic: 'الحضور المثالي',
      description: 'Attend all classes for a full week',
      icon: '✅',
      rarity: 'EPIC',
      points_reward: 75,
      earned_at: '2025-08-28T14:30:00Z',
      earned: true
    },
    {
      id: 3,
      name: 'Quick Solver',
      name_arabic: 'الحلال السريع',
      description: 'Complete 5 assignments in under 10 minutes each',
      icon: '⚡',
      rarity: 'RARE',
      points_reward: 50,
      earned_at: null,
      earned: false,
      progress: 3,
      required: 5
    },
    {
      id: 4,
      name: 'Knowledge Seeker',
      name_arabic: 'طالب المعرفة',
      description: 'Complete 50 lessons across all subjects',
      icon: '📚',
      rarity: 'COMMON',
      points_reward: 25,
      earned_at: null,
      earned: false,
      progress: 32,
      required: 50
    }
  ];

  const mockLeaderboard = [
    { rank: 1, student_name: 'Sara Alami', points: 3250, badges: 12, avatar: '👩', streak: 15, change: 0 },
    { rank: 2, student_name: 'Ahmed Hassan', points: 2890, badges: 9, avatar: '👨', streak: 8, change: 1 },
    { rank: 3, student_name: user?.full_name || 'You', points: 2450, badges: 7, avatar: '🧑', streak: 12, change: -1 },
    { rank: 4, student_name: 'Fatima Said', points: 2320, badges: 8, avatar: '👩', streak: 6, change: 2 },
    { rank: 5, student_name: 'Omar Benali', points: 2150, badges: 6, avatar: '👨', streak: 4, change: -1 }
  ];

  const mockTransactions = [
    {
      id: 1,
      type: 'EARNED',
      reason: 'Assignment Completion',
      points: 50,
      coins: 5,
      description: 'Completed "Algebra Quiz 1" with 95% score',
      created_at: '2025-09-03T09:30:00Z'
    },
    {
      id: 2,
      type: 'EARNED',
      reason: 'Perfect Score',
      points: 25,
      coins: 0,
      description: 'Got 100% on Biology Lab Report',
      created_at: '2025-09-02T14:15:00Z'
    },
    {
      id: 3,
      type: 'EARNED',
      reason: 'Streak Bonus',
      points: 20,
      coins: 2,
      description: 'Maintained 12-day learning streak',
      created_at: '2025-09-01T16:45:00Z'
    },
    {
      id: 4,
      type: 'SPENT',
      reason: 'Badge Purchase',
      points: -75,
      coins: 0,
      description: 'Purchased "Study Master" badge upgrade',
      created_at: '2025-08-30T11:20:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudentWallet(mockWallet);
      setBadges(mockBadges);
      setLeaderboard(mockLeaderboard);
      setRecentTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity) => {
    const colors = {
      COMMON: 'bg-gray-100 text-gray-700 border-gray-300',
      RARE: 'bg-blue-100 text-blue-700 border-blue-300',
      EPIC: 'bg-purple-100 text-purple-700 border-purple-300',
      LEGENDARY: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[rarity] || colors.COMMON;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600'; // Gold
    if (rank === 2) return 'text-gray-500';   // Silver
    if (rank === 3) return 'text-orange-600'; // Bronze
    return 'text-gray-700';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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
              <Trophy className="w-6 h-6 text-yellow-600" />
              My Achievements
            </h1>
            <p className="text-gray-600 mt-1">
              Track your progress, earn rewards, and compete with classmates
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-600">{studentWallet?.streak} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Total Points</div>
                <div className="text-2xl font-bold">{studentWallet?.total_points}</div>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Coins</div>
                <div className="text-2xl font-bold">{studentWallet?.available_coins}</div>
              </div>
              <Coins className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Level</div>
                <div className="text-2xl font-bold">{studentWallet?.level}</div>
              </div>
              <Crown className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Class Rank</div>
                <div className="text-2xl font-bold">#{studentWallet?.rank}</div>
              </div>
              <Medal className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Level Progress</h3>
            <span className="text-sm text-gray-600">
              Level {studentWallet?.level} → {studentWallet?.level + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${studentWallet?.level_progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{studentWallet?.total_points} points</span>
            <span>{studentWallet?.next_level_points} points needed</span>
          </div>
        </Card>

        {/* Integrated Gamification Components */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="streaks" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Streaks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PointSystemLeveling />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <AchievementBadgeSystem />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <LeaderboardCompetitions />
          </TabsContent>

          <TabsContent value="streaks" className="space-y-6">
            <ProgressStreaksRewards />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RewardsPage;