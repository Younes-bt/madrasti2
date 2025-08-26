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
    
    # Assignment Models
    Assignment, AssignmentReward, Question, QuestionChoice, BookExercise,
    
    # Submission Models
    Submission, QuestionAnswer, AnswerFile, BookExerciseAnswer, BookExerciseFile
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
    
    # Assignment Serializers
    AssignmentListSerializer, AssignmentDetailSerializer, AssignmentCreateSerializer,
    AssignmentRewardSerializer, AssignmentStatisticsSerializer, AssignmentDuplicateSerializer,
    
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
# ASSIGNMENT VIEWS
# =====================================

class AssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AssignmentListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return AssignmentCreateSerializer
        return AssignmentDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Assignment.objects.all()
        
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
        assignment_type = self.request.query_params.get('type')
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        if class_id:
            queryset = queryset.filter(school_class_id=class_id)
        if assignment_type:
            queryset = queryset.filter(assignment_type=assignment_type)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish an assignment"""
        assignment = self.get_object()
        if request.user != assignment.teacher and request.user.role not in ['ADMIN', 'STAFF']:
            return Response({'error': 'Permission denied'}, status=403)
        
        assignment.is_published = True
        assignment.save()
        
        return Response({'message': 'Assignment published successfully'})
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get assignment statistics"""
        assignment = self.get_object()
        
        # Only teacher, admin, staff can view statistics
        if request.user != assignment.teacher and request.user.role not in ['ADMIN', 'STAFF']:
            return Response({'error': 'Permission denied'}, status=403)
        
        submissions = Submission.objects.filter(assignment=assignment)
        
        stats = {
            'total_students': assignment.school_class.students.count() if hasattr(assignment.school_class, 'students') else 0,
            'submitted_count': submissions.filter(status__in=['submitted', 'auto_graded', 'manually_graded']).count(),
            'pending_count': submissions.filter(status__in=['draft', 'in_progress']).count(),
            'late_count': submissions.filter(is_late=True).count(),
            'average_score': submissions.aggregate(avg=Avg('total_score'))['avg'] or 0,
            'completion_rate': 0
        }
        
        if stats['total_students'] > 0:
            stats['completion_rate'] = (stats['submitted_count'] / stats['total_students']) * 100
        
        serializer = AssignmentStatisticsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an assignment"""
        assignment = self.get_object()
        serializer = AssignmentDuplicateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create duplicate assignment
            new_assignment = Assignment.objects.create(
                title=serializer.validated_data['new_title'],
                title_arabic=assignment.title_arabic,
                description=assignment.description,
                instructions=assignment.instructions,
                subject=assignment.subject,
                grade=assignment.grade,
                school_class_id=serializer.validated_data['school_class_id'],
                lesson=assignment.lesson,
                teacher=request.user,
                assignment_format=assignment.assignment_format,
                assignment_type=assignment.assignment_type,
                due_date=serializer.validated_data['new_due_date'],
                estimated_duration=assignment.estimated_duration,
                time_limit=assignment.time_limit,
                is_timed=assignment.is_timed,
                total_points=assignment.total_points,
                auto_grade_qcm=assignment.auto_grade_qcm,
                randomize_questions=assignment.randomize_questions,
                show_results_immediately=assignment.show_results_immediately,
                allow_multiple_attempts=assignment.allow_multiple_attempts,
                max_attempts=assignment.max_attempts,
                allow_late_submissions=assignment.allow_late_submissions,
                late_penalty_percentage=assignment.late_penalty_percentage,
            )
            
            # Duplicate questions
            for question in assignment.questions.all():
                new_question = Question.objects.create(
                    assignment=new_assignment,
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
            for exercise in assignment.book_exercises.all():
                BookExercise.objects.create(
                    assignment=new_assignment,
                    book_title=exercise.book_title,
                    book_title_arabic=exercise.book_title_arabic,
                    publisher=exercise.publisher,
                    isbn=exercise.isbn,
                    edition=exercise.edition,
                    chapter=exercise.chapter,
                    chapter_arabic=exercise.chapter_arabic,
                    page_number=exercise.page_number,
                    exercise_number=exercise.exercise_number,
                    specific_questions=exercise.specific_questions,
                    additional_notes=exercise.additional_notes,
                    page_image=exercise.page_image,
                    points=exercise.points,
                )
            
            # Duplicate reward config
            if hasattr(assignment, 'reward_config'):
                AssignmentReward.objects.create(
                    assignment=new_assignment,
                    completion_points=assignment.reward_config.completion_points,
                    completion_coins=assignment.reward_config.completion_coins,
                    perfect_score_bonus=assignment.reward_config.perfect_score_bonus,
                    high_score_bonus=assignment.reward_config.high_score_bonus,
                    early_submission_bonus=assignment.reward_config.early_submission_bonus,
                    on_time_bonus=assignment.reward_config.on_time_bonus,
                    difficulty_multiplier=assignment.reward_config.difficulty_multiplier,
                    weekend_multiplier=assignment.reward_config.weekend_multiplier,
                )
            
            return Response({'message': 'Assignment duplicated successfully', 'id': new_assignment.id})
        
        return Response(serializer.errors, status=400)

# =====================================
# QUESTION VIEWS  
# =====================================

class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        assignment_id = self.request.query_params.get('assignment')
        if assignment_id:
            return Question.objects.filter(assignment_id=assignment_id)
        return Question.objects.all()
    
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
        assignment_id = self.request.query_params.get('assignment')
        if assignment_id:
            return BookExercise.objects.filter(assignment_id=assignment_id)
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
            queryset = queryset.filter(assignment__teacher=user)
        elif user.role in ['ADMIN', 'STAFF']:
            queryset = queryset.all()
        elif user.role == 'PARENT':
            # Parents see their children's submissions
            queryset = queryset.filter(student__role='STUDENT')  # Add parent-child logic
        
        # Filters
        assignment_id = self.request.query_params.get('assignment')
        status_filter = self.request.query_params.get('status')
        
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start an assignment (create submission)"""
        assignment = get_object_or_404(Assignment, pk=pk)
        
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students can start assignments'}, status=403)
        
        # Check if assignment is published and not overdue
        if not assignment.is_published:
            return Response({'error': 'Assignment not published'}, status=400)
        
        # Check if student already has a submission
        existing_submission = Submission.objects.filter(
            assignment=assignment,
            student=request.user
        ).first()
        
        if existing_submission and not assignment.allow_multiple_attempts:
            return Response({'error': 'Assignment already started'}, status=400)
        
        # Create new submission
        attempt_number = 1
        if existing_submission:
            attempt_number = existing_submission.attempt_number + 1
            if attempt_number > assignment.max_attempts:
                return Response({'error': 'Maximum attempts reached'}, status=400)
        
        submission = Submission.objects.create(
            assignment=assignment,
            student=request.user,
            status='in_progress',
            started_at=timezone.now(),
            attempt_number=attempt_number
        )
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit an assignment"""
        submission = self.get_object()
        
        if request.user != submission.student:
            return Response({'error': 'Permission denied'}, status=403)
        
        if submission.status in ['submitted', 'auto_graded', 'manually_graded']:
            return Response({'error': 'Assignment already submitted'}, status=400)
        
        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        
        # Calculate time taken
        if submission.started_at:
            time_diff = submission.submitted_at - submission.started_at
            submission.time_taken = int(time_diff.total_seconds() / 60)  # Minutes
        
        # Check if late
        if submission.submitted_at > submission.assignment.due_date:
            submission.is_late = True
            submission.status = 'late'
        
        submission.save()
        
        # Auto-grade QCM questions if enabled
        if submission.assignment.auto_grade_qcm:
            self._auto_grade_submission(submission)
        
        return Response({'message': 'Assignment submitted successfully'})
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        """Grade a submission (teacher only)"""
        submission = self.get_object()
        
        if request.user != submission.assignment.teacher and request.user.role not in ['ADMIN', 'STAFF']:
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
        
        assignment = submission.assignment
        reward_config = getattr(assignment, 'reward_config', None)
        
        if not reward_config:
            return
        
        points = 0
        coins = 0
        
        # Base completion reward
        points += reward_config.completion_points
        coins += reward_config.completion_coins
        
        # Performance bonus
        if submission.total_score and assignment.total_points:
            score_percentage = (float(submission.total_score) / float(assignment.total_points)) * 100
            
            if score_percentage >= 100:
                points += reward_config.perfect_score_bonus
            elif score_percentage >= 90:
                points += reward_config.high_score_bonus
        
        # Time bonus
        if not submission.is_late:
            points += reward_config.on_time_bonus
            
            # Early submission bonus (>24h early)
            if submission.submitted_at and assignment.due_date:
                time_diff = assignment.due_date - submission.submitted_at
                if time_diff.total_seconds() > 86400:  # 24 hours
                    points += reward_config.early_submission_bonus
        
        # Apply multipliers
        points = int(points * float(reward_config.difficulty_multiplier))
        
        # Weekend bonus
        if assignment.assigned_date.weekday() >= 5:  # Saturday/Sunday
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
        
        if submission.total_score == submission.assignment.total_points:
            wallet.perfect_scores += 1
        
        if not submission.is_late:
            # Update streaks logic here
            pass
        
        wallet.save()
        
        # Create transaction record
        RewardTransaction.objects.create(
            student=submission.student,
            assignment=submission.assignment,
            submission=submission,
            transaction_type='earned',
            points_earned=submission.points_earned,
            coins_earned=submission.coins_earned,
            reason=f"Completed assignment: {submission.assignment.title}"
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
            queryset = queryset.filter(submission__assignment__teacher=user)
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
            queryset = queryset.filter(submission__assignment__teacher=user)
        elif user.role in ['ADMIN', 'STAFF']:
            queryset = queryset.all()
        
        submission_id = self.request.query_params.get('submission')
        if submission_id:
            queryset = queryset.filter(submission_id=submission_id)
        
        return queryset