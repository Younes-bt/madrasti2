# homework/tests.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from datetime import timedelta

from schools.models import School, Grade, SchoolClass, Subject, EducationalLevel, AcademicYear
from .models import (
    # Reward Models
    RewardSettings, StudentWallet, RewardTransaction,
    
    # Assignment Models
    Assignment, AssignmentReward, Question, QuestionChoice, BookExercise,
    
    # Submission Models
    Submission, QuestionAnswer, BookExerciseAnswer,
    
    # Badge Models
    Badge, StudentBadge,
    
    # Textbook Models
    TextbookLibrary
)

User = get_user_model()

class HomeWorkModelTests(TestCase):
    """Test homework models"""
    
    def setUp(self):
        """Set up test data"""
        # Create school
        self.school = School.objects.create(
            name="Test School",
            email="test@school.com",
            phone="123456789",
            address="123 Test St",
            city="Test City",
            region="Test Region"
        )
        
        # Create educational level and grade
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY",
            name="Primary",
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.educational_level,
            grade_number=1,
            name="1st Grade",
            passing_grade=10.00
        )
        
        # Create subject
        self.subject = Subject.objects.create(
            name="Mathematics",
            code="MATH101"
        )
        
        # Create academic year
        self.academic_year = AcademicYear.objects.create(
            year="2023-2024",
            start_date="2023-09-01",
            end_date="2024-06-30",
            is_current=True
        )
        
        # Create class
        self.school_class = SchoolClass.objects.create(
            grade=self.grade,
            section="A",
            academic_year=self.academic_year
        )
        
        # Create users
        self.teacher = User.objects.create_user(
            email="teacher@test.com",
            password="testpass123",
            first_name="John",
            last_name="Teacher",
            role="TEACHER"
        )
        
        self.student = User.objects.create_user(
            email="student@test.com", 
            password="testpass123",
            first_name="Jane",
            last_name="Student",
            role="STUDENT"
        )
        
        self.admin = User.objects.create_user(
            email="admin@test.com",
            password="testpass123", 
            first_name="Admin",
            last_name="User",
            role="ADMIN"
        )
    
    def test_student_wallet_creation(self):
        """Test StudentWallet model"""
        wallet = StudentWallet.objects.create(student=self.student)
        self.assertEqual(wallet.total_points, 0)
        self.assertEqual(wallet.total_coins, 0)
        self.assertEqual(wallet.current_level_name, "مبتدئ - Débutant")
        
    def test_assignment_creation(self):
        """Test Assignment model"""
        assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test Description",
            instructions="Test Instructions", 
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="homework",
            due_date=timezone.now() + timedelta(days=7),
            estimated_duration=60,
            total_points=Decimal('20.00')
        )
        
        self.assertEqual(assignment.title, "Test Assignment")
        self.assertEqual(assignment.teacher, self.teacher)
        self.assertFalse(assignment.is_overdue)
        self.assertEqual(assignment.submissions_count, 0)
    
    def test_question_and_choices_creation(self):
        """Test Question and QuestionChoice models"""
        assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test Description",
            instructions="Test Instructions",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="quiz",
            due_date=timezone.now() + timedelta(days=7),
            estimated_duration=30,
            total_points=Decimal('10.00')
        )
        
        question = Question.objects.create(
            assignment=assignment,
            question_type="qcm_single",
            question_text="What is 2 + 2?",
            points=Decimal('2.00'),
            order=1
        )
        
        choice1 = QuestionChoice.objects.create(
            question=question,
            choice_text="3",
            is_correct=False,
            order=1
        )
        
        choice2 = QuestionChoice.objects.create(
            question=question,
            choice_text="4",
            is_correct=True,
            order=2
        )
        
        self.assertEqual(question.choices.count(), 2)
        self.assertTrue(choice2.is_correct)
        self.assertFalse(choice1.is_correct)
    
    def test_submission_creation(self):
        """Test Submission model"""
        assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test Description",
            instructions="Test Instructions",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="homework",
            due_date=timezone.now() + timedelta(days=7),
            estimated_duration=60,
            total_points=Decimal('20.00')
        )
        
        submission = Submission.objects.create(
            assignment=assignment,
            student=self.student,
            status="draft"
        )
        
        self.assertEqual(submission.assignment, assignment)
        self.assertEqual(submission.student, self.student)
        self.assertEqual(submission.status, "draft")
        self.assertFalse(submission.is_late)


class RewardSystemTests(TestCase):
    """Test reward system functionality"""
    
    def setUp(self):
        """Set up test data"""
        # Create basic school structure
        self.school = School.objects.create(
            name="Test School",
            email="test@school.com", 
            phone="123456789",
            address="123 Test St",
            city="Test City",
            region="Test Region"
        )
        
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY",
            name="Primary",
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.educational_level,
            grade_number=1,
            name="1st Grade"
        )
        
        self.subject = Subject.objects.create(
            name="Mathematics",
            code="MATH101"
        )
        
        # Create academic year
        self.academic_year = AcademicYear.objects.create(
            year="2023-2024",
            start_date="2023-09-01",
            end_date="2024-06-30",
            is_current=True
        )
        
        self.school_class = SchoolClass.objects.create(
            grade=self.grade,
            section="A",
            academic_year=self.academic_year
        )
        
        # Create users
        self.student = User.objects.create_user(
            email="student@test.com",
            password="testpass123",
            role="STUDENT"
        )
        
        self.teacher = User.objects.create_user(
            email="teacher@test.com", 
            password="testpass123",
            role="TEACHER"
        )
        
        # Create assignment with rewards
        self.assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test Description",
            instructions="Test Instructions",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="homework",
            due_date=timezone.now() + timedelta(days=7),
            estimated_duration=60,
            total_points=Decimal('20.00'),
            is_published=True
        )
        
        # Create reward configuration
        self.reward_config = AssignmentReward.objects.create(
            assignment=self.assignment,
            completion_points=10,
            completion_coins=1,
            perfect_score_bonus=20,
            high_score_bonus=10,
            early_submission_bonus=10,
            on_time_bonus=5
        )
    
    def test_reward_settings_creation(self):
        """Test reward settings creation"""
        reward_settings = RewardSettings.objects.create(
            school=self.school,
            points_per_assignment_completion=10,
            points_perfect_score=20,
            enable_leaderboard=True
        )
        
        self.assertEqual(reward_settings.school, self.school)
        self.assertEqual(reward_settings.points_per_assignment_completion, 10)
        self.assertTrue(reward_settings.enable_leaderboard)
    
    def test_badge_creation(self):
        """Test badge creation"""
        badge = Badge.objects.create(
            name="First Steps",
            name_arabic="الخطوات الأولى",
            description="Complete your first assignment",
            description_arabic="أكمل أول واجب لك",
            badge_type="achievement",
            rarity="common",
            requirements={"assignments_completed": 1},
            points_reward=10,
            coins_reward=1
        )
        
        self.assertEqual(badge.name, "First Steps")
        self.assertEqual(badge.badge_type, "achievement")
        self.assertEqual(badge.requirements["assignments_completed"], 1)
    
    def test_textbook_library_creation(self):
        """Test textbook library"""
        textbook = TextbookLibrary.objects.create(
            title="Math Grade 1",
            subject=self.subject,
            grade=self.grade,
            publisher="Test Publisher",
            isbn="1234567890"
        )
        
        self.assertEqual(textbook.title, "Math Grade 1")
        self.assertEqual(textbook.subject, self.subject)
        self.assertEqual(textbook.grade, self.grade)
    
    def test_reward_transaction_creation(self):
        """Test reward transaction creation"""
        wallet = StudentWallet.objects.create(student=self.student)
        
        transaction = RewardTransaction.objects.create(
            student=self.student,
            assignment=self.assignment,
            transaction_type='earned',
            points_earned=15,
            coins_earned=1,
            reason="Completed assignment"
        )
        
        self.assertEqual(transaction.student, self.student)
        self.assertEqual(transaction.points_earned, 15)
        self.assertEqual(transaction.transaction_type, 'earned')


class AssignmentCreationTests(TestCase):
    """Test assignment creation and management"""
    
    def setUp(self):
        """Set up test environment"""
        # Create minimal school structure
        self.school = School.objects.create(
            name="Test School",
            email="test@school.com",
            phone="123456789", 
            address="123 Test St",
            city="Test City",
            region="Test Region"
        )
        
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY",
            name="Primary",
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.educational_level,
            grade_number=1,
            name="1st Grade"
        )
        
        self.subject = Subject.objects.create(
            name="Mathematics",
            code="MATH101"
        )
        
        # Create academic year
        self.academic_year = AcademicYear.objects.create(
            year="2023-2024",
            start_date="2023-09-01",
            end_date="2024-06-30",
            is_current=True
        )
        
        self.school_class = SchoolClass.objects.create(
            grade=self.grade,
            section="A",
            academic_year=self.academic_year
        )
        
        # Create users
        self.teacher = User.objects.create_user(
            email="teacher@test.com",
            password="testpass123",
            role="TEACHER"
        )
        
        self.student = User.objects.create_user(
            email="student@test.com",
            password="testpass123", 
            role="STUDENT"
        )
    
    def test_assignment_with_questions(self):
        """Test creating assignment with multiple question types"""
        assignment = Assignment.objects.create(
            title="Mixed Question Assignment",
            description="Test different question types",
            instructions="Answer all questions carefully",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="quiz",
            assignment_format="mixed",
            due_date=timezone.now() + timedelta(days=3),
            estimated_duration=45,
            total_points=Decimal('25.00')
        )
        
        # QCM Single choice
        qcm_question = Question.objects.create(
            assignment=assignment,
            question_type="qcm_single",
            question_text="What is the capital of Morocco?",
            points=Decimal('5.00'),
            order=1
        )
        
        QuestionChoice.objects.create(
            question=qcm_question,
            choice_text="Rabat",
            is_correct=True,
            order=1
        )
        
        QuestionChoice.objects.create(
            question=qcm_question,
            choice_text="Casablanca",
            is_correct=False,
            order=2
        )
        
        # Open question
        open_question = Question.objects.create(
            assignment=assignment,
            question_type="open_short",
            question_text="Explain the water cycle in 3 sentences.",
            points=Decimal('10.00'),
            order=2
        )
        
        # Book exercise
        book_exercise = BookExercise.objects.create(
            assignment=assignment,
            book_title="Math Textbook Grade 1",
            publisher="Educational Publisher",
            chapter="Chapter 3",
            page_number=45,
            exercise_number="Exercise 3.1",
            specific_questions="Questions 1-5",
            points=Decimal('10.00')
        )
        
        self.assertEqual(assignment.questions.count(), 2)
        self.assertEqual(assignment.book_exercises.count(), 1)
        self.assertEqual(qcm_question.choices.count(), 2)
    
    def test_assignment_reward_configuration(self):
        """Test assignment reward configuration"""
        assignment = Assignment.objects.create(
            title="Rewarded Assignment",
            description="Assignment with custom rewards",
            instructions="Complete for rewards",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="homework",
            due_date=timezone.now() + timedelta(days=5),
            estimated_duration=90,
            total_points=Decimal('30.00')
        )
        
        reward_config = AssignmentReward.objects.create(
            assignment=assignment,
            completion_points=15,
            completion_coins=2,
            perfect_score_bonus=25,
            high_score_bonus=15,
            early_submission_bonus=12,
            on_time_bonus=8,
            difficulty_multiplier=Decimal('1.5'),
            weekend_multiplier=Decimal('2.0')
        )
        
        self.assertEqual(reward_config.assignment, assignment)
        self.assertEqual(reward_config.completion_points, 15)
        self.assertEqual(reward_config.difficulty_multiplier, Decimal('1.5'))
    
    def test_submission_workflow(self):
        """Test basic submission workflow"""
        assignment = Assignment.objects.create(
            title="Test Submission Assignment",
            description="Test submission process",
            instructions="Submit your answers",
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            assignment_type="quiz",
            due_date=timezone.now() + timedelta(days=2),
            estimated_duration=30,
            total_points=Decimal('15.00'),
            is_published=True
        )
        
        # Student starts assignment
        submission = Submission.objects.create(
            assignment=assignment,
            student=self.student,
            status="in_progress",
            started_at=timezone.now()
        )
        
        # Create question and answer
        question = Question.objects.create(
            assignment=assignment,
            question_type="qcm_single",
            question_text="What is 7 + 8?",
            points=Decimal('5.00'),
            order=1
        )
        
        correct_choice = QuestionChoice.objects.create(
            question=question,
            choice_text="15",
            is_correct=True,
            order=1
        )
        
        wrong_choice = QuestionChoice.objects.create(
            question=question,
            choice_text="14",
            is_correct=False,
            order=2
        )
        
        # Student answers question
        answer = QuestionAnswer.objects.create(
            submission=submission,
            question=question
        )
        answer.selected_choices.add(correct_choice)
        
        # Submit assignment
        submission.status = "submitted"
        submission.submitted_at = timezone.now()
        submission.save()
        
        self.assertEqual(submission.status, "submitted")
        self.assertIsNotNone(submission.submitted_at)
        self.assertFalse(submission.is_late)
        self.assertEqual(answer.selected_choices.count(), 1)
        self.assertTrue(answer.selected_choices.filter(is_correct=True).exists())