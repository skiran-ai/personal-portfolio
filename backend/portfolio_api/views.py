import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Project, ContactMessage

# Profile Data - Accurate and dynamically accessible
PROFILE_INFO = {
    "name": "Suryakiran P J",
    "role": "Software Engineer (AI Integrated Python Django Full Stack Developer)",
    "email": "suryakiranpjineesh@gmail.com",
    "socials": {
        "github": "https://github.com/suryakiranpjineesh-bit",
        "linkedin": "https://www.linkedin.com/in/surya-kiran-967659351?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        "instagram": "https://www.instagram.com/jstt.kiran?igsh=aG83M255aG1wZTho",
        "email": "mailto:suryakiranpjineesh@gmail.com"
    },
    "education": [
        {
            "degree": "Python Django Full Stack Developer",
            "institution": "Avodha",
            "location": "Vyttila, Ernakulam, Kerala",
            "period": "Pursuing (Month 5 of 6 • 1 Mo Remaining)",
            "highlight": "6-month intensive professional development specializing in Python, Django REST Framework, ORM, database engineering, and full stack web architecture."
        },
        {
            "degree": "B.Sc Computer Science",
            "institution": "KMM",
            "location": "Thrikkakara, Ernakulam, Kerala",
            "period": "Course Completed",
            "highlight": "Specialized in Computer Science fundamentals, Software Engineering, Data Structures, and Algorithm Design."
        },
        {
            "degree": "Higher Secondary School (HSS)",
            "institution": "Sahodaran Memorial Higher Secondary School",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Higher Secondary Education",
            "highlight": "Strong academic foundation in Computer Science, Mathematics, and Sciences."
        },
        {
            "degree": "SSLC",
            "institution": "Rama Varma Union High School",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Secondary School Leaving Certificate",
            "highlight": "Secondary education with active participation in computer science and technology clubs."
        }
    ],
    "skills": {
        "backend": ["Python", "Django", "Django REST Framework", "PostgreSQL", "SQLite", "REST APIs", "Microservices"],
        "ai_integration": ["Agentic AI Workflows", "LLM Integration", "LangChain", "Prompt Engineering", "NLP", "API Automation"],
        "frontend": ["React", "JavaScript (ES6+)", "Three.js (3D Graphics)", "HTML5 / CSS3", "Responsive UI", "Tailwind / Vanilla CSS"],
        "tools": ["Git & GitHub", "Docker Basics", "Linux / CLI", "Postman", "VS Code", "Vite"]
    },
    "hero_speech": (
        "Greetings! I am Jarvis, personal AI assistant to Suryakiran P J. "
        "Suryakiran is a high-caliber Software Engineer and AI-integrated Python Django Full Stack Developer. "
        "He specializes in engineering robust, scalable Django web applications, reactive modern interfaces, and intelligent agentic AI systems. "
        "Explore his verified coursework from Avodha and KMM, review his ATS-friendly credentials, or utilize the embedded Admin Console to interact with his dynamic portfolio."
    )
}

def get_profile(request):
    """Returns official profile, education, and social links."""
    return JsonResponse({"status": "success", "profile": PROFILE_INFO})


@csrf_exempt
def projects_list(request):
    """
    GET: Returns list of real projects from database.
    POST: Adds a real project from Admin Dashboard.
    """
    if request.method == 'GET':
        projects = [p.to_dict() for p in Project.objects.all()]
        return JsonResponse({"status": "success", "count": len(projects), "projects": projects})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()
            technologies = data.get('technologies', '').strip()

            if not title or not description:
                return JsonResponse({"status": "error", "message": "Title and description are required"}, status=400)

            project = Project.objects.create(
                title=title,
                description=description,
                technologies=technologies,
                github_url=data.get('github_url', '').strip(),
                live_url=data.get('live_url', '').strip(),
                image_url=data.get('image_url', '').strip(),
                featured=bool(data.get('featured', False))
            )
            return JsonResponse({"status": "success", "message": "Project created successfully", "project": project.to_dict()}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def project_detail(request, pk):
    """Update or delete a project by ID."""
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Project not found"}, status=404)

    if request.method == 'DELETE':
        project.delete()
        return JsonResponse({"status": "success", "message": "Project deleted successfully"})

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            project.title = data.get('title', project.title)
            project.description = data.get('description', project.description)
            project.technologies = data.get('technologies', project.technologies)
            project.github_url = data.get('github_url', project.github_url)
            project.live_url = data.get('live_url', project.live_url)
            project.image_url = data.get('image_url', project.image_url)
            project.featured = bool(data.get('featured', project.featured))
            project.save()
            return JsonResponse({"status": "success", "message": "Project updated", "project": project.to_dict()})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def contact_messages(request):
    """
    POST: Submit contact message from visitors.
    GET: Retrieve messages in the Admin Dashboard inbox.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()

            if not name or not email or not message:
                return JsonResponse({"status": "error", "message": "Name, email, and message are required"}, status=400)

            msg = ContactMessage.objects.create(
                name=name,
                email=email,
                subject=data.get('subject', '').strip(),
                message=message
            )
            return JsonResponse({"status": "success", "message": "Your message has been sent successfully!", "message_id": msg.id}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    elif request.method == 'GET':
        messages = [m.to_dict() for m in ContactMessage.objects.all()]
        return JsonResponse({"status": "success", "count": len(messages), "messages": messages})

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def jarvis_chat(request):
    """
    Agentic AI Assistant 'Jarvis' responding intelligently with knowledge of Suryakiran.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_message = data.get('message', '').strip().lower()

        if not user_message:
            return JsonResponse({"status": "error", "message": "Message is empty"}, status=400)

        # Agentic intent-based knowledge response engine
        reply = ""
        action = None

        if any(w in user_message for w in ["good morning", "good afternoon", "good evening", "good night", "hello", "hi", "hey", "greetings"]):
            reply = (
                "Greetings! I am Jarvis, personal AI assistant to Suryakiran P J. "
                "How may I assist you today? You can ask me to read Suryakiran's hero introduction aloud, "
                "walk you through his verified coursework and education, review his technical skills, or open his ATS resume."
            )
        elif any(w in user_message for w in ["who are you", "what is jarvis", "identify", "your name"]):
            reply = (
                "Greetings! I am Jarvis, the autonomous Agentic AI Assistant custom engineered for Suryakiran P J. "
                "I am integrated into this portfolio to guide visitors, showcase Suryakiran's technical background, "
                "and assist recruiters and collaborators in connecting with him."
            )
        elif any(w in user_message for w in ["who is surya", "about surya", "introduce", "intro", "hero", "read"]):
            reply = (
                "Suryakiran P J is a dedicated Software Engineer specializing in AI-integrated Python Django Full Stack Development. "
                "He designs high-performance backends using Django and Python, creates responsive frontends with React, "
                "and leverages Agentic AI to automate workflows and enhance user experiences."
            )
            action = "READ_HERO"
        elif any(w in user_message for w in ["education", "study", "college", "school", "degree", "kmm", "cherai", "avodha", "course"]):
            reply = (
                "Here is Suryakiran's academic and professional training track:\n"
                "1. Python Django Full Stack Development (6-Month Professional Program) at Avodha (Vyttila, Ernakulam) – Currently Pursuing (Month 5 of 6, 1 month remaining).\n"
                "2. B.Sc in Computer Science from KMM (Thrikkakara, Ernakulam, Kerala) – Course Completed.\n"
                "3. Higher Secondary (HSS) from Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala.\n"
                "4. SSLC from Rama Varma Union High School, Cherai, Ernakulam, Kerala."
            )
            action = "SCROLL_EDUCATION"
        elif any(w in user_message for w in ["skill", "stack", "tech", "python", "django", "react", "technologies"]):
            reply = (
                "Suryakiran's core tech stack comprises:\n"
                "- Backend: Python, Django, Django REST Framework, PostgreSQL, SQLite, Microservices\n"
                "- AI Integration: Agentic Workflows, LLM APIs, LangChain, Prompt Engineering\n"
                "- Frontend: React, JavaScript, Three.js 3D animations, HTML5, Modern CSS\n"
                "- DevOps & Tools: Git/GitHub, Docker, Linux, Postman."
            )
            action = "SCROLL_SKILLS"
        elif any(w in user_message for w in ["project", "work", "portfolio projects"]):
            count = Project.objects.count()
            if count == 0:
                reply = (
                    "To maintain complete authenticity, Suryakiran has not added any placeholder or fake projects! "
                    "Projects are dynamically added and updated in real time via the integrated Admin Dashboard. "
                    "Click on 'Admin Portal' in the navigation bar to see or add verified projects."
                )
            else:
                reply = f"Suryakiran currently has {count} verified projects published dynamically via the Admin Dashboard. Check out the Projects section!"
            action = "SCROLL_PROJECTS"
        elif any(w in user_message for w in ["resume", "cv", "ats", "download", "hire"]):
            reply = (
                "Suryakiran provides fully ATS-friendly Resume and CV documents optimized for applicant tracking systems. "
                "You can preview and download them immediately using the 'Download ATS Resume' or 'Download ATS CV' buttons."
            )
            action = "OPEN_RESUME_MODAL"
        elif any(w in user_message for w in ["contact", "email", "phone", "hire", "reach", "social", "github", "linkedin", "instagram"]):
            reply = (
                "You can connect directly with Suryakiran:\n"
                "- Email: suryakiranpjineesh@gmail.com\n"
                "- LinkedIn: linkedin.com/in/surya-kiran-967659351\n"
                "- GitHub: github.com/suryakiranpjineesh-bit\n"
                "- Instagram: instagram.com/jstt.kiran"
            )
            action = "SCROLL_CONTACT"
        elif any(w in user_message for w in ["admin", "dashboard", "login"]):
            reply = (
                "The Admin Dashboard is built directly inside this portfolio! "
                "Click the 'Admin Portal' button in the header or hero to access it. "
                "Default access PIN is 'admin123' or 'surya2026'."
            )
            action = "OPEN_ADMIN"
        else:
            reply = (
                f"Thank you for asking! As Suryakiran's AI Assistant, I can share that Suryakiran specializes in "
                f"Python Django backend engineering, reactive React interfaces, and Agentic AI integration. "
                f"Feel free to ask about his education at KMM, his tech stack, or download his ATS Resume."
            )

        return JsonResponse({
            "status": "success",
            "reply": reply,
            "action": action,
            "assistant": "Jarvis"
        })
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


def download_resume(request):
    """Serves ATS-friendly text resume formatted cleanly for ATS parsers."""
    resume_text = """================================================================================
SURYAKIRAN P J
Software Engineer | AI Integrated Python Django Full Stack Developer
Email: suryakiranpjineesh@gmail.com
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
Location: Ernakulam, Kerala, India
================================================================================

PROFESSIONAL SUMMARY
Results-driven Software Engineer and AI-Integrated Python Django Full Stack Developer 
with extensive expertise in building scalable, secure backend architectures, RESTful APIs, 
and responsive frontend applications. Specialized in integrating Agentic AI workflows, 
LLM-driven automations, and modern web application development using Django and React.

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
- Programming Languages: Python, JavaScript (ES6+), SQL, HTML5, CSS3
- Backend Frameworks: Django, Django REST Framework (DRF), ASGI/WSGI
- Frontend Technologies: React, Three.js (3D Graphics), Responsive Web Design
- AI & Integration: Agentic AI Systems, LLM Integration, LangChain, Prompt Engineering
- Databases: PostgreSQL, SQLite, Database Normalization & Indexing
- Tools & Methodologies: Git, GitHub, RESTful Architecture, Docker Basics, Agile/Scrum

--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
Bachelor of Science (B.Sc) in Computer Science
KMM, Thrikkakara, Ernakulam, Kerala
- Key Coursework: Data Structures, Object-Oriented Programming, Database Systems, 
  Software Engineering, Operating Systems, Computer Networks.

Higher Secondary Education (HSS)
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala
- Stream: Science & Computer Applications

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala

--------------------------------------------------------------------------------
CORE COMPETENCIES & EXPERTISE
--------------------------------------------------------------------------------
- Full Stack Architecture: Engineering end-to-end web apps with Django REST backends and React frontends.
- Agentic AI Development: Designing autonomous AI agents with text and voice capabilities (e.g., Jarvis).
- Dynamic Content Management: Implementing real-time Admin Portals with live project orchestration.
- Clean Code Practices: Writing modular, well-documented, testable code adhering to PEP 8 standards.

--------------------------------------------------------------------------------
CONTACT & PORTFOLIO
--------------------------------------------------------------------------------
- Email: suryakiranpjineesh@gmail.com
- GitHub: https://github.com/suryakiranpjineesh-bit
- LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
- Instagram: https://www.instagram.com/jstt.kiran
================================================================================
"""
    response = HttpResponse(resume_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_ATS_Resume.txt"'
    return response


def download_cv(request):
    """Serves ATS-friendly Curriculum Vitae (CV) with comprehensive academic & technical detail."""
    cv_text = """================================================================================
CURRICULUM VITAE (CV) - ATS COMPLIANT
SURYAKIRAN P J
Software Engineer | AI Integrated Python Django Full Stack Developer
Email: suryakiranpjineesh@gmail.com
Location: Ernakulam, Kerala, India
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
================================================================================

1. OBJECTIVE
To leverage deep proficiency in Python, Django, React, and Agentic AI technologies 
to engineer resilient software solutions, intelligent automations, and enterprise-grade 
web platforms that drive technological innovation.

2. ACADEMIC CREDENTIALS
--------------------------------------------------------------------------------
- B.Sc Computer Science
  Institution: KMM
  Location: Thrikkakara, Ernakulam, Kerala
  Focus: Core Computing, Software Architecture, System Design, Algorithms

- Higher Secondary School (HSS)
  Institution: Sahodaran Memorial Higher Secondary School
  Location: Cherai, Ernakulam, Kerala

- Secondary School Leaving Certificate (SSLC)
  Institution: Rama Varma Union High School
  Location: Cherai, Ernakulam, Kerala

3. TECHNICAL PROFICIENCIES
--------------------------------------------------------------------------------
- Languages: Python, JavaScript, SQL, HTML5, CSS3
- Backend Architecture: Django, Django REST Framework, ORM, API Security, CORS
- Modern Frontend: React, Three.js 3D WebGL, Component Design, State Management
- Artificial Intelligence: Agentic AI Agents, LLM Integrations, Speech Synthesis/Recognition
- Database Management: PostgreSQL, SQLite, Relational Schema Modeling
- Version Control: Git, GitHub workflow, branching and CI/CD basics

4. NOTABLE ENGINEERING ACHIEVEMENTS
--------------------------------------------------------------------------------
- Developed 3D Interactive Web Experience featuring Three.js particle simulations and 3D scrolling.
- Engineered Autonomous 'Jarvis' Agent with bilingual speech synthesis, voice recognition, and NLP intent resolution.
- Architected Real-time In-Portfolio Admin Dashboard for CRUD operations on dynamic software portfolios.

5. DECLARATION
I hereby affirm that the information provided above is authentic and complete to the best of my knowledge.

Suryakiran P J
================================================================================
"""
    response = HttpResponse(cv_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_ATS_CV.txt"'
    return response
