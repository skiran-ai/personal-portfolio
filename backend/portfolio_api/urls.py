from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('github/summary/', views.github_summary, name='github_summary'),
    path('auth/login/', views.admin_login, name='admin_login'),
    path('auth/verify/', views.admin_verify, name='admin_verify'),
    path('profile/', views.get_profile, name='profile'),
    path('projects/', views.projects_list, name='projects_list'),
    path('projects/<int:pk>/', views.project_detail, name='project_detail'),
    path('contact/', views.contact_messages, name='contact_messages'),
    path('contact/<int:pk>/', views.contact_message_detail, name='contact_message_detail'),
    path('jarvis/chat/', views.jarvis_chat, name='jarvis_chat'),
    path('jarvis/jd-match/', views.jarvis_jd_match, name='jarvis_jd_match'),
    path('sandbox/<str:slug>/', views.run_project_sandbox, name='run_project_sandbox'),
    path('analytics/track/', views.track_analytics_event, name='track_analytics_event'),
    path('analytics/summary/', views.analytics_summary, name='analytics_summary'),
    path('resume/download/', views.download_resume, name='download_resume'),
    path('cv/download/', views.download_cv, name='download_cv'),
]
