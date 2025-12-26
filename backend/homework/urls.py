# homework/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router and register viewsets
router = DefaultRouter()

# Reward System Routes
router.register(r'reward-settings', views.RewardSettingsViewSet, basename='reward-settings')
router.register(r'student-wallets', views.StudentWalletViewSet, basename='student-wallets')
router.register(r'reward-transactions', views.RewardTransactionViewSet, basename='reward-transactions')

# Badge System Routes
router.register(r'badges', views.BadgeViewSet, basename='badges')
router.register(r'student-badges', views.StudentBadgeViewSet, basename='student-badges')

# Leaderboard Routes
router.register(r'leaderboards', views.LeaderboardViewSet, basename='leaderboards')

# Textbook Routes
router.register(r'textbooks', views.TextbookLibraryViewSet, basename='textbooks')

# Exercise Routes
router.register(r'exercises', views.ExerciseViewSet, basename='exercises')
router.register(r'exercise-submissions', views.ExerciseSubmissionViewSet, basename='exercise-submissions')

# Homework Routes (renamed from Assignment)
router.register(r'homework', views.HomeworkViewSet, basename='homework')
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'book-exercises', views.BookExerciseViewSet, basename='book-exercises')

# Submission Routes
router.register(r'submissions', views.SubmissionViewSet, basename='submissions')
router.register(r'question-answers', views.QuestionAnswerViewSet, basename='question-answers')
router.register(r'book-exercise-answers', views.BookExerciseAnswerViewSet, basename='book-exercise-answers')

# Progress Tracking Routes
router.register(r'lesson-progress', views.LessonProgressViewSet, basename='lesson-progress')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    # Progress report endpoints
    path('progress/report/', views.StudentProgressReportView.as_view(), name='student-progress-report'),
    path('progress/report/<int:student_id>/', views.StudentProgressReportView.as_view(), name='student-progress-report-detail'),
]
