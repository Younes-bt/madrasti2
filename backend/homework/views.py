# homework/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg, Count
from django.utils import timezone
from datetime import timedelta

from .models import (
    # Reward Models
    RewardSettings, RewardType, StudentWallet, RewardTransaction,

    # Badge Models
    Badge, StudentBadge,

    # Leaderboard Models
    Leaderboard, LeaderboardEntry, WeeklyLeaderboardSnapshot,

    # Textbook Models
    TextbookLibrary,

    # Exercise Models
    Exercise, ExerciseReward,

    # Homework Models (renamed from Assignment)
    Homework, HomeworkReward, Question, QuestionChoice, BookExercise,

    # Submission Models
    Submission, QuestionAnswer, AnswerFile, BookExerciseAnswer, BookExerciseFile,

    # Exercise Submission Models
    ExerciseSubmission, ExerciseAnswer, ExerciseAnswerFile
)

from .serializers import (
    # Reward Serializers
    RewardSettingsSerializer, RewardTypeSerializer, StudentWalletSerializer, 
    RewardTransactionSerializer,
    
    # Badge Serializers
    BadgeSerializer, StudentBadgeSerializer,
    
    # Leaderboard Serializers
    LeaderboardSerializer, LeaderboardEntrySerializer, WeeklyLeaderboardSnapshotSerializer,
    
    # Textbook Serializers
    TextbookLibrarySerializer,

    # Exercise Serializers
    ExerciseCreateSerializer, ExerciseDetailSerializer,
    
    # Homework Serializers (renamed from Assignment)
    HomeworkListSerializer, HomeworkDetailSerializer, HomeworkCreateSerializer,
    HomeworkRewardSerializer, HomeworkStatisticsSerializer, HomeworkDuplicateSerializer,
    
    # Question Serializers
    QuestionSerializer, QuestionCreateSerializer, QuestionChoiceSerializer,
    BookExerciseSerializer, BulkQuestionCreateSerializer,
    
    # Submission Serializers
    SubmissionListSerializer, SubmissionDetailSerializer, SubmissionCreateSerializer,
    SubmissionGradeSerializer, QuestionAnswerSerializer, QuestionAnswerCreateSerializer,
    BookExerciseAnswerSerializer, AnswerFileSerializer, BookExerciseFileSerializer,
    
    # Statistics Serializers
    StudentProgressSerializer
)

# =====================================
# REWARD SYSTEM VIEWS
# =====================================

class RewardSettingsViewSet(viewsets.ModelViewSet):
    queryset = RewardSettings.objects.all()
    serializer_class = RewardSettingsSerializer
    permission_classes = [IsAuthenticated]

class StudentWalletViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentWalletSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT':
            return StudentWallet.objects.filter(student=user)
        elif user.role in ['TEACHER', 'ADMIN', 'STAFF']:
            return StudentWallet.objects.all()
        elif user.role == 'PARENT':
            # Parent can see their children's wallets
            return StudentWallet.objects.filter(student__role='STUDENT')  # Add parent-child logic
        return StudentWallet.objects.none()
    
    @action(detail=False, methods=['get'])
    def my_wallet(self, request):
        """Get current student's wallet"""
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students have wallets'}, status=400)
        
        wallet, created = StudentWallet.objects.get_or_create(student=request.user)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)

class RewardTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RewardTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT':
            return RewardTransaction.objects.filter(student=user)
        elif user.role in ['TEACHER', 'ADMIN', 'STAFF']:
            return RewardTransaction.objects.all()
        return RewardTransaction.objects.none()

# =====================================
# BADGE SYSTEM VIEWS
# =====================================

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.filter(is_active=True)
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]

class StudentBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentBadgeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT':
            return StudentBadge.objects.filter(student=user)
        elif user.role in ['TEACHER', 'ADMIN', 'STAFF']:
            return StudentBadge.objects.all()
        return StudentBadge.objects.none()

# =====================================
# LEADERBOARD VIEWS
# =====================================

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Leaderboard.objects.filter(is_active=True)
    
    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Get current weekly leaderboard"""
        grade_id = request.query_params.get('grade')
        class_id = request.query_params.get('class')
        
        # Get or create current week leaderboard
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        leaderboard = Leaderboard.objects.filter(
            leaderboard_type='weekly',
            start_date=week_start,
            end_date=week_end,
            is_active=True
        )
        
        if grade_id:
            leaderboard = leaderboard.filter(grade_id=grade_id)
        if class_id:
            leaderboard = leaderboard.filter(school_class_id=class_id)
        
        leaderboard = leaderboard.first()
        
        if leaderboard:
            entries = LeaderboardEntry.objects.filter(
                leaderboard=leaderboard
            ).order_by('current_rank')[:10]  # Top 10
            
            return Response({
                'leaderboard': self.get_serializer(leaderboard).data,
                'entries': LeaderboardEntrySerializer(entries, many=True).data
            })
        
        return Response({'message': 'No leaderboard found'}, status=404)

# =====================================
# TEXTBOOK VIEWS
# =====================================

class TextbookLibraryViewSet(viewsets.ModelViewSet):
    queryset = TextbookLibrary.objects.filter(is_active=True)
    serializer_class = TextbookLibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        subject_id = self.request.query_params.get('subject')
        grade_id = self.request.query_params.get('grade')
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        
        return queryset

# =====================================
# EXERCISE VIEWS
# =====================================

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ExerciseCreateSerializer
        return ExerciseDetailSerializer

    def get_queryset(self):
        queryset = Exercise.objects.all()
        lesson_id = self.request.query_params.get('lesson')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset

# =====================================
# HOMEWORK VIEWS (renamed from ASSIGNMENT)
# =====================================

class HomeworkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HomeworkListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return HomeworkCreateSerializer
        return HomeworkDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Homework.objects.all()
        
        if user.role == 'STUDENT':
            # Students see assignments for their class
            queryset = queryset.filter(school_class__students=user, is_published=True)
        elif user.role == 'TEACHER':
            # Teachers see their own assignments
            queryset = queryset.filter(teacher=user)
        elif user.role == 'PARENT':
            # Parents see their children's assignments
            queryset = queryset.filter(school_class__students__role='STUDENT', is_published=True)
        elif user.role in ['ADMIN', 'STAFF']:
            # Admin/Staff see all assignments
            queryset = queryset.all()
        
        # Filter by parameters
        subject_id = self.request.query_params.get('subject')
        grade_id = self.request.query_params.get('grade')
        class_id = self.request.query_params.get('class')
        homework_type = self.request.query_params.get('type')
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        if class_id:
            queryset = queryset.filter(school_class_id=class_id)
        if homework_type:
            queryset = queryset.filter(homework_type=homework_type)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish an assignment"""
        homework = self.get_object()
        if request.user != homework.teacher and request.user.role not in ['ADMIN', 'STAFF']:
            return Response({'error': 'Permission denied'}, status=403)
        
        homework.is_published = True
        homework.save()
        
        return Response({'message': 'Homework published successfully'})
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get assignment statistics"""
        homework = self.get_object()
        
        # Only teacher, admin, staff can view statistics
        if request.user != homework.teacher and request.user.role not in ['ADMIN', 'STAFF']:
            return Response({'error': 'Permission denied'}, status=403)
        
        submissions = Submission.objects.filter(homework=homework)
        
        stats = {
            'total_students': homework.school_class.students.count() if hasattr(homework.school_class, 'students') else 0,
            'submitted_count': submissions.filter(status__in=['submitted', 'auto_graded', 'manually_graded']).count(),
            'pending_count': submissions.filter(status__in=['draft', 'in_progress']).count(),
            'late_count': submissions.filter(is_late=True).count(),
            'average_score': submissions.aggregate(avg=Avg('total_score'))['avg'] or 0,
            'completion_rate': 0
        }
        
        if stats['total_students'] > 0:
            stats['completion_rate'] = (stats['submitted_count'] / stats['total_students']) * 100
        
        serializer = HomeworkStatisticsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an assignment"""
        homework = self.get_object()
        serializer = HomeworkDuplicateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create duplicate assignment
            new_homework = Homework.objects.create(
                title=serializer.validated_data['new_title'],
                title_arabic=homework.title_arabic,
                description=homework.description,
                instructions=homework.instructions,
                subject=homework.subject,
                grade=homework.grade,
                school_class_id=serializer.validated_data['school_class_id'],
                lesson=homework.lesson,
                teacher=request.user,
                homework_format=homework.homework_format,
                homework_type=homework.homework_type,
                due_date=serializer.validated_data['new_due_date'],
                estimated_duration=homework.estimated_duration,
                time_limit=homework.time_limit,
                is_timed=homework.is_timed,
                total_points=homework.total_points,
                auto_grade_qcm=homework.auto_grade_qcm,
                randomize_questions=homework.randomize_questions,
                show_results_immediately=homework.show_results_immediately,
                allow_multiple_attempts=homework.allow_multiple_attempts,
                max_attempts=homework.max_attempts,
                allow_late_submissions=homework.allow_late_submissions,
                late_penalty_percentage=homework.late_penalty_percentage,
            )
            
            # Duplicate questions
            for question in homework.questions.all():
                new_question = Question.objects.create(
                    homework=new_homework,
                    question_type=question.question_type,
                    question_text=question.question_text,
                    question_text_arabic=question.question_text_arabic,
                    question_image=question.question_image,
                    explanation=question.explanation,
                    explanation_arabic=question.explanation_arabic,
                    points=question.points,
                    order=question.order,
                    is_required=question.is_required,
                )
                
                # Duplicate choices
                for choice in question.choices.all():
                    QuestionChoice.objects.create(
                        question=new_question,
                        choice_text=choice.choice_text,
                        choice_text_arabic=choice.choice_text_arabic,
                        choice_image=choice.choice_image,
                        is_correct=choice.is_correct,
                        order=choice.order,
                    )
            
            # Duplicate book exercises
            for book_exercise in homework.book_exercises.all():
                BookExercise.objects.create(
                    homework=new_homework,
                    book_title=book_exercise.book_title,
                    book_title_arabic=book_exercise.book_title_arabic,
                    publisher=book_exercise.publisher,
                    isbn=book_exercise.isbn,
                    edition=book_exercise.edition,
                    chapter=book_exercise.chapter,
                    chapter_arabic=book_exercise.chapter_arabic,
                    page_number=book_exercise.page_number,
                    exercise_number=book_exercise.exercise_number,
                    specific_questions=book_exercise.specific_questions,
                    additional_notes=book_exercise.additional_notes,
                    page_image=book_exercise.page_image,
                    points=book_exercise.points,
                )
            
            # Duplicate reward config
            if hasattr(homework, 'reward_config'):
                HomeworkReward.objects.create(
                    homework=new_homework,
                    completion_points=homework.reward_config.completion_points,
                    completion_coins=homework.reward_config.completion_coins,
                    perfect_score_bonus=homework.reward_config.perfect_score_bonus,
                    high_score_bonus=homework.reward_config.high_score_bonus,
                    early_submission_bonus=homework.reward_config.early_submission_bonus,
                    on_time_bonus=homework.reward_config.on_time_bonus,
                    difficulty_multiplier=homework.reward_config.difficulty_multiplier,
                    weekend_multiplier=homework.reward_config.weekend_multiplier,
                )
            
            return Response({'message': 'Homework duplicated successfully', 'id': new_homework.id})
        
        return Response(serializer.errors, status=400)

# =====================================
# QUESTION VIEWS  
# =====================================

class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Question.objects.all()
        homework_id = self.request.query_params.get('homework')
        exercise_id = self.request.query_params.get('exercise')

        if homework_id:
            queryset = queryset.filter(homework_id=homework_id)
        elif exercise_id:
            queryset = queryset.filter(exercise_id=exercise_id)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuestionCreateSerializer
        return QuestionSerializer
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Create multiple questions at once"""
        serializer = BulkQuestionCreateSerializer(data=request.data)
        if serializer.is_valid():
            questions = serializer.save()
            return Response({
                'message': f'{len(questions)} questions created successfully',
                'question_ids': [q.id for q in questions]
            })
        return Response(serializer.errors, status=400)

class BookExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = BookExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        homework_id = self.request.query_params.get('homework')
        if homework_id:
            return BookExercise.objects.filter(homework_id=homework_id)
        return BookExercise.objects.all()

# =====================================
# SUBMISSION VIEWS
# =====================================

class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubmissionListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SubmissionCreateSerializer
        elif self.action == 'grade':
            return SubmissionGradeSerializer
        return SubmissionDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Submission.objects.all()
        
        if user.role == 'STUDENT':
            queryset = queryset.filter(student=user)
        elif user.role == 'TEACHER':
            queryset = queryset.filter(homework__teacher=user)
        elif user.role in ['ADMIN', 'STAFF']:
            queryset = queryset.all()
        elif user.role == 'PARENT':
            # Parents see their children's submissions
            queryset = queryset.filter(student__role='STUDENT')  # Add parent-child logic
        
        # Filters
        homework_id = self.request.query_params.get('homework')
        status_filter = self.request.query_params.get('status')
        
        if homework_id:
            queryset = queryset.filter(homework_id=homework_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start an assignment (create submission)"""
        homework = get_object_or_404(Homework, pk=pk)
        
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students can start assignments'}, status=403)
        
        # Check if assignment is published and not overdue
        if not homework.is_published:
            return Response({'error': 'Homework not published'}, status=400)
        
        # Check if student already has a submission
        existing_submission = Submission.objects.filter(
            homework=homework,
            student=request.user
        ).first()
        
        if existing_submission and not homework.allow_multiple_attempts:
            return Response({'error': 'Homework already started'}, status=400)
        
        # Create new submission
        attempt_number = 1
        if existing_submission:
            attempt_number = existing_submission.attempt_number + 1
            if homework.max_attempts > 0 and attempt_number > homework.max_attempts:
                return Response({'error': 'Maximum attempts reached'}, status=400)
        
        submission = Submission.objects.create(
            homework=homework,
            student=request.user,
            status='in_progress',
            started_at=timezone.now(),
            attempt_number=attempt_number
        )
        
        serializer = SubmissionDetailSerializer(submission)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit an assignment"""
        submission = self.get_object()
        
        if request.user != submission.student:
            return Response({'error': 'Permission denied'}, status=403)
        
        if submission.status in ['submitted', 'auto_graded', 'manually_graded']:
            return Response({'error': 'Homework already submitted'}, status=400)
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        
        # Calculate time taken
        if submission.started_at:
            time_diff = submission.submitted_at - submission.started_at
            submission.time_taken = int(time_diff.total_seconds() / 60)  # Minutes
        
        # Check if late
        if submission.submitted_at > submission.homework.due_date:
            submission.is_late = True
            submission.status = 'late'
        
        submission.save()
        
        # Auto-grade QCM questions if enabled
        if submission.homework.auto_grade_qcm:
            self._auto_grade_submission(submission)
        
        return Response({'message': 'Homework submitted successfully'})
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        """Grade a submission (teacher only)"""
        submission = self.get_object()
        
        if request.user != submission.homework.teacher and request.user.role not in ['ADMIN', 'STAFF']:
            return Response({'error': 'Permission denied'}, status=403)
        
        serializer = SubmissionGradeSerializer(submission, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            submission = serializer.save()
            
            # Calculate rewards if not already calculated
            if not submission.rewards_calculated:
                self._calculate_rewards(submission)
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def _auto_grade_submission(self, submission):
        """Auto-grade QCM questions in a submission"""
        auto_score = 0
        
        for answer in submission.answers.all():
            if answer.question.question_type in ['qcm_single', 'qcm_multiple', 'true_false']:
                correct_choices = answer.question.choices.filter(is_correct=True)
                selected_choices = answer.selected_choices.all()
                
                if answer.question.question_type == 'qcm_single':
                    # Single choice: must select exactly one correct answer
                    if (len(selected_choices) == 1 and 
                        selected_choices.first() in correct_choices):
                        answer.is_correct = True
                        answer.points_earned = answer.question.points
                        auto_score += float(answer.question.points)
                    else:
                        answer.is_correct = False
                        answer.points_earned = 0
                
                elif answer.question.question_type == 'qcm_multiple':
                    # Multiple choice: must select all correct answers and no incorrect ones
                    if (set(selected_choices) == set(correct_choices)):
                        answer.is_correct = True
                        answer.points_earned = answer.question.points
                        auto_score += float(answer.question.points)
                    else:
                        answer.is_correct = False
                        answer.points_earned = 0
                
                answer.save()
        
        submission.auto_score = auto_score
        if not submission.manual_score:
            submission.total_score = auto_score
        else:
            submission.total_score = auto_score + float(submission.manual_score)
        
        submission.status = 'auto_graded'
        submission.save()
    
    def _calculate_rewards(self, submission):
        """Calculate and award rewards for a submission"""
        if submission.status not in ['submitted', 'auto_graded', 'manually_graded']:
            return
        
        homework = submission.homework
        reward_config = getattr(homework, 'reward_config', None)
        
        if not reward_config:
            return
        
        points = 0
        coins = 0
        
        # Base completion reward
        points += reward_config.completion_points
        coins += reward_config.completion_coins
        
        # Performance bonus
        if submission.total_score and homework.total_points:
            score_percentage = (float(submission.total_score) / float(homework.total_points)) * 100
            
            if score_percentage >= 100:
                points += reward_config.perfect_score_bonus
            elif score_percentage >= 90:
                points += reward_config.high_score_bonus
        
        # Time bonus
        if not submission.is_late:
            points += reward_config.on_time_bonus
            
            # Early submission bonus (>24h early)
            if submission.submitted_at and homework.due_date:
                time_diff = homework.due_date - submission.submitted_at
                if time_diff.total_seconds() > 86400:  # 24 hours
                    points += reward_config.early_submission_bonus
        
        # Apply multipliers
        points = int(points * float(reward_config.difficulty_multiplier))
        
        # Weekend bonus
        if homework.assigned_date.weekday() >= 5:  # Saturday/Sunday
            points = int(points * float(reward_config.weekend_multiplier))
        
        # Save rewards
        submission.points_earned = points
        submission.coins_earned = coins
        submission.rewards_calculated = True
        submission.save()
        
        # Award to student wallet
        self._award_to_student(submission)
    
    def _award_to_student(self, submission):
        """Award calculated rewards to student"""
        wallet, created = StudentWallet.objects.get_or_create(student=submission.student)
        
        # Add to totals
        wallet.total_points += submission.points_earned
        wallet.total_coins += submission.coins_earned
        wallet.weekly_points += submission.points_earned
        wallet.assignments_completed += 1
        
        if submission.total_score == submission.homework.total_points:
            wallet.perfect_scores += 1
        
        if not submission.is_late:
            # Update streaks logic here
            pass
        
        wallet.save()
        
        # Create transaction record
        RewardTransaction.objects.create(
            student=submission.student,
            homework=submission.homework,
            submission=submission,
            transaction_type='earned',
            points_earned=submission.points_earned,
            coins_earned=submission.coins_earned,
            reason=f"Completed homework: {submission.homework.title}"
        )

# =====================================
# ANSWER VIEWS
# =====================================

class QuestionAnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuestionAnswerCreateSerializer
        return QuestionAnswerSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = QuestionAnswer.objects.all()
        
        if user.role == 'STUDENT':
            queryset = queryset.filter(submission__student=user)
        elif user.role == 'TEACHER':
            queryset = queryset.filter(submission__homework__teacher=user)
        elif user.role in ['ADMIN', 'STAFF']:
            queryset = queryset.all()
        
        submission_id = self.request.query_params.get('submission')
        if submission_id:
            queryset = queryset.filter(submission_id=submission_id)
        
        return queryset

class BookExerciseAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = BookExerciseAnswerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = BookExerciseAnswer.objects.all()
        
        if user.role == 'STUDENT':
            queryset = queryset.filter(submission__student=user)
        elif user.role == 'TEACHER':
            queryset = queryset.filter(submission__homework__teacher=user)
        elif user.role in ['ADMIN', 'STAFF']:
            queryset = queryset.all()
        
        submission_id = self.request.query_params.get('submission')
        if submission_id:
            queryset = queryset.filter(submission_id=submission_id)
        
        return queryset
