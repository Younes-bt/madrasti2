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

# Assignment Routes
router.register(r'assignments', views.AssignmentViewSet, basename='assignments')
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'book-exercises', views.BookExerciseViewSet, basename='book-exercises')

# Submission Routes
router.register(r'submissions', views.SubmissionViewSet, basename='submissions')
router.register(r'question-answers', views.QuestionAnswerViewSet, basename='question-answers')
router.register(r'book-exercise-answers', views.BookExerciseAnswerViewSet, basename='book-exercise-answers')

# URL patterns
urlpatterns = [
    path('api/', include(router.urls)),
]

# Optional: Add custom URL patterns here if needed
# urlpatterns += [
#     path('api/custom-endpoint/', views.CustomView.as_view(), name='custom-endpoint'),
# ]