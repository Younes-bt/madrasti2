from django.contrib import admin
from .models import (
    # Reward System Models
    RewardSettings, RewardType, StudentWallet, RewardTransaction,
    # Badge System Models
    Badge, StudentBadge,
    # Leaderboard Models
    Leaderboard, LeaderboardEntry, WeeklyLeaderboardSnapshot,
    # Textbook Models
    TextbookLibrary,
    # Exercise Models
    Exercise, ExerciseReward,
    # Homework Models (renamed from Assignment)
    Homework, HomeworkReward,
    # Question Models
    Question, QuestionChoice, BookExercise,
    # Submission Models
    Submission, QuestionAnswer, AnswerFile, BookExerciseAnswer, BookExerciseFile,
    # Exercise Submission Models
    ExerciseSubmission, ExerciseAnswer, ExerciseAnswerFile
)

# Reward System Admin
@admin.register(RewardSettings)
class RewardSettingsAdmin(admin.ModelAdmin):
    list_display = ['school', 'points_per_correct_qcm', 'points_per_assignment_completion', 'enable_leaderboard']
    list_filter = ['enable_leaderboard', 'enable_badges', 'enable_weekly_reset']
    fieldsets = (
        ('Point Values', {
            'fields': ('points_per_correct_qcm', 'points_per_assignment_completion', 'points_perfect_score',
                      'points_on_time_submission', 'points_early_submission')
        }),
        ('Penalties', {
            'fields': ('late_submission_penalty',)
        }),
        ('Conversion Rates', {
            'fields': ('points_to_coins_ratio',)
        }),
        ('Features', {
            'fields': ('enable_leaderboard', 'enable_badges', 'enable_weekly_reset')
        })
    )

@admin.register(RewardType)
class RewardTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_arabic', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'name_arabic']

@admin.register(StudentWallet)
class StudentWalletAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_points', 'total_coins', 'level', 'current_streak']
    list_filter = ['level', 'current_week', 'current_month']
    search_fields = ['student__username', 'student__first_name', 'student__last_name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(RewardTransaction)
class RewardTransactionAdmin(admin.ModelAdmin):
    list_display = ['student', 'transaction_type', 'points_earned', 'coins_earned', 'reason', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['student__username', 'reason']
    readonly_fields = ['created_at']

# Badge System Admin
@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_arabic', 'badge_type', 'rarity', 'is_active']
    list_filter = ['badge_type', 'rarity', 'is_active']
    search_fields = ['name', 'name_arabic']

@admin.register(StudentBadge)
class StudentBadgeAdmin(admin.ModelAdmin):
    list_display = ['student', 'badge', 'earned_at', 'earned_for']
    list_filter = ['badge', 'earned_at']
    search_fields = ['student__username', 'badge__name']

# Leaderboard Admin
@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'leaderboard_type', 'scope', 'start_date', 'end_date', 'is_active']
    list_filter = ['leaderboard_type', 'scope', 'is_active']
    search_fields = ['name']

@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ['student', 'leaderboard', 'current_rank', 'total_points', 'rank_change']
    list_filter = ['leaderboard', 'current_rank']
    search_fields = ['student__username']

@admin.register(WeeklyLeaderboardSnapshot)
class WeeklyLeaderboardSnapshotAdmin(admin.ModelAdmin):
    list_display = ['week_start', 'week_end', 'grade', 'total_participants', 'average_score']
    list_filter = ['week_start', 'grade']

# Textbook Admin
@admin.register(TextbookLibrary)
class TextbookLibraryAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'grade', 'publisher', 'is_active']
    list_filter = ['subject', 'grade', 'publisher', 'is_active']
    search_fields = ['title', 'title_arabic', 'isbn']

# Exercise Admin
class ExerciseQuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    fields = ['question_type', 'question_text', 'points', 'order']
    fk_name = 'exercise'

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'difficulty_level', 'exercise_format', 'is_published', 'created_by']
    list_filter = ['difficulty_level', 'exercise_format', 'is_published', 'lesson__subject', 'lesson__grade']
    search_fields = ['title', 'title_arabic', 'description']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ExerciseQuestionInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_arabic', 'description', 'instructions', 'lesson', 'created_by')
        }),
        ('Exercise Settings', {
            'fields': ('exercise_format', 'difficulty_level', 'order')
        }),
        ('Timing', {
            'fields': ('estimated_duration', 'is_timed', 'time_limit')
        }),
        ('Grading', {
            'fields': ('total_points', 'auto_grade')
        }),
        ('Settings', {
            'fields': ('randomize_questions', 'show_results_immediately', 'allow_multiple_attempts', 'max_attempts')
        }),
        ('Availability', {
            'fields': ('is_active', 'is_published', 'available_from', 'available_until')
        })
    )

@admin.register(ExerciseReward)
class ExerciseRewardAdmin(admin.ModelAdmin):
    list_display = ['exercise', 'completion_points', 'completion_coins', 'perfect_score_bonus']
    search_fields = ['exercise__title']

# Homework Admin (renamed from Assignment)
class HomeworkQuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    fields = ['question_type', 'question_text', 'points', 'order']
    fk_name = 'homework'

class BookExerciseInline(admin.TabularInline):
    model = BookExercise
    extra = 0
    fields = ['book_title', 'chapter', 'exercise_number', 'points']

@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'grade', 'school_class', 'teacher', 'homework_type', 'due_date', 'is_published']
    list_filter = ['homework_type', 'homework_format', 'subject', 'grade', 'is_published', 'due_date']
    search_fields = ['title', 'title_arabic', 'description']
    readonly_fields = ['assigned_date', 'created_at', 'updated_at']
    inlines = [HomeworkQuestionInline, BookExerciseInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_arabic', 'description', 'instructions', 'teacher')
        }),
        ('Classification', {
            'fields': ('subject', 'grade', 'school_class', 'lesson', 'homework_type', 'homework_format')
        }),
        ('Timing', {
            'fields': ('due_date', 'estimated_duration', 'is_timed', 'time_limit')
        }),
        ('Grading', {
            'fields': ('total_points', 'auto_grade_qcm')
        }),
        ('Settings', {
            'fields': ('randomize_questions', 'show_results_immediately', 'allow_multiple_attempts',
                      'max_attempts', 'allow_late_submissions', 'late_penalty_percentage')
        }),
        ('Status', {
            'fields': ('is_active', 'is_published')
        })
    )

@admin.register(HomeworkReward)
class HomeworkRewardAdmin(admin.ModelAdmin):
    list_display = ['homework', 'completion_points', 'completion_coins', 'perfect_score_bonus']
    search_fields = ['homework__title']

# Question Admin
class QuestionChoiceInline(admin.TabularInline):
    model = QuestionChoice
    extra = 0
    fields = ['choice_text', 'is_correct', 'order']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['get_context', 'question_type', 'question_text', 'points', 'order']
    list_filter = ['question_type']
    search_fields = ['question_text', 'question_text_arabic']
    inlines = [QuestionChoiceInline]

    def get_context(self, obj):
        if obj.homework:
            return f"Homework: {obj.homework.title}"
        elif obj.exercise:
            return f"Exercise: {obj.exercise.title}"
        else:
            return "Standalone"
    get_context.short_description = 'Context'

@admin.register(QuestionChoice)
class QuestionChoiceAdmin(admin.ModelAdmin):
    list_display = ['question', 'choice_text', 'is_correct', 'order']
    list_filter = ['is_correct']
    search_fields = ['choice_text', 'choice_text_arabic']

@admin.register(BookExercise)
class BookExerciseAdmin(admin.ModelAdmin):
    list_display = ['homework', 'book_title', 'chapter', 'exercise_number', 'points']
    list_filter = ['homework__subject', 'homework__grade']
    search_fields = ['book_title', 'chapter', 'exercise_number']

# Submission Admin
class QuestionAnswerInline(admin.TabularInline):
    model = QuestionAnswer
    extra = 0
    fields = ['question', 'text_answer', 'is_correct', 'points_earned']
    readonly_fields = ['answered_at']

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['student', 'homework', 'status', 'total_score', 'submitted_at', 'is_late']
    list_filter = ['status', 'is_late', 'homework__subject', 'homework__grade']
    search_fields = ['student__username', 'homework__title']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'submitted_at']
    inlines = [QuestionAnswerInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('homework', 'student', 'status', 'attempt_number')
        }),
        ('Timing', {
            'fields': ('started_at', 'submitted_at', 'time_taken', 'is_late')
        }),
        ('Scoring', {
            'fields': ('total_score', 'auto_score', 'manual_score')
        }),
        ('Rewards', {
            'fields': ('points_earned', 'coins_earned', 'bonus_points', 'rewards_calculated')
        }),
        ('Feedback', {
            'fields': ('teacher_feedback', 'graded_at', 'graded_by')
        })
    )

@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ['submission', 'question', 'is_correct', 'points_earned', 'answered_at']
    list_filter = ['is_correct', 'question__question_type']
    search_fields = ['submission__student__username', 'text_answer']

@admin.register(AnswerFile)
class AnswerFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'question_answer', 'file_type', 'uploaded_at', 'uploaded_by']
    list_filter = ['file_type', 'uploaded_at']
    search_fields = ['filename', 'question_answer__submission__student__username']

@admin.register(BookExerciseAnswer)
class BookExerciseAnswerAdmin(admin.ModelAdmin):
    list_display = ['submission', 'book_exercise', 'points_earned', 'completed_at']
    list_filter = ['book_exercise__homework__subject']
    search_fields = ['submission__student__username', 'work_description']

# Exercise Submission Admin
class ExerciseAnswerInline(admin.TabularInline):
    model = ExerciseAnswer
    extra = 0
    fields = ['question', 'text_answer', 'is_correct', 'points_earned']
    readonly_fields = ['answered_at']

@admin.register(ExerciseSubmission)
class ExerciseSubmissionAdmin(admin.ModelAdmin):
    list_display = ['student', 'exercise', 'status', 'total_score', 'percentage_score', 'completed_at', 'is_best_score']
    list_filter = ['status', 'exercise__difficulty_level', 'exercise__lesson__subject', 'is_best_score']
    search_fields = ['student__username', 'exercise__title']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'completed_at', 'percentage_score']
    inlines = [ExerciseAnswerInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('exercise', 'student', 'status', 'attempt_number', 'is_best_score')
        }),
        ('Timing', {
            'fields': ('started_at', 'completed_at', 'time_taken')
        }),
        ('Scoring', {
            'fields': ('total_score', 'percentage_score', 'auto_score', 'previous_best_score')
        }),
        ('Progress', {
            'fields': ('questions_answered', 'questions_correct', 'improvement_from_last')
        }),
        ('Rewards', {
            'fields': ('points_earned', 'coins_earned', 'xp_earned', 'bonus_points', 'rewards_calculated')
        }),
        ('Feedback', {
            'fields': ('auto_feedback',)
        })
    )

@admin.register(ExerciseAnswer)
class ExerciseAnswerAdmin(admin.ModelAdmin):
    list_display = ['exercise_submission', 'question', 'is_correct', 'points_earned', 'attempt_count', 'answered_at']
    list_filter = ['is_correct', 'question__question_type', 'attempt_count', 'hint_used']
    search_fields = ['exercise_submission__student__username', 'text_answer']

@admin.register(ExerciseAnswerFile)
class ExerciseAnswerFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'exercise_answer', 'file_type', 'uploaded_at', 'uploaded_by']
    list_filter = ['file_type', 'uploaded_at']
    search_fields = ['filename', 'exercise_answer__exercise_submission__student__username']

@admin.register(BookExerciseFile)
class BookExerciseFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'book_exercise_answer', 'file_type', 'uploaded_at', 'uploaded_by']
    list_filter = ['file_type', 'uploaded_at']
    search_fields = ['filename', 'book_exercise_answer__submission__student__username']
