# homework/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.utils import timezone
from cloudinary.models import CloudinaryField
import json
from decimal import Decimal

# =====================================
# REWARD SYSTEM MODELS
# =====================================

class RewardSettings(models.Model):
    """Global reward settings for the school"""
    school = models.OneToOneField('schools.School', on_delete=models.CASCADE, related_name='reward_settings')
    
    # Point Values
    points_per_correct_qcm = models.PositiveIntegerField(default=1)
    points_per_assignment_completion = models.PositiveIntegerField(default=10)
    points_perfect_score = models.PositiveIntegerField(default=20, help_text="Bonus for 100% score")
    points_on_time_submission = models.PositiveIntegerField(default=5)
    points_early_submission = models.PositiveIntegerField(default=10, help_text="Submitted >24h early")
    
    # Penalties
    late_submission_penalty = models.PositiveIntegerField(default=5)
    
    # Conversion rates
    points_to_coins_ratio = models.DecimalField(max_digits=3, decimal_places=2, default=0.10, 
                                              help_text="How many coins per point")
    
    # Feature toggles
    enable_leaderboard = models.BooleanField(default=True)
    enable_badges = models.BooleanField(default=True)
    enable_weekly_reset = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Reward Settings - {self.school.name}"

class RewardType(models.Model):
    """Types of rewards available"""
    REWARD_CATEGORIES = [
        ('points', 'نقاط - Points'),
        ('coins', 'عملات - Coins'),
        ('gems', 'جواهر - Gems'),
        ('stars', 'نجوم - Stars'),
        ('xp', 'خبرة - XP')
    ]
    
    name = models.CharField(max_length=50)
    name_arabic = models.CharField(max_length=50)
    category = models.CharField(max_length=20, choices=REWARD_CATEGORIES)
    icon = models.CharField(max_length=50, help_text="Icon class or emoji")
    color = models.CharField(max_length=7, default='#ffd700', help_text="Hex color")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class StudentWallet(models.Model):
    """Student's accumulated rewards"""
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    
    # Current balances
    total_points = models.PositiveIntegerField(default=0)
    total_coins = models.PositiveIntegerField(default=0)
    total_gems = models.PositiveIntegerField(default=0)
    total_stars = models.PositiveIntegerField(default=0)
    experience_points = models.PositiveIntegerField(default=0)
    
    # Weekly tracking (for leaderboards)
    weekly_points = models.PositiveIntegerField(default=0)
    weekly_coins = models.PositiveIntegerField(default=0)
    current_week = models.DateField(auto_now_add=True)
    
    # Monthly tracking
    monthly_points = models.PositiveIntegerField(default=0)
    monthly_coins = models.PositiveIntegerField(default=0)
    current_month = models.DateField(auto_now_add=True)
    
    # Achievements
    level = models.PositiveIntegerField(default=1)
    assignments_completed = models.PositiveIntegerField(default=0)
    perfect_scores = models.PositiveIntegerField(default=0)
    early_submissions = models.PositiveIntegerField(default=0)
    
    # Streaks
    current_streak = models.PositiveIntegerField(default=0, help_text="Days with completed assignments")
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity = models.DateField(auto_now=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.total_points} points"
    
    @property
    def current_level_name(self):
        """Get current level name based on XP"""
        if self.experience_points < 100:
            return "مبتدئ - Débutant"
        elif self.experience_points < 500:
            return "متقدم - Avancé"
        elif self.experience_points < 1000:
            return "خبير - Expert"
        elif self.experience_points < 2000:
            return "بطل - Champion"
        else:
            return "أسطورة - Légende"

class RewardTransaction(models.Model):
    """Track all reward transactions"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reward_transactions')
    homework = models.ForeignKey('Homework', on_delete=models.CASCADE, null=True, blank=True)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE, null=True, blank=True)
    submission = models.ForeignKey('Submission', on_delete=models.CASCADE, null=True, blank=True)
    exercise_submission = models.ForeignKey('ExerciseSubmission', on_delete=models.CASCADE, null=True, blank=True)
    
    TRANSACTION_TYPES = [
        ('earned', 'مكتسب - Gagné'),
        ('bonus', 'مكافأة - Bonus'),
        ('penalty', 'خصم - Pénalité'),
        ('spent', 'مصروف - Dépensé'),
        ('gift', 'هدية - Cadeau'),
        ('achievement', 'إنجاز - Achievement')
    ]
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    
    # Reward amounts
    points_earned = models.IntegerField(default=0)
    coins_earned = models.IntegerField(default=0)
    gems_earned = models.IntegerField(default=0)
    stars_earned = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    
    # Context
    reason = models.CharField(max_length=200, help_text="Why this reward was given")
    reason_arabic = models.CharField(max_length=200, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, 
                                 related_name='awarded_rewards')
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.transaction_type} - {self.points_earned}pts"

# =====================================
# BADGE SYSTEM MODELS
# =====================================

class Badge(models.Model):
    """Available badges students can earn"""
    name = models.CharField(max_length=100)
    name_arabic = models.CharField(max_length=100)
    description = models.TextField()
    description_arabic = models.TextField()
    
    # Visual
    icon = models.CharField(max_length=100, help_text="Icon class or emoji")
    color = models.CharField(max_length=7, default='#gold')
    image = CloudinaryField('image', null=True, blank=True, folder='badges/')
    
    BADGE_TYPES = [
        ('achievement', 'إنجاز - Achievement'),
        ('milestone', 'معلم - Milestone'),
        ('streak', 'سلسلة - Streak'),
        ('performance', 'أداء - Performance'),
        ('participation', 'مشاركة - Participation'),
        ('special', 'خاص - Special')
    ]
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    
    RARITY_LEVELS = [
        ('common', 'عادي - Common'),
        ('rare', 'نادر - Rare'),
        ('epic', 'ملحمي - Epic'),
        ('legendary', 'أسطوري - Legendary')
    ]
    rarity = models.CharField(max_length=20, choices=RARITY_LEVELS, default='common')
    
    # Requirements (JSON field for flexible criteria)
    requirements = models.JSONField(default=dict, help_text="Criteria to earn this badge")
    
    # Rewards for earning this badge
    points_reward = models.PositiveIntegerField(default=0)
    coins_reward = models.PositiveIntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_hidden = models.BooleanField(default=False, help_text="Hidden until earned")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class StudentBadge(models.Model):
    """Badges earned by students"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)

    earned_at = models.DateTimeField(auto_now_add=True)
    earned_for = models.CharField(max_length=200, blank=True, help_text="What triggered this badge")

    # Context
    homework = models.ForeignKey('Homework', on_delete=models.SET_NULL, null=True, blank=True)
    exercise = models.ForeignKey('Exercise', on_delete=models.SET_NULL, null=True, blank=True)
    submission = models.ForeignKey('Submission', on_delete=models.SET_NULL, null=True, blank=True)
    exercise_submission = models.ForeignKey('ExerciseSubmission', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'badge']
        ordering = ['-earned_at']
        
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.badge.name}"

# =====================================
# LEADERBOARD MODELS
# =====================================

class Leaderboard(models.Model):
    """Weekly/Monthly leaderboards"""
    LEADERBOARD_TYPES = [
        ('weekly', 'أسبوعي - Hebdomadaire'),
        ('monthly', 'شهري - Mensuel'),
        ('semester', 'فصل دراسي - Semestriel'),
        ('yearly', 'سنوي - Annuel')
    ]
    
    LEADERBOARD_SCOPE = [
        ('school', 'المدرسة - École'),
        ('grade', 'المستوى - Niveau'),
        ('class', 'القسم - Classe'),
        ('subject', 'المادة - Matière')
    ]
    
    name = models.CharField(max_length=100)
    leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPES)
    scope = models.CharField(max_length=20, choices=LEADERBOARD_SCOPE)
    
    # Scope filters
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE, null=True, blank=True)
    school_class = models.ForeignKey('schools.SchoolClass', on_delete=models.CASCADE, null=True, blank=True)
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE, null=True, blank=True)
    
    # Period
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Settings
    is_active = models.BooleanField(default=True)
    max_participants = models.PositiveIntegerField(default=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"

class LeaderboardEntry(models.Model):
    """Individual student entries in leaderboards"""
    leaderboard = models.ForeignKey(Leaderboard, on_delete=models.CASCADE, related_name='entries')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Rankings
    current_rank = models.PositiveIntegerField()
    previous_rank = models.PositiveIntegerField(null=True, blank=True)
    
    # Scores
    total_points = models.PositiveIntegerField()
    total_coins = models.PositiveIntegerField()
    assignments_completed = models.PositiveIntegerField(default=0)
    perfect_scores = models.PositiveIntegerField(default=0)
    
    # Progress
    points_this_period = models.PositiveIntegerField(default=0)
    rank_change = models.IntegerField(default=0, help_text="Positive = moved up, Negative = moved down")
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['leaderboard', 'student']
        ordering = ['current_rank']
        
    def __str__(self):
        return f"#{self.current_rank} {self.student.get_full_name()} - {self.total_points}pts"

class WeeklyLeaderboardSnapshot(models.Model):
    """Historical weekly leaderboard data"""
    week_start = models.DateField()
    week_end = models.DateField()
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE, null=True, blank=True)
    
    # Top performers (JSON field to store top 10)
    top_students = models.JSONField(default=list, help_text="Top 10 students with scores")
    
    # Statistics
    total_participants = models.PositiveIntegerField(default=0)
    total_points_awarded = models.PositiveIntegerField(default=0)
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['week_start', 'grade']

# =====================================
# TEXTBOOK MODELS
# =====================================

class TextbookLibrary(models.Model):
    """Library of commonly used textbooks"""
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE)
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE)
    publisher = models.CharField(max_length=100)
    isbn = models.CharField(max_length=20, unique=True)
    cover_image = CloudinaryField('image', null=True, blank=True, folder='textbooks/')
    
    # Usage tracking
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['subject', 'grade', 'title']
        
    def __str__(self):
        return f"{self.title} - {self.grade.name}"

# =====================================
# ASSIGNMENT MODELS
# =====================================

class Homework(models.Model):
    """Homework assignments created by teachers - mandatory submissions"""
    AUTO_GRADE_SUPPORTED_TYPES = (
        'qcm_single',
        'qcm_multiple',
        'true_false',
        'fill_blank',
        'matching',
        'ordering'
    )
    # Relationships
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE, related_name='homework')
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE, related_name='homework')
    school_class = models.ForeignKey('schools.SchoolClass', on_delete=models.CASCADE, related_name='homework')
    lesson = models.ForeignKey('lessons.Lesson', on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_homework')
    
    # Homework Details
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    instructions = models.TextField()

    # Homework Format Types
    HOMEWORK_FORMATS = [
        ('mixed', 'مختلط - Format mixte'),
        ('qcm_only', 'أسئلة اختيار متعدد - QCM uniquement'),
        ('open_only', 'أسئلة مفتوحة - Questions ouvertes'),
        ('book_exercises', 'تمارين من الكتاب - Exercices du livre'),
        ('project', 'مشروع - Projet'),
        ('practical', 'تطبيقي - Travaux pratiques')
    ]
    homework_format = models.CharField(max_length=20, choices=HOMEWORK_FORMATS, default='mixed')

    # Homework Types
    HOMEWORK_TYPES = [
        ('homework', 'واجب منزلي - Devoir à domicile'),
        ('classwork', 'عمل في القسم - Travail en classe'),
        ('quiz', 'اختبار قصير - Quiz'),
        ('exam', 'امتحان - Examen'),
        ('project', 'مشروع - Projet')
    ]
    homework_type = models.CharField(max_length=20, choices=HOMEWORK_TYPES)
    
    # Timing & Settings
    assigned_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    estimated_duration = models.PositiveIntegerField(help_text="Minutes")
    
    # For timed assignments (quizzes/exams)
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Time limit in minutes")
    is_timed = models.BooleanField(default=False)
    
    # Grading
    total_points = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    auto_grade_qcm = models.BooleanField(default=True, help_text="Auto-grade QCM questions")
    
    # Additional Settings
    randomize_questions = models.BooleanField(default=False)
    show_results_immediately = models.BooleanField(default=False)
    allow_multiple_attempts = models.BooleanField(default=False)
    max_attempts = models.PositiveIntegerField(default=1)
    allow_late_submissions = models.BooleanField(default=True)
    late_penalty_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.school_class.name}"

    @property
    def is_overdue(self):
        return timezone.now() > self.due_date

    def recalculate_total_points(self):
        """
        Refresh the homework total points from all attached questions.
        Used when authors add/remove questions so the total remains accurate.
        """
        total = self.questions.aggregate(total=Sum('points'))['total'] or Decimal('0')
        self.total_points = total
        self.save(update_fields=['total_points', 'updated_at'])
        return self.total_points

    @property
    def submissions_count(self):
        return self.submissions.count()

class HomeworkReward(models.Model):
    """Reward configuration for specific homework"""
    homework = models.OneToOneField(Homework, on_delete=models.CASCADE, related_name='reward_config')
    
    # Base rewards
    completion_points = models.PositiveIntegerField(default=10)
    completion_coins = models.PositiveIntegerField(default=1)
    
    # Performance-based rewards
    perfect_score_bonus = models.PositiveIntegerField(default=20, help_text="100% score bonus")
    high_score_bonus = models.PositiveIntegerField(default=10, help_text=">=90% score bonus")
    
    # Time-based rewards
    early_submission_bonus = models.PositiveIntegerField(default=10)
    on_time_bonus = models.PositiveIntegerField(default=5)
    
    # Special multipliers
    difficulty_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    weekend_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.50)
    
    def __str__(self):
        return f"Homework Rewards for {self.homework.title}"

# =====================================
# EXERCISE MODELS (LESSON-BASED)
# =====================================

class Exercise(models.Model):
    """Optional exercises linked to lessons for practice - students get rewards but no penalties"""
    # Relationships
    lesson = models.ForeignKey('lessons.Lesson', on_delete=models.CASCADE, related_name='exercises')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_exercises')

    # Exercise Details
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    instructions = models.TextField(blank=True)

    # Exercise Format Types
    EXERCISE_FORMATS = [
        ('mixed', 'مختلط - Format mixte'),
        ('qcm_only', 'أسئلة اختيار متعدد - QCM uniquement'),
        ('open_only', 'أسئلة مفتوحة - Questions ouvertes'),
        ('practical', 'تطبيقي - Travaux pratiques'),
        ('interactive', 'تفاعلي - Interactif')
    ]
    exercise_format = models.CharField(max_length=20, choices=EXERCISE_FORMATS, default='mixed')

    # Difficulty and organization
    DIFFICULTY_CHOICES = [
        ('beginner', 'مبتدئ - Débutant'),
        ('intermediate', 'متوسط - Intermédiaire'),
        ('advanced', 'متقدم - Avancé'),
        ('expert', 'خبير - Expert')
    ]
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    order = models.PositiveIntegerField(default=0, help_text="Order within lesson")

    # Timing (optional)
    estimated_duration = models.PositiveIntegerField(null=True, blank=True, help_text="Estimated minutes to complete")
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Optional time limit in minutes")
    is_timed = models.BooleanField(default=False)

    # Scoring
    total_points = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    auto_grade = models.BooleanField(default=True, help_text="Auto-grade when possible")

    # Exercise Settings
    randomize_questions = models.BooleanField(default=False)
    show_results_immediately = models.BooleanField(default=True)
    allow_multiple_attempts = models.BooleanField(default=True)
    max_attempts = models.PositiveIntegerField(default=0, help_text="0 = unlimited attempts")

    # Availability
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    available_from = models.DateTimeField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)

    # Prerequisites
    prerequisite_exercises = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='unlocks_exercises')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['lesson', 'order', 'created_at']
        verbose_name = "Exercise"
        verbose_name_plural = "Exercises"

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"

    @property
    def completion_count(self):
        """Number of students who completed this exercise"""
        return self.exercise_submissions.filter(status='completed').count()

    @property
    def average_score(self):
        """Average score across all completions"""
        from django.db.models import Avg
        avg = self.exercise_submissions.filter(status='completed').aggregate(avg_score=Avg('total_score'))
        return avg['avg_score'] or 0

class ExerciseReward(models.Model):
    """Reward configuration for specific exercises"""
    exercise = models.OneToOneField(Exercise, on_delete=models.CASCADE, related_name='reward_config')

    # Base rewards for attempting/completing
    attempt_points = models.PositiveIntegerField(default=2, help_text="Points for starting exercise")
    completion_points = models.PositiveIntegerField(default=5, help_text="Points for completing exercise")
    completion_coins = models.PositiveIntegerField(default=1)

    # Performance-based rewards
    perfect_score_bonus = models.PositiveIntegerField(default=10, help_text="100% score bonus")
    high_score_bonus = models.PositiveIntegerField(default=5, help_text=">=80% score bonus")
    improvement_bonus = models.PositiveIntegerField(default=3, help_text="Score improvement bonus")

    # Streak rewards
    daily_streak_bonus = models.PositiveIntegerField(default=2, help_text="Bonus for daily exercise completion")
    lesson_completion_bonus = models.PositiveIntegerField(default=15, help_text="Bonus for completing all lesson exercises")

    # Special multipliers
    difficulty_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    first_attempt_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.50)

    # XP rewards
    base_xp = models.PositiveIntegerField(default=5)
    bonus_xp = models.PositiveIntegerField(default=10, help_text="XP for excellent performance")

    def __str__(self):
        return f"Rewards for {self.exercise.title}"

# =====================================
# QUESTION MODELS
# =====================================

class Question(models.Model):
    """Questions for homework, exercises, or standalone question bank"""
    # Question can belong to either homework OR exercise OR be standalone
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE, related_name='questions', null=True, blank=True)

    # For standalone questions (when both homework and exercise are null)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_questions', null=True, blank=True)
    subject = models.ForeignKey('schools.Subject', on_delete=models.SET_NULL, null=True, blank=True)
    grade = models.ForeignKey('schools.Grade', on_delete=models.SET_NULL, null=True, blank=True)

    # Question Types
    QUESTION_TYPES = [
        ('qcm_single', 'اختيار من متعدد (إجابة واحدة) - QCM choix unique'),
        ('qcm_multiple', 'اختيار من متعدد (عدة إجابات) - QCM choix multiples'),
        ('open_short', 'سؤال مفتوح قصير - Question ouverte courte'),
        ('open_long', 'سؤال مفتوح طويل - Question ouverte longue'),
        ('true_false', 'صواب/خطأ - Vrai/Faux'),
        ('fill_blank', 'املأ الفراغ - Compléter'),
        ('matching', 'مطابقة - Appariement'),
        ('ordering', 'ترتيب - Classement')
    ]
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    
    # Question Content
    question_text = models.TextField()
    question_text_arabic = models.TextField(blank=True)
    question_image = CloudinaryField('image', null=True, blank=True, folder='questions/')
    
    # Explanation/Solution
    explanation = models.TextField(blank=True, help_text="Explanation shown after answer")
    explanation_arabic = models.TextField(blank=True)
    
    # Scoring
    points = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)
    
    # Organization
    order = models.PositiveIntegerField(default=0)
    is_required = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        
    def __str__(self):
        if self.homework:
            return f"{self.homework.title} - Q{self.order}: {self.question_text[:50]}..."
        elif self.exercise:
            return f"{self.exercise.title} - Q{self.order}: {self.question_text[:50]}..."
        else:
            return f"Standalone - Q{self.order}: {self.question_text[:50]}..."

    def clean(self):
        """Ensure question belongs to exactly one context"""
        from django.core.exceptions import ValidationError
        contexts = [self.homework, self.exercise]
        non_null_contexts = [c for c in contexts if c is not None]

        if len(non_null_contexts) > 1:
            raise ValidationError("Question can only belong to homework OR exercise, not both.")

        if len(non_null_contexts) == 0 and not self.author:
            raise ValidationError("Question must belong to homework, exercise, or have an author for standalone.")

class QuestionChoice(models.Model):
    """Choices for QCM questions"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    
    choice_text = models.CharField(max_length=500)
    choice_text_arabic = models.CharField(max_length=500, blank=True)
    choice_image = CloudinaryField('image', null=True, blank=True, folder='choices/')
    
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.question} - {self.choice_text[:30]}..."

# =====================================
# ADVANCED QUESTION STRUCTURES
# - Fill in the Blanks
# - Ordering
# - Matching
# =====================================

class FillBlank(models.Model):
    """A blank within a fill-in-the-blanks question"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='blanks')
    order = models.PositiveIntegerField(default=1, help_text="Blank position (1-based)")
    label = models.CharField(max_length=50, blank=True, help_text="Optional label like B1, B2")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Blank {self.order} for {self.question}"

class FillBlankOption(models.Model):
    """Options for a specific blank; one must be correct"""
    blank = models.ForeignKey(FillBlank, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Blank {self.blank.order} - {self.option_text[:30]}..."

class OrderingItem(models.Model):
    """An item that must be ordered by the student"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='ordering_items')
    text = models.CharField(max_length=500)
    correct_position = models.PositiveIntegerField(help_text="Correct order position (1-based)")

    class Meta:
        ordering = ['correct_position']

    def __str__(self):
        return f"{self.correct_position}. {self.text[:40]}"

class MatchingPair(models.Model):
    """A correct left-right pair for matching questions"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='matching_pairs')
    left_text = models.CharField(max_length=300)
    right_text = models.CharField(max_length=300)
    order = models.PositiveIntegerField(default=0, help_text="Display order for authoring")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.left_text[:25]} ↔ {self.right_text[:25]}"

class BookExercise(models.Model):
    """Reference to exercises from textbooks"""
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='book_exercises')
    
    # Book Information
    book_title = models.CharField(max_length=200)
    book_title_arabic = models.CharField(max_length=200, blank=True)
    publisher = models.CharField(max_length=100, blank=True)
    isbn = models.CharField(max_length=20, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    
    # Exercise Reference
    chapter = models.CharField(max_length=100, help_text="Chapter name/number")
    chapter_arabic = models.CharField(max_length=100, blank=True)
    page_number = models.PositiveIntegerField(null=True, blank=True)
    exercise_number = models.CharField(max_length=50, help_text="e.g., 'Exercise 5', '5.2', 'A-1'")
    
    # Additional Instructions
    specific_questions = models.TextField(blank=True, help_text="e.g., 'Questions 1, 3, 5-8'")
    additional_notes = models.TextField(blank=True)
    
    # Book page image (optional)
    page_image = CloudinaryField('image', null=True, blank=True, folder='book_exercises/')
    
    # Scoring
    points = models.DecimalField(max_digits=4, decimal_places=2, default=5.00)
    
    def __str__(self):
        return f"{self.book_title} - Ch.{self.chapter} - Ex.{self.exercise_number}"

# =====================================
# SUBMISSION MODELS
# =====================================

class Submission(models.Model):
    """Student submissions for homework"""
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    
    # Submission Status
    STATUS_CHOICES = [
        ('draft', 'مسودة - Brouillon'),
        ('in_progress', 'قيد التقدم - En cours'),
        ('submitted', 'مُسلم - Soumis'), 
        ('late', 'متأخر - En retard'),
        ('auto_graded', 'مُصحح تلقائياً - Auto-corrigé'),
        ('manually_graded', 'مُصحح يدوياً - Corrigé manuellement')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_taken = models.PositiveIntegerField(null=True, blank=True, help_text="Minutes taken")
    
    # Attempt tracking
    attempt_number = models.PositiveIntegerField(default=1)
    is_late = models.BooleanField(default=False)
    
    # Scoring
    total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    auto_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="QCM auto-graded score")
    manual_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Manual grading score")
    
    # Rewards
    points_earned = models.PositiveIntegerField(default=0)
    coins_earned = models.PositiveIntegerField(default=0)
    bonus_points = models.PositiveIntegerField(default=0)
    rewards_calculated = models.BooleanField(default=False)
    
    # General feedback
    teacher_feedback = models.TextField(blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='graded_submissions')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['homework', 'student', 'attempt_number']
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.homework.title} - Attempt {self.attempt_number}"
    
    def save(self, *args, **kwargs):
        if self.submitted_at and self.homework.due_date:
            self.is_late = self.submitted_at > self.homework.due_date
        super().save(*args, **kwargs)

class QuestionAnswer(models.Model):
    """Student's answer to a specific question"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    
    # Different answer types
    text_answer = models.TextField(blank=True)  # For open questions
    selected_choices = models.ManyToManyField(QuestionChoice, blank=True)  # For QCM
    
    # Scoring
    is_correct = models.BooleanField(null=True, blank=True)  # For auto-gradable questions
    points_earned = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    teacher_feedback = models.TextField(blank=True)
    
    # Metadata
    answered_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['submission', 'question']
        
    def __str__(self):
        return f"{self.submission.student.get_full_name()} - {self.question}"

class AnswerFillBlankSelection(models.Model):
    """Student selection for a single blank in a fill-in-the-blanks question"""
    question_answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name='blank_selections')
    blank = models.ForeignKey(FillBlank, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(FillBlankOption, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)

    class Meta:
        unique_together = ['question_answer', 'blank']

class AnswerOrderingSelection(models.Model):
    """Student-selected position for an ordering item"""
    question_answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name='ordering_selections')
    item = models.ForeignKey(OrderingItem, on_delete=models.CASCADE)
    selected_position = models.PositiveIntegerField()
    is_correct = models.BooleanField(default=False)

    class Meta:
        unique_together = ['question_answer', 'item']

class AnswerMatchingSelection(models.Model):
    """Student matching choice: which right item matched to a given left"""
    question_answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name='matching_selections')
    left_pair = models.ForeignKey(MatchingPair, on_delete=models.CASCADE, related_name='as_left')
    selected_right_pair = models.ForeignKey(MatchingPair, on_delete=models.CASCADE, related_name='as_selected_right')
    is_correct = models.BooleanField(default=False)

    class Meta:
        unique_together = ['question_answer', 'left_pair']

class AnswerFile(models.Model):
    """Files uploaded as part of an answer"""
    question_answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name='files')
    file = CloudinaryField('file', folder='answer_files/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.filename} - {self.question_answer}"

class BookExerciseAnswer(models.Model):
    """Student's work on book exercises"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='book_exercise_answers')
    book_exercise = models.ForeignKey(BookExercise, on_delete=models.CASCADE)
    
    # Student's work
    work_description = models.TextField(blank=True, help_text="Description of work done")
    
    # Grading
    points_earned = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    teacher_feedback = models.TextField(blank=True)
    
    completed_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['submission', 'book_exercise']
        
    def __str__(self):
        return f"{self.submission.student.get_full_name()} - {self.book_exercise}"

class BookExerciseFile(models.Model):
    """Files for book exercise answers"""
    book_exercise_answer = models.ForeignKey(BookExerciseAnswer, on_delete=models.CASCADE, related_name='files')
    file = CloudinaryField('file', folder='book_exercise_files/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.filename} - {self.book_exercise_answer}"

# =====================================
# EXERCISE SUBMISSION MODELS
# =====================================

class ExerciseSubmission(models.Model):
    """Student submissions for exercises - track completion and rewards"""
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exercise_submissions')

    # Submission Status
    STATUS_CHOICES = [
        ('started', 'بدء - Commencé'),
        ('in_progress', 'قيد التقدم - En cours'),
        ('completed', 'مكتمل - Complété'),
        ('auto_graded', 'مُصحح تلقائياً - Auto-corrigé'),
        ('reviewed', 'مراجع - Révisé')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='started')

    # Timing
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_taken = models.PositiveIntegerField(null=True, blank=True, help_text="Minutes taken")

    # Attempt tracking
    attempt_number = models.PositiveIntegerField(default=1)
    is_best_score = models.BooleanField(default=True, help_text="Is this the student's best attempt?")

    # Scoring
    total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    auto_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    previous_best_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Rewards
    points_earned = models.PositiveIntegerField(default=0)
    coins_earned = models.PositiveIntegerField(default=0)
    xp_earned = models.PositiveIntegerField(default=0)
    bonus_points = models.PositiveIntegerField(default=0)
    rewards_calculated = models.BooleanField(default=False)

    # Progress tracking
    questions_answered = models.PositiveIntegerField(default=0)
    questions_correct = models.PositiveIntegerField(default=0)
    improvement_from_last = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Feedback
    auto_feedback = models.TextField(blank=True, help_text="Generated feedback based on performance")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['exercise', 'student', 'attempt_number']
        ordering = ['-created_at']
        verbose_name = "Exercise Submission"
        verbose_name_plural = "Exercise Submissions"

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.exercise.title} - Attempt {self.attempt_number}"

    def save(self, *args, **kwargs):
        # Calculate percentage score
        if self.total_score is not None and self.exercise.total_points:
            self.percentage_score = (self.total_score / self.exercise.total_points) * 100

        # Update best score flag
        if self.status == 'completed' and self.total_score is not None:
            # Check if this is the best score for this student on this exercise
            better_submissions = ExerciseSubmission.objects.filter(
                exercise=self.exercise,
                student=self.student,
                status='completed',
                total_score__gt=self.total_score
            ).exclude(id=self.id)

            if not better_submissions.exists():
                # This is the best score, mark others as not best
                ExerciseSubmission.objects.filter(
                    exercise=self.exercise,
                    student=self.student
                ).exclude(id=self.id).update(is_best_score=False)
                self.is_best_score = True
            else:
                self.is_best_score = False

        super().save(*args, **kwargs)

    @property
    def accuracy_percentage(self):
        """Calculate accuracy percentage"""
        if self.questions_answered > 0:
            return (self.questions_correct / self.questions_answered) * 100
        return 0

class ExerciseAnswer(models.Model):
    """Student's answer to a specific exercise question"""
    exercise_submission = models.ForeignKey(ExerciseSubmission, on_delete=models.CASCADE, related_name='exercise_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    # Different answer types
    text_answer = models.TextField(blank=True)  # For open questions
    selected_choices = models.ManyToManyField(QuestionChoice, blank=True)  # For QCM

    # Scoring
    is_correct = models.BooleanField(null=True, blank=True)  # For auto-gradable questions
    points_earned = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    is_partial_credit = models.BooleanField(default=False)

    # Timing
    time_spent = models.PositiveIntegerField(null=True, blank=True, help_text="Seconds spent on this question")
    answered_at = models.DateTimeField(auto_now=True)

    # Attempts (for questions allowing multiple tries)
    attempt_count = models.PositiveIntegerField(default=1)
    is_final_answer = models.BooleanField(default=True)

    # Learning analytics
    hint_used = models.BooleanField(default=False)
    help_requested = models.BooleanField(default=False)

    class Meta:
        unique_together = ['exercise_submission', 'question', 'attempt_count']
        ordering = ['question__order', 'attempt_count']

    def __str__(self):
        return f"{self.exercise_submission.student.get_full_name()} - {self.question} - Attempt {self.attempt_count}"

class ExerciseAnswerFile(models.Model):
    """Files uploaded as part of an exercise answer"""
    exercise_answer = models.ForeignKey(ExerciseAnswer, on_delete=models.CASCADE, related_name='files')
    file = CloudinaryField('file', folder='exercise_answer_files/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.filename} - {self.exercise_answer}"

# =====================================
# LESSON PROGRESS TRACKING MODELS
# =====================================

class LessonProgress(models.Model):
    """Track student progress for each lesson"""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progress',
        limit_choices_to={'role': 'STUDENT'}
    )
    lesson = models.ForeignKey('lessons.Lesson', on_delete=models.CASCADE, related_name='student_progress')

    # Progress status
    STATUS_CHOICES = [
        ('not_started', 'لم يبدأ - Non commencé'),
        ('in_progress', 'قيد التقدم - En cours'),
        ('completed', 'مكتمل - Complété'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')

    # Exercise completion tracking
    exercises_completed = models.PositiveIntegerField(default=0, help_text="Number of exercises completed")
    exercises_total = models.PositiveIntegerField(default=0, help_text="Total exercises in this lesson")
    completion_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Percentage of exercises completed"
    )

    # Score tracking
    average_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Average score across all completed exercises"
    )
    total_points_earned = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        help_text="Total points earned from all exercises"
    )
    total_points_possible = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        help_text="Total possible points from completed exercises"
    )

    # Accuracy tracking
    total_questions_answered = models.PositiveIntegerField(default=0)
    total_questions_correct = models.PositiveIntegerField(default=0)
    accuracy_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Percentage of correct answers"
    )

    # Time tracking
    total_time_spent = models.PositiveIntegerField(
        default=0,
        help_text="Total time spent in minutes"
    )

    # Timestamps
    first_viewed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When student first viewed the lesson page"
    )
    started_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When student started first exercise"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When student completed all exercises"
    )
    last_accessed = models.DateTimeField(auto_now=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'lesson']
        ordering = ['-last_accessed', '-created_at']
        verbose_name = "Lesson Progress"
        verbose_name_plural = "Lesson Progress Records"
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['lesson', 'status']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.lesson.title} ({self.completion_percentage}%)"

    def update_progress(self):
        """Recalculate all progress metrics based on exercise submissions"""
        from django.db.models import Avg, Sum, Count

        # Get all exercise submissions for this student and lesson
        submissions = ExerciseSubmission.objects.filter(
            student=self.student,
            exercise__lesson=self.lesson,
            status__in=['completed', 'auto_graded', 'reviewed']
        ).order_by('-created_at')

        # Get total exercises in lesson
        from homework.models import Exercise
        total_exercises = Exercise.objects.filter(
            lesson=self.lesson,
            is_published=True,
            is_active=True
        ).count()

        # Update exercises count
        self.exercises_total = total_exercises
        self.exercises_completed = submissions.values('exercise').distinct().count()

        # Calculate completion percentage
        if self.exercises_total > 0:
            self.completion_percentage = (self.exercises_completed / self.exercises_total) * 100
        else:
            self.completion_percentage = 0

        # Calculate scores - use best attempt for each exercise
        best_submissions = []
        for exercise_id in submissions.values_list('exercise_id', flat=True).distinct():
            exercise_submissions = submissions.filter(exercise_id=exercise_id)
            latest_completed = exercise_submissions.filter(status__in=['completed', 'reviewed']).order_by('-created_at').first()
            best = latest_completed or exercise_submissions.order_by('-total_score', '-created_at').first()
            if best:
                best_submissions.append(best)

        if best_submissions:
            # Average score
            total_score = sum(s.total_score or 0 for s in best_submissions)
            self.average_score = total_score / len(best_submissions) if best_submissions else 0

            # Total points
            self.total_points_earned = sum(s.total_score or 0 for s in best_submissions)
            self.total_points_possible = sum(s.exercise.total_points for s in best_submissions)

            # Accuracy
            self.total_questions_answered = sum(s.questions_answered for s in best_submissions)
            self.total_questions_correct = sum(s.questions_correct for s in best_submissions)
            if self.total_questions_answered > 0:
                self.accuracy_percentage = (self.total_questions_correct / self.total_questions_answered) * 100

            # Time spent
            self.total_time_spent = sum(s.time_taken or 0 for s in best_submissions)

        # Update status
        if self.exercises_completed == 0:
            self.status = 'not_started'
        elif self.exercises_completed < self.exercises_total:
            self.status = 'in_progress'
            if not self.started_at:
                self.started_at = timezone.now()
        else:
            self.status = 'completed'
            if not self.completed_at:
                self.completed_at = timezone.now()

        self.save()

    @property
    def is_completed(self):
        """Check if lesson is fully completed"""
        return self.status == 'completed'

    @property
    def next_exercise(self):
        """Get the next uncompleted exercise"""
        completed_exercises = ExerciseSubmission.objects.filter(
            student=self.student,
            exercise__lesson=self.lesson,
            status__in=['completed', 'auto_graded', 'reviewed']
        ).values_list('exercise_id', flat=True)

        from homework.models import Exercise
        return Exercise.objects.filter(
            lesson=self.lesson,
            is_published=True,
            is_active=True
        ).exclude(id__in=completed_exercises).order_by('order').first()
