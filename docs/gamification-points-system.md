# Gamification & Points System - Madrasti 2.0

## 🎯 Vision
Build a comprehensive gamification system with **weekly student leaderboards** and **class vs class competitions** to foster both individual achievement and team spirit among students.

---

## 📊 Current Point-Earning System

### 1. **Homework Completion**
Students earn points by submitting homework assignments:

#### Base Rewards (HomeworkReward)
- **Completion**: 10 points + 1 coin (default)
- **On-Time Submission**: +5 points
- **Early Submission** (>24h before due date): +10 points

#### Performance Bonuses
- **Perfect Score (100%)**: +20 points
- **High Score (≥90%)**: +10 points

#### Multipliers
- **Difficulty Multiplier**: Adjustable per homework
- **Weekend Multiplier**: 1.5x (assignments given on weekends)

---

### 2. **Exercise Completion**
Students earn points by completing lesson exercises:

#### Base Rewards (ExerciseReward)
- **Attempt**: 2 points (just for starting)
- **Completion**: 5 points + 1 coin
- **Perfect Score (100%)**: +10 points
- **High Score (≥80%)**: +5 points
- **Improvement Bonus**: +3 points (better than previous attempt)

#### Streak Bonuses
- **Daily Streak**: +2 points (completing exercises daily)
- **Lesson Completion**: +15 points (finishing all exercises in a lesson)

#### Multipliers
- **Difficulty Multiplier**: Based on exercise difficulty
- **First Attempt Bonus**: 1.5x multiplier

#### XP (Experience Points)
- **Base XP**: 5 XP per exercise
- **Bonus XP**: +10 XP for excellent performance

---

### 3. **Badge Achievements**
- Each Badge can have `points_reward` and `coins_reward`
- Earned for milestones, streaks, performance, participation

---

### 4. **Manual Rewards**
Teachers/admins can award:
- **Bonus** points
- **Gifts**
- **Achievement** rewards

---

## 🎮 NEW Proposed Features - Competition & Engagement

### 1. **1v1 Student Challenges** 🥊
**Description**: Direct competition between two students

**How It Works**:
- Student A challenges Student B to complete the same exercise/quiz
- Both have a time limit to complete
- System compares scores and speed
- Winner gets bonus points, loser gets participation points

**Variations**:
- Speed challenge (who finishes correctly first)
- Accuracy challenge (who gets higher score)
- Head-to-head live quiz battles

**Points Distribution**:
- Winner: +15 points
- Loser: +5 points (participation)
- Perfect score by both: +20 points each

**Implementation Model**:
```python
class StudentChallenge(models.Model):
    challenger = ForeignKey(User, related_name='challenges_sent')
    opponent = ForeignKey(User, related_name='challenges_received')
    exercise = ForeignKey(Exercise)
    winner = ForeignKey(User, null=True)
    points_reward = IntegerField(default=15)
    status = CharField(choices=['pending', 'accepted', 'declined', 'completed'])
    created_at = DateTimeField(auto_now_add=True)
    completed_at = DateTimeField(null=True)
```

---

### 2. **Class vs Class Tournaments** 🏆
**Description**: Weekly/Monthly competitions between different classes

**How It Works**:
- Each student's points contribute to their class total
- Leaderboard shows class rankings
- Winning class members get bonus multiplier
- Creates team spirit and collaboration

**Points Distribution**:
- 1st place class: +50 points per student
- 2nd place class: +30 points per student
- 3rd place class: +10 points per student

**Tournament Types**:
- Weekly Sprint (7 days)
- Monthly Championship (30 days)
- Subject-Specific (Math Tournament, Science Challenge)
- Semester Championship (3 months)

**Implementation Model**:
```python
class ClassTournament(models.Model):
    name = CharField(max_length=200)
    tournament_type = CharField(choices=['weekly', 'monthly', 'semester'])
    start_date = DateField()
    end_date = DateField()
    participating_classes = ManyToManyField('schools.SchoolClass')
    winner_class = ForeignKey('schools.SchoolClass', null=True)
    is_active = BooleanField(default=True)
```

---

### 3. **Peer Tutoring/Help System** 🤝
**Description**: Students help each other and earn points

**How It Works**:
- Students can ask questions and get help from peers
- Helper student earns points when their answer is marked as "helpful"
- Asker can upvote answers
- Top helpers get weekly bonus

**Points Earned**:
- Answer marked helpful: +5 points
- Answer gets upvoted: +2 points per upvote
- Best answer of the week badge: +25 points
- "Tutor Master" badge (helping 20+ students): +100 points

**Implementation Model**:
```python
class PeerQuestion(models.Model):
    student = ForeignKey(User, related_name='asked_questions')
    subject = ForeignKey('schools.Subject')
    question_text = TextField()
    created_at = DateTimeField(auto_now_add=True)
    is_answered = BooleanField(default=False)

class PeerAnswer(models.Model):
    question = ForeignKey(PeerQuestion)
    helper = ForeignKey(User, related_name='provided_answers')
    answer_text = TextField()
    upvotes = IntegerField(default=0)
    is_marked_helpful = BooleanField(default=False)
    points_earned = IntegerField(default=0)
```

---

### 4. **Daily Login Streaks & Activity** 📅
**Description**: Reward consistent daily engagement

**How It Works**:
- Track daily logins and activities
- Build streaks that multiply rewards
- Reset on missed days

**Points Earned**:
- Daily login: +2 points
- 7-day streak: +10 bonus points
- 30-day streak: +50 bonus points
- Complete daily mini-challenge: +5 points
- Watch a lesson video: +3 points
- Comment on lesson: +2 points

**Streak Multiplier**:
- Week 1: 1x
- Week 2: 1.1x
- Week 3: 1.2x
- Week 4+: 1.5x all points earned

**Implementation**:
- Extends existing `StudentWallet` model
- Add `current_streak`, `longest_streak`, `last_activity` fields
- Daily cron job to check and reset streaks

---

### 5. **Speed Rounds / Timed Events** ⚡
**Description**: Time-limited competitive events

**How It Works**:
- Friday "Speed Quiz" sessions (5-10 minutes)
- First students to complete with >80% accuracy get bonus
- Points decrease as time passes (gamification)

**Points Distribution**:
- 1st place: +30 points
- 2nd-5th: +20 points
- 6th-10th: +15 points
- Everyone else who completes: +5 points

**Event Types**:
- Flash Quiz Friday
- Monday Morning Sprint
- Weekend Challenge

---

### 6. **Question Creation Rewards** ✍️
**Description**: Students create questions for the platform

**How It Works**:
- Students can create questions for exercises
- Teacher approves and adds to question bank
- When other students answer their question, creator earns points
- Encourages deep understanding

**Points Earned**:
- Question submitted: +5 points
- Question approved by teacher: +15 points
- Every 10 students answer it: +2 points
- Question rated "excellent" by teacher: +30 points

**Implementation Model**:
```python
class StudentCreatedQuestion(models.Model):
    creator = ForeignKey(User, related_name='created_questions')
    subject = ForeignKey('schools.Subject')
    question_type = CharField(max_length=20)
    question_text = TextField()
    correct_answer = TextField()
    status = CharField(choices=['pending', 'approved', 'rejected'])
    times_answered = IntegerField(default=0)
    points_earned_by_creator = IntegerField(default=0)
```

---

### 7. **Study Groups / Team Exercises** 👥
**Description**: Collaborative learning with rewards

**How It Works**:
- Form study groups (3-5 students)
- Complete group exercises together
- Average group score determines points
- Bonus if all members score >80%

**Points Distribution**:
- Group average >90%: +20 points each
- Group average >80%: +15 points each
- All members complete: +10 points each
- Group perfect score: +40 points each + group badge

**Implementation Model**:
```python
class StudyGroup(models.Model):
    name = CharField(max_length=100)
    members = ManyToManyField(User, related_name='study_groups')
    created_by = ForeignKey(User)
    school_class = ForeignKey('schools.SchoolClass')
    is_active = BooleanField(default=True)

class GroupExercise(models.Model):
    study_group = ForeignKey(StudyGroup)
    exercise = ForeignKey(Exercise)
    average_score = DecimalField()
    all_completed = BooleanField(default=False)
    points_awarded = IntegerField()
```

---

### 8. **Attendance & Punctuality Rewards** 📍
**Description**: Integrate with existing attendance system

**How It Works**:
- Automatically award points based on attendance records
- Track perfect attendance streaks
- Reward early arrivals

**Points Distribution**:
- Present in class: +3 points per session
- Perfect weekly attendance: +20 bonus points
- Perfect monthly attendance: +100 bonus points
- Early arrival (before session starts): +2 points

**Integration**:
- Links with existing `AttendanceRecord` model
- Automatic point calculation on attendance completion

---

### 9. **Mastery Levels / Skill Trees** 🌳
**Description**: Progressive skill development system

**How It Works**:
- Each subject has skill levels (Bronze → Silver → Gold → Platinum)
- Complete X exercises at each level to advance
- Level up rewards increase progressively

**Points Per Level Up**:
- Bronze: +25 points
- Silver: +50 points
- Gold: +100 points
- Platinum: +200 points + special badge

**Subject Mastery Bonus**:
- Master 3 subjects: +150 points
- Master all subjects: +500 points + "Scholar" title

**Implementation Model**:
```python
class SubjectMastery(models.Model):
    student = ForeignKey(User)
    subject = ForeignKey('schools.Subject')
    level = CharField(choices=['bronze', 'silver', 'gold', 'platinum'])
    exercises_completed = IntegerField(default=0)
    exercises_required = IntegerField()
    current_progress = IntegerField(default=0)
```

---

### 10. **Community Challenges & Events** 🎪
**Description**: School-wide themed challenges

**How It Works**:
- Weekly themed challenges (e.g., "Math Marathon Monday")
- School-wide goals (e.g., "Complete 1000 exercises as a school")
- Seasonal events (Ramadan challenge, Back-to-school challenge)

**Event Types**:
- **Marathon**: Most exercises in 24h
- **Accuracy King**: Best accuracy rate in a week
- **Night Owl**: Complete exercises at night (bonus hours)
- **Early Bird**: Complete before 8 AM

**Event Rewards**:
- Participation: +10 points
- Top 25%: +30 points
- Top 10%: +50 points
- Winner: +100 points + exclusive badge

---

## 🏅 Achievement Unlocks

### Special Achievements
- **First Blood**: First to complete new exercise (+15 points)
- **Speed Demon**: Complete 5 exercises in 1 hour (+25 points)
- **Perfect Week**: 7 days all assignments perfect (+100 points)
- **Comeback Kid**: Improve score by 50%+ on retry (+20 points)
- **Night Scholar**: Complete 10 exercises after 10 PM (+30 points)
- **Early Riser**: Complete exercises before 7 AM (+15 points)
- **Weekend Warrior**: Most points earned on weekends (+40 points)
- **Helping Hand**: Help 50+ peers (+200 points)
- **Challenge Master**: Win 20+ 1v1 challenges (+150 points)

---

## 📈 Leaderboard System

### Individual Leaderboards
1. **Weekly Top Performer** - Most points this week
2. **Monthly Champion** - Most points this month
3. **All-Time Legend** - Total points earned
4. **Subject Master** - Highest in each subject
5. **Rising Star** - Biggest weekly improvement
6. **Streak King** - Longest active streak
7. **Helper Hero** - Most peer help points
8. **Challenge Champion** - Most 1v1 wins
9. **Perfect Student** - Attendance + grades + participation

### Class Leaderboards
1. **Weekly Class Rankings** - Total class points this week
2. **Monthly Class Championship** - Total class points this month
3. **Average Performance** - Average points per student
4. **Participation Rate** - Percentage of active students
5. **Subject Excellence** - Best class per subject

---

## 🎯 Implementation Priority

### Phase 1: Core Enhancements (Immediate)
1. ✅ Weekly Student Leaderboard API
2. ✅ Class Statistics & Class Leaderboard
3. ✅ Weekly Reset System (cron job)
4. ✅ Attendance Points Integration

### Phase 2: Competition Features (Short-term)
5. 🔲 1v1 Student Challenges
6. 🔲 Class vs Class Tournaments
7. 🔲 Daily Streaks & Activity Tracking
8. 🔲 Speed Rounds / Timed Events

### Phase 3: Community & Collaboration (Medium-term)
9. 🔲 Peer Tutoring/Help System
10. 🔲 Study Groups
11. 🔲 Community Challenges & Events

### Phase 4: Advanced Gamification (Long-term)
12. 🔲 Question Creation Rewards
13. 🔲 Mastery Levels / Skill Trees
14. 🔲 Achievement System
15. 🔲 Referral System

---

## 💾 Database Models Summary

### New Models Required:
1. `ClassStats` - Cache class point totals
2. `StudentChallenge` - 1v1 competitions
3. `ClassTournament` - Class vs class events
4. `PeerQuestion` & `PeerAnswer` - Tutoring system
5. `StudyGroup` & `GroupExercise` - Collaborative learning
6. `StudentCreatedQuestion` - User-generated content
7. `SubjectMastery` - Skill progression
8. `CommunityEvent` - School-wide challenges
9. `DailyActivity` - Track daily engagement

### Enhanced Existing Models:
- `StudentWallet` - Add daily/weekly activity tracking
- `AttendanceRecord` - Add automatic point calculation
- `Badge` - Add achievement unlock conditions
- `RewardTransaction` - Add new transaction types

---

## 🚀 Technical Considerations

### Backend Requirements:
- Django management commands for weekly resets
- Celery tasks for async point calculation
- Redis caching for real-time leaderboards
- WebSocket support for live challenges
- Notification system for challenges/events

### Frontend Requirements:
- Leaderboard components (student & class)
- Challenge interface (send/accept/compete)
- Live score updates during challenges
- Progress bars for streaks and mastery
- Achievement notification popups
- Class tournament dashboards

### Performance Optimizations:
- Cache leaderboard queries
- Aggregate class totals periodically
- Denormalize frequently accessed data
- Index on point-related fields
- Batch point calculations

---

## 📊 Analytics & Insights

### Metrics to Track:
- Daily/Weekly/Monthly active users
- Average points per student
- Challenge acceptance rate
- Peer help engagement
- Class participation rates
- Feature adoption rates
- Point inflation monitoring

### Reports for Teachers:
- Class performance trends
- Student engagement levels
- Most popular features
- Competition participation
- Help-seeking patterns

---

## 🎨 UX/UI Considerations

### Student Dashboard Should Show:
- Current rank (weekly & all-time)
- Points earned today/this week
- Active streak count
- Pending challenges
- Available events
- Next level progress
- Class ranking

### Gamification Elements:
- Progress bars
- Level badges
- Point animations
- Leaderboard highlights
- Achievement popups
- Streak fire icons
- Trophy display

---

## ⚖️ Balance & Fairness

### Preventing Gaming the System:
- Rate limiting on point-earning activities
- Detection of suspicious patterns
- Manual review for high-value rewards
- Time-based cooldowns
- Minimum quality thresholds
- Anti-cheating measures

### Ensuring Fair Competition:
- Grade-based leaderboards
- Class size normalization
- Difficulty adjustments
- Time zone considerations
- Challenge matchmaking by skill level

---

## 🌍 Multilingual Support

All new features must support:
- Arabic (العربية)
- French (Français)
- English

### Translation Keys Needed:
- Achievement names
- Challenge notifications
- Leaderboard labels
- Event descriptions
- Badge titles
- Point transaction descriptions

---

## 📝 Notes

- All point values are configurable via `RewardSettings`
- System should prevent point inflation
- Regular auditing of point distribution
- Student feedback on engaging features
- A/B testing for optimal point values
- Seasonal adjustments for events

---

**Document Version**: 1.0
**Created**: 2025-01-04
**Last Updated**: 2025-01-04
**Status**: Proposal - Pending Implementation
