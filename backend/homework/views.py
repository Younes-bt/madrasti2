# homework/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg, Count
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

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
    AnswerFillBlankSelection, AnswerOrderingSelection, AnswerMatchingSelection,

    # Exercise Submission Models
    ExerciseSubmission, ExerciseAnswer, ExerciseAnswerFile,

    # Progress Tracking Models
    LessonProgress
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
    ExerciseCreateSerializer, ExerciseDetailSerializer, ExerciseSubmissionSerializer, ExerciseAnswerInputSerializer,
    
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


    @action(detail=True, methods=['post'], url_path='start')
    def start_exercise(self, request, pk=None):
        '''Start an exercise attempt for the current student'''
        exercise = self.get_object()
        user = request.user

        if user.role != 'STUDENT':
            return Response({'detail': 'Only students can start exercises'}, status=status.HTTP_403_FORBIDDEN)

        # Check availability
        now = timezone.now()
        if not exercise.is_active or not exercise.is_published:
            return Response({'detail': 'Exercise is not available'}, status=status.HTTP_400_BAD_REQUEST)

        if exercise.available_from and now < exercise.available_from:
            return Response({'detail': 'Exercise is not yet available'}, status=status.HTTP_400_BAD_REQUEST)

        if exercise.available_until and now > exercise.available_until:
            return Response({'detail': 'Exercise is no longer available'}, status=status.HTTP_400_BAD_REQUEST)

        submissions_qs = ExerciseSubmission.objects.filter(exercise=exercise, student=user).order_by('-attempt_number')

        if not exercise.allow_multiple_attempts and submissions_qs.exists():
            serializer = ExerciseSubmissionSerializer(submissions_qs.first(), context={'request': request})
            return Response({'detail': 'Exercise already attempted', 'submission': serializer.data}, status=status.HTTP_400_BAD_REQUEST)

        if exercise.max_attempts and exercise.max_attempts > 0 and submissions_qs.count() >= exercise.max_attempts:
            return Response({'detail': 'Maximum attempts reached for this exercise'}, status=status.HTTP_400_BAD_REQUEST)

        latest_attempt = submissions_qs.first()
        attempt_number = (latest_attempt.attempt_number if latest_attempt else 0) + 1

        submission = ExerciseSubmission.objects.create(
            exercise=exercise,
            student=user,
            status='in_progress',
            attempt_number=attempt_number
        )

        # Award attempt points before returning
        self._award_exercise_attempt(submission)

        serializer = ExerciseSubmissionSerializer(submission, context={'request': request})
        return Response({'message': 'Exercise started successfully', 'submission': serializer.data})

    @action(detail=True, methods=['post'], url_path='submit')
    def submit_exercise(self, request, pk=None):
        '''Submit exercise answers for grading'''
        exercise = self.get_object()
        user = request.user

        if user.role != 'STUDENT':
            return Response({'detail': 'Only students can submit exercises'}, status=status.HTTP_403_FORBIDDEN)

        submission_id = request.data.get('submission_id')
        if submission_id:
            submission = get_object_or_404(ExerciseSubmission, pk=submission_id, exercise=exercise, student=user)
        else:
            submission = ExerciseSubmission.objects.filter(exercise=exercise, student=user).order_by('-created_at').first()
            if not submission:
                return Response({'detail': 'Exercise has not been started yet'}, status=status.HTTP_400_BAD_REQUEST)

        if submission.status in ['completed', 'auto_graded', 'reviewed'] and not exercise.allow_multiple_attempts:
            serializer = ExerciseSubmissionSerializer(submission, context={'request': request})
            return Response({'detail': 'Exercise already completed', 'submission': serializer.data}, status=status.HTTP_400_BAD_REQUEST)

        answers_payload = request.data.get('answers', [])
        if not isinstance(answers_payload, list):
            return Response({'detail': 'Answers must be provided as a list'}, status=status.HTTP_400_BAD_REQUEST)

        answer_serializer = ExerciseAnswerInputSerializer(data=answers_payload, many=True)
        answer_serializer.is_valid(raise_exception=True)
        validated_answers = answer_serializer.validated_data

        questions_lookup = {question.id: question for question in exercise.questions.all()}

        submission.exercise_answers.all().delete()

        auto_score = Decimal('0')
        questions_answered = 0
        questions_correct = 0

        for answer_data in validated_answers:
            question = questions_lookup.get(answer_data['question'])
            if not question:
                continue

            selected_choice_ids = answer_data.get('selected_choice_ids') or []
            text_answer = answer_data.get('text_answer', '')

            exercise_answer = ExerciseAnswer.objects.create(
                exercise_submission=submission,
                question=question,
                text_answer=text_answer or ''
            )

            if selected_choice_ids:
                choices = QuestionChoice.objects.filter(question=question, id__in=selected_choice_ids)
                exercise_answer.selected_choices.set(choices)
            else:
                exercise_answer.selected_choices.clear()

            answered = bool(text_answer.strip()) or bool(selected_choice_ids)

            if answered:
                questions_answered += 1

            is_correct = None
            points_earned = Decimal('0')

            if question.question_type in ['qcm_single', 'qcm_multiple', 'true_false']:
                correct_choice_ids = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
                selected_ids = set(exercise_answer.selected_choices.values_list('id', flat=True))
                points_value = Decimal(str(question.points))
                is_correct = selected_ids == correct_choice_ids and len(correct_choice_ids) > 0
                points_earned = points_value if is_correct else Decimal('0')
                if is_correct:
                    questions_correct += 1
                auto_score += points_earned
            elif answered:
                # For open-ended questions without auto grading we cannot determine correctness yet
                points_earned = None

            exercise_answer.is_correct = is_correct
            exercise_answer.points_earned = points_earned if points_earned is not None else None
            exercise_answer.save()

        submission.status = 'completed'
        submission.completed_at = timezone.now()
        submission.questions_answered = questions_answered
        submission.questions_correct = questions_correct
        submission.auto_score = auto_score
        if exercise.total_points:
            total_points_value = Decimal(str(exercise.total_points))
            submission.total_score = auto_score
            if total_points_value > 0:
                submission.percentage_score = (auto_score / total_points_value) * Decimal('100')
        submission.save()

        # Award completion rewards
        self._award_exercise_completion(submission)

        serializer = ExerciseSubmissionSerializer(submission, context={'request': request})
        return Response({'message': 'Exercise submitted successfully', 'submission': serializer.data})

    def _get_or_create_wallet(self, student):
        from .models import StudentWallet
        wallet, _ = StudentWallet.objects.get_or_create(student=student)
        return wallet

    def _create_transaction(self, student, exercise, submission, points=0, coins=0, reason='Exercise reward'):
        from .models import RewardTransaction
        RewardTransaction.objects.create(
            student=student,
            exercise=exercise,
            exercise_submission=submission,
            transaction_type='earned',
            points_earned=int(points or 0),
            coins_earned=int(coins or 0),
            reason=reason
        )

    def _award_exercise_attempt(self, submission):
        exercise = submission.exercise
        rewards = getattr(exercise, 'reward_config', None)
        if not rewards:
            return
        attempt_points = int(getattr(rewards, 'attempt_points', 0) or 0)
        if attempt_points <= 0:
            return
        wallet = self._get_or_create_wallet(submission.student)
        wallet.total_points += attempt_points
        wallet.weekly_points += attempt_points
        wallet.save()
        self._create_transaction(submission.student, exercise, submission, points=attempt_points, reason=f'Attempted exercise: {exercise.title}')

    def _award_exercise_completion(self, submission):
        exercise = submission.exercise
        rewards = getattr(exercise, 'reward_config', None)
        if not rewards:
            return
        points = int(getattr(rewards, 'completion_points', 0) or 0)
        coins = int(getattr(rewards, 'completion_coins', 0) or 0)

        pct = float(submission.percentage_score or 0)
        if pct >= 100 and getattr(rewards, 'perfect_score_bonus', 0):
            points += int(rewards.perfect_score_bonus or 0)
        elif pct >= 80 and getattr(rewards, 'high_score_bonus', 0):
            points += int(rewards.high_score_bonus or 0)

        # Compare with previous best
        previous_best = (submission.__class__.objects
            .filter(exercise=exercise, student=submission.student, status='completed')
            .exclude(id=submission.id)
            .order_by('-total_score')
            .first())
        if previous_best and submission.total_score and previous_best.total_score and submission.total_score > previous_best.total_score:
            points += int(getattr(rewards, 'improvement_bonus', 0) or 0)
            submission.previous_best_score = previous_best.total_score

        # Multipliers
        try:
            if getattr(rewards, 'difficulty_multiplier', None):
                points = int(points * float(rewards.difficulty_multiplier))
            if submission.attempt_number == 1 and getattr(rewards, 'first_attempt_multiplier', None):
                points = int(points * float(rewards.first_attempt_multiplier))
        except Exception:
            pass

        wallet = self._get_or_create_wallet(submission.student)
        wallet.total_points += int(points)
        wallet.total_coins += int(coins)
        wallet.weekly_points += int(points)
        wallet.save()
        self._create_transaction(submission.student, exercise, submission, points=points, coins=coins, reason=f'Completed exercise: {exercise.title}')
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
        queryset = Homework.objects.all().select_related(
            'subject', 'grade', 'school_class', 'teacher'
        ).prefetch_related(
            'submissions__student', 'submissions__graded_by'
        )

        if user.role == 'STUDENT':
            # Students see assignments for their enrolled classes
            # Get student's active enrollment classes
            from users.models import StudentEnrollment
            student_classes = StudentEnrollment.objects.filter(
                student=user,
                is_active=True
            ).values_list('school_class_id', flat=True)

            queryset = queryset.filter(
                school_class_id__in=student_classes,
                is_published=True
            )
        elif user.role == 'TEACHER':
            # Teachers see their own assignments
            queryset = queryset.filter(teacher=user)
        elif user.role == 'PARENT':
            # Parents see their children's assignments
            queryset = queryset.filter(is_published=True)  # Add parent-child logic later
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
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
        queryset = Submission.objects.all().select_related(
            'student', 'homework', 'homework__subject', 'homework__grade',
            'homework__school_class', 'graded_by'
        ).prefetch_related(
            'answers',
            'answers__question',
            'answers__question__choices',
            'answers__selected_choices',
            'answers__files',
            'book_exercise_answers',
            'book_exercise_answers__book_exercise',
            'book_exercise_answers__files'
        )

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
        """Submit an assignment with answers"""
        submission = self.get_object()

        if request.user != submission.student:
            return Response({'error': 'Permission denied'}, status=403)

        if submission.status in ['submitted', 'auto_graded', 'manually_graded']:
            return Response({'error': 'Homework already submitted'}, status=400)

        # Process answers payload
        answers_payload = request.data.get('answers', [])

        if answers_payload and isinstance(answers_payload, list):
            # Delete existing answers for this submission
            submission.answers.all().delete()

            # Get all questions for this homework
            questions_lookup = {q.id: q for q in submission.homework.questions.all()}

            # Create QuestionAnswer records
            for answer_data in answers_payload:
                question_id = answer_data.get('question')
                question = questions_lookup.get(question_id)

                if not question:
                    continue

                # Create the answer
                question_answer = QuestionAnswer.objects.create(
                    submission=submission,
                    question=question,
                    text_answer=answer_data.get('text_answer', '')
                )

                question_type = question.question_type

                if question_type in ['qcm_single', 'qcm_multiple', 'true_false']:
                    selected_choice_ids = answer_data.get('selected_choice_ids', [])
                    if selected_choice_ids:
                        choices = QuestionChoice.objects.filter(
                            question=question,
                            id__in=selected_choice_ids
                        )
                        question_answer.selected_choices.set(choices)

                elif question_type == 'fill_blank':
                    blanks_lookup = {blank.id: blank for blank in question.blanks.all()}
                    blank_answers = answer_data.get('blank_answers', [])
                    for blank_answer in blank_answers:
                        blank_id = blank_answer.get('blank')
                        option_id = blank_answer.get('selected_option')
                        blank_obj = blanks_lookup.get(blank_id)
                        if not blank_obj:
                            continue
                        option = blank_obj.options.filter(id=option_id).first()
                        if not option:
                            continue
                        AnswerFillBlankSelection.objects.create(
                            question_answer=question_answer,
                            blank=blank_obj,
                            selected_option=option,
                            is_correct=option.is_correct
                        )

                elif question_type == 'ordering':
                    items_lookup = {item.id: item for item in question.ordering_items.all()}
                    ordering_sequence = answer_data.get('ordering_sequence') or answer_data.get('ordering') or []
                    for position, item_id in enumerate(ordering_sequence, start=1):
                        item = items_lookup.get(item_id)
                        if not item:
                            continue
                        AnswerOrderingSelection.objects.create(
                            question_answer=question_answer,
                            item=item,
                            selected_position=position,
                            is_correct=item.correct_position == position
                        )

                elif question_type == 'matching':
                    pairs_lookup = {pair.id: pair for pair in question.matching_pairs.all()}
                    matching_answers = answer_data.get('matching_answers', [])
                    for match in matching_answers:
                        left_id = match.get('left_pair')
                        selected_right_id = match.get('selected_right_pair')
                        left_pair = pairs_lookup.get(left_id)
                        selected_pair = pairs_lookup.get(selected_right_id)
                        if not left_pair or not selected_pair:
                            continue
                        AnswerMatchingSelection.objects.create(
                            question_answer=question_answer,
                            left_pair=left_pair,
                            selected_right_pair=selected_pair,
                            is_correct=left_pair.id == selected_pair.id
                        )

        # Update submission status
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

            # Ensure status is set to manually_graded if not already
            if submission.status not in ['manually_graded', 'auto_graded']:
                submission.status = 'manually_graded'
                submission.save()

            # Always calculate rewards when teacher grades (even if already calculated, to update based on new scores)
            self._calculate_rewards(submission)

            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def _auto_grade_submission(self, submission):
        """Auto-grade QCM questions in a submission"""
        auto_score = 0
        
        for answer in submission.answers.all():
            question_type = answer.question.question_type

            if question_type in ['qcm_single', 'qcm_multiple', 'true_false']:
                correct_choices = answer.question.choices.filter(is_correct=True)
                selected_choices = answer.selected_choices.all()

                if question_type == 'qcm_single':
                    # Single choice: must select exactly one correct answer
                    if (selected_choices.count() == 1 and 
                        selected_choices.first() in correct_choices):
                        answer.is_correct = True
                        answer.points_earned = answer.question.points
                        auto_score += float(answer.question.points)
                    else:
                        answer.is_correct = False
                        answer.points_earned = 0

                elif question_type == 'qcm_multiple':
                    # Multiple choice: must select all correct answers and no incorrect ones
                    if (set(selected_choices) == set(correct_choices)):
                        answer.is_correct = True
                        answer.points_earned = answer.question.points
                        auto_score += float(answer.question.points)
                    else:
                        answer.is_correct = False
                        answer.points_earned = 0

                answer.save()

            elif question_type == 'fill_blank':
                blanks = list(answer.question.blanks.all())
                selections = list(answer.blank_selections.all())
                if blanks and len(selections) == len(blanks) and all(sel.is_correct for sel in selections):
                    answer.is_correct = True
                    answer.points_earned = answer.question.points
                    auto_score += float(answer.question.points)
                else:
                    answer.is_correct = False
                    answer.points_earned = 0
                answer.save()

            elif question_type == 'ordering':
                items = list(answer.question.ordering_items.all())
                selections_by_item = {
                    selection.item_id: selection for selection in answer.ordering_selections.all()
                }
                if items and all(
                    selections_by_item.get(item.id) and selections_by_item[item.id].selected_position == item.correct_position
                    for item in items
                ):
                    answer.is_correct = True
                    answer.points_earned = answer.question.points
                    auto_score += float(answer.question.points)
                else:
                    answer.is_correct = False
                    answer.points_earned = 0
                answer.save()

            elif question_type == 'matching':
                pairs = list(answer.question.matching_pairs.all())
                selections = answer.matching_selections.all()
                if pairs and selections.count() == len(pairs) and all(
                    selection.left_pair_id == selection.selected_right_pair_id for selection in selections
                ):
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
        if submission.status not in ['submitted', 'auto_graded', 'manually_graded', 'late']:
            return

        homework = submission.homework

        # Get or create reward config with default values
        reward_config = getattr(homework, 'reward_config', None)
        if not reward_config:
            # Create default reward config if it doesn't exist
            reward_config = HomeworkReward.objects.create(
                homework=homework,
                completion_points=10,
                completion_coins=1,
                perfect_score_bonus=20,
                high_score_bonus=10,
                early_submission_bonus=10,
                on_time_bonus=5,
                difficulty_multiplier=1.00,
                weekend_multiplier=1.50
            )

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
        # Safety check - ensure points and coins are set
        if submission.points_earned is None:
            submission.points_earned = 0
        if submission.coins_earned is None:
            submission.coins_earned = 0

        wallet, created = StudentWallet.objects.get_or_create(student=submission.student)

        # Add to totals
        wallet.total_points += submission.points_earned or 0
        wallet.total_coins += submission.coins_earned or 0
        wallet.weekly_points += submission.points_earned or 0
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
            points_earned=submission.points_earned or 0,
            coins_earned=submission.coins_earned or 0,
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

# =====================================
# LESSON PROGRESS TRACKING VIEWS
# =====================================

class LessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing lesson progress"""
    from .serializers import LessonProgressSerializer, LessonProgressDetailSerializer
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = LessonProgress.objects.select_related('student', 'lesson').all()

        # Students can only see their own progress
        if user.role == 'STUDENT':
            queryset = queryset.filter(student=user)

        # Teachers can see progress for their students
        elif user.role == 'TEACHER':
            # Get classes taught by this teacher
            from schools.models import SchoolClass
            teacher_classes = SchoolClass.objects.filter(teachers=user)
            queryset = queryset.filter(student__student_profile__school_class__in=teacher_classes)

        # ADMIN/STAFF can see all

        # Allow filtering by student, lesson, status
        student_id = self.request.query_params.get('student')
        lesson_id = self.request.query_params.get('lesson')
        status_filter = self.request.query_params.get('status')

        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            from .serializers import LessonProgressDetailSerializer
            return LessonProgressDetailSerializer
        from .serializers import LessonProgressSerializer
        return LessonProgressSerializer

    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current student's progress across all lessons"""
        if request.user.role != 'STUDENT':
            return Response(
                {"error": "This endpoint is only for students"},
                status=status.HTTP_403_FORBIDDEN
            )

        progress_records = LessonProgress.objects.filter(student=request.user).select_related('lesson')

        # Group by status
        summary = {
            'total_lessons': progress_records.count(),
            'not_started': progress_records.filter(status='not_started').count(),
            'in_progress': progress_records.filter(status='in_progress').count(),
            'completed': progress_records.filter(status='completed').count(),
            'overall_completion': 0,
            'average_score': 0,
            'total_time_spent': 0
        }

        if summary['total_lessons'] > 0:
            summary['overall_completion'] = (summary['completed'] / summary['total_lessons']) * 100

            # Calculate averages
            completed_progress = progress_records.filter(status='completed')
            if completed_progress.exists():
                from django.db.models import Avg, Sum
                stats = completed_progress.aggregate(
                    avg_score=Avg('average_score'),
                    total_time=Sum('total_time_spent')
                )
                summary['average_score'] = stats['avg_score'] or 0
                summary['total_time_spent'] = stats['total_time'] or 0

        serializer = self.get_serializer(progress_records, many=True)

        return Response({
            'summary': summary,
            'progress': serializer.data
        })


class StudentProgressReportView(APIView):
    """Generate detailed progress reports for students"""
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id=None):
        """Get progress report for a specific student or current user"""

        # Determine which student to get report for
        if student_id:
            # Check permissions
            if request.user.role == 'STUDENT' and request.user.id != student_id:
                return Response(
                    {"error": "You can only view your own progress"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                student = User.objects.get(id=student_id, role='STUDENT')
            except User.DoesNotExist:
                return Response(
                    {"error": "Student not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Use current user (must be student)
            if request.user.role != 'STUDENT':
                return Response(
                    {"error": "This endpoint is for students"},
                    status=status.HTTP_403_FORBIDDEN
                )
            student = request.user

        # Calculate progress report
        report = self._generate_progress_report(student)

        from .serializers import StudentProgressReportSerializer
        serializer = StudentProgressReportSerializer(data=report)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)

    def _generate_progress_report(self, student):
        """Generate comprehensive progress report for a student"""
        from django.db.models import Sum, Avg, Count, Q
        from lessons.models import Lesson
        from schools.models import Subject

        # Get all lesson progress
        lesson_progress = LessonProgress.objects.filter(student=student)

        # Overall statistics
        total_lessons = lesson_progress.count()
        lessons_completed = lesson_progress.filter(status='completed').count()
        lessons_in_progress = lesson_progress.filter(status='in_progress').count()
        lessons_not_started = lesson_progress.filter(status='not_started').count()

        # Calculate overall completion percentage
        overall_completion = (lessons_completed / total_lessons * 100) if total_lessons > 0 else 0

        # Performance statistics
        completed_lessons = lesson_progress.filter(status='completed')
        perf_stats = completed_lessons.aggregate(
            avg_score=Avg('average_score'),
            total_time=Sum('total_time_spent')
        )

        accuracy_stats = lesson_progress.aggregate(
            total_correct=Sum('total_questions_correct'),
            total_answered=Sum('total_questions_answered')
        )

        total_correct = accuracy_stats['total_correct'] or 0
        total_answered = accuracy_stats['total_answered'] or 0
        overall_accuracy = (total_correct / total_answered * 100) if total_answered else 0

        # Reward statistics
        wallet = StudentWallet.objects.filter(student=student).first()
        badges_count = StudentBadge.objects.filter(student=student).count()

        # Get student's class to determine subjects
        student_class = getattr(student, 'student_profile', None)
        student_class = student_class.school_class if student_class else None

        # Count subjects (lessons' subjects)
        total_subjects = lesson_progress.values('lesson__subject').distinct().count()

        # Total exercises
        total_exercises = lesson_progress.aggregate(total=Sum('exercises_total'))['total'] or 0

        report = {
            'student_id': student.id,
            'student_name': student.get_full_name(),
            'student_email': student.email,

            # Overall statistics
            'total_subjects': total_subjects,
            'total_lessons': total_lessons,
            'total_exercises': total_exercises,

            # Completion statistics
            'lessons_completed': lessons_completed,
            'lessons_in_progress': lessons_in_progress,
            'lessons_not_started': lessons_not_started,
            'overall_completion_percentage': round(overall_completion, 2),

            # Performance statistics
            'overall_average_score': round(perf_stats['avg_score'] or 0, 2),
            'overall_accuracy_percentage': round(overall_accuracy or 0, 2),
            'total_time_spent': perf_stats['total_time'] or 0,

            # Reward statistics
            'total_points_earned': wallet.total_points if wallet else 0,
            'total_coins_earned': wallet.total_coins if wallet else 0,
            'badges_earned': badges_count,
        }

        return report
