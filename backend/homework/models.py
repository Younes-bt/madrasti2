# homework/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from cloudinary.models import CloudinaryField
import json

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
    assignment = models.ForeignKey('Assignment', on_delete=models.CASCADE, null=True, blank=True)
    submission = models.ForeignKey('Submission', on_delete=models.CASCADE, null=True, blank=True)
    
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
    assignment = models.ForeignKey('Assignment', on_delete=models.SET_NULL, null=True, blank=True)
    submission = models.ForeignKey('Submission', on_delete=models.SET_NULL, null=True, blank=True)
    
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

class Assignment(models.Model):
    """Main assignment model with different question types"""
    # Relationships
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE, related_name='assignments')
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE, related_name='assignments') 
    school_class = models.ForeignKey('schools.SchoolClass', on_delete=models.CASCADE, related_name='assignments')
    lesson = models.ForeignKey('lessons.Lesson', on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_assignments')
    
    # Assignment Details
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    instructions = models.TextField()
    
    # Assignment Format Types
    ASSIGNMENT_FORMATS = [
        ('mixed', 'مختلط - Format mixte'),           
        ('qcm_only', 'أسئلة اختيار متعدد - QCM uniquement'),
        ('open_only', 'أسئلة مفتوحة - Questions ouvertes'),
        ('book_exercises', 'تمارين من الكتاب - Exercices du livre'),
        ('project', 'مشروع - Projet'),
        ('practical', 'تطبيقي - Travaux pratiques')
    ]
    assignment_format = models.CharField(max_length=20, choices=ASSIGNMENT_FORMATS, default='mixed')
    
    # Assignment Types
    ASSIGNMENT_TYPES = [
        ('homework', 'واجب منزلي - Devoir à domicile'),
        ('classwork', 'عمل في القسم - Travail en classe'),
        ('quiz', 'اختبار قصير - Quiz'),
        ('exam', 'امتحان - Examen'),
        ('project', 'مشروع - Projet')
    ]
    assignment_type = models.CharField(max_length=20, choices=ASSIGNMENT_TYPES)
    
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
    
    @property
    def submissions_count(self):
        return self.submissions.count()

class AssignmentReward(models.Model):
    """Reward configuration for specific assignments"""
    assignment = models.OneToOneField(Assignment, on_delete=models.CASCADE, related_name='reward_config')
    
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
        return f"Rewards for {self.assignment.title}"

# =====================================
# QUESTION MODELS
# =====================================

class Question(models.Model):
    """Questions for assignments"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='questions')
    
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
        return f"{self.assignment.title} - Q{self.order}: {self.question_text[:50]}..."

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

class BookExercise(models.Model):
    """Reference to exercises from textbooks"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='book_exercises')
    
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
    """Student submissions for assignments"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
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
        unique_together = ['assignment', 'student', 'attempt_number']
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.assignment.title} - Attempt {self.attempt_number}"
    
    def save(self, *args, **kwargs):
        if self.submitted_at and self.assignment.due_date:
            self.is_late = self.submitted_at > self.assignment.due_date
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