from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.get_profile, name='profile'),
    path('projects/', views.projects_list, name='projects_list'),
    path('projects/<int:pk>/', views.project_detail, name='project_detail'),
    path('contact/', views.contact_messages, name='contact_messages'),
    path('jarvis/chat/', views.jarvis_chat, name='jarvis_chat'),
    path('resume/download/', views.download_resume, name='download_resume'),
    path('cv/download/', views.download_cv, name='download_cv'),
]
