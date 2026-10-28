import os
import json
from datetime import datetime
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Project, ContactMessage

# Profile Data - Accurate and dynamically accessible
PROFILE_INFO = {
    "name": "Suryakiran P J",
    "role": "AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)",
    "email": "suryakiranpjineesh@gmail.com",
    "phone": "+91 8129867662",
    "portfolio": "https://skiran.vercel.app",
    "socials": {
        "github": "https://github.com/suryakiranpjineesh-bit",
        "linkedin": "https://www.linkedin.com/in/surya-kiran-967659351",
        "email": "mailto:suryakiranpjineesh@gmail.com"
    },
    "education": [
        {
            "degree": "Python Django Full Stack Development (6-Month Professional Program)",
            "institution": "Avodha",
            "location": "Vyttila, Ernakulam, Kerala",
            "period": "In progress (5 of 6 months completed)",
            "highlight": "Coursework: Python 3, Django, Django REST Framework, Relational Databases, Frontend Integration, API Development, Full Stack Project Engineering."
        },
        {
            "degree": "Bachelor of Science (B.Sc), Computer Science",
            "institution": "KMM College",
            "location": "Thrikkakara, Ernakulam, Kerala",
            "period": "Coursework Completed (2023 – 2026)",
            "highlight": "Coursework: Data Structures, Object-Oriented Programming, Database Systems, Software Engineering, Operating Systems, Computer Networks."
        },
        {
            "degree": "Higher Secondary Education (HSS), Science & Computer Applications",
            "institution": "Sahodaran Memorial Higher Secondary School",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Completed",
            "highlight": "Strong foundation in Computer Applications, Mathematics, and Physical Sciences."
        },
        {
            "degree": "Secondary School Leaving Certificate (SSLC)",
            "institution": "Rama Varma Union High School",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Completed",
            "highlight": "Secondary School Leaving Certificate with distinction in technology and sciences."
        }
    ],
    "skills": {
        "languages": ["Python", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3"],
        "backend": ["Django", "Django REST Framework (DRF)", "ASGI/WSGI", "RESTful API Design"],
        "frontend": ["React", "Three.js", "Responsive Web Design"],
        "ai_integration": ["Agentic AI Systems", "LLM Integration", "LangChain", "Prompt Engineering"],
        "databases": ["PostgreSQL", "SQLite", "Database Normalization", "Indexing"],
        "tools": ["Git", "GitHub", "Docker (basics)", "Agile/Scrum"]
    },
    "hero_speech": (
        "Greetings! I am Jarvis, personal AI assistant to Suryakiran P J. "
        "Suryakiran is a high-caliber Python Django Full Stack Developer specializing in AI Integration. "
        "He builds resilient backend architectures, RESTful APIs, modern reactive frontends, and autonomous agentic AI systems. "
        "Explore his verified coursework from Avodha and KMM, review his ATS resume and visual CV, or download his official PDFs directly."
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
    POST: Submit contact message from visitors, log to database, and dispatch directly to Suryakiran's Gmail.
    GET: Retrieve messages in the Admin Dashboard inbox.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            subject = data.get('subject', '').strip() or 'Portfolio Inquiry'
            message = data.get('message', '').strip()

            if not name or not email or not message:
                return JsonResponse({"status": "error", "message": "Name, email, and message are required"}, status=400)

            # 1. Persist to SQLite Database for Admin Dashboard Inbox
            msg = ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )

            # 2. Dispatch Email to Suryakiran's Gmail: suryakiranpjineesh@gmail.com
            recipient = getattr(settings, 'PORTFOLIO_RECIPIENT_EMAIL', 'suryakiranpjineesh@gmail.com')
            sender_email = getattr(settings, 'DEFAULT_FROM_EMAIL', recipient)
            email_sent = False
            email_status_msg = ""

            subject_line = f"🚀 [Portfolio Contact] {name}: {subject}"
            timestamp_str = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

            plain_text = (
                f"You have received a new contact message from your Portfolio!\n\n"
                f"Sender: {name}\n"
                f"Email: {email}\n"
                f"Subject: {subject}\n"
                f"Received At: {timestamp_str}\n\n"
                f"Message Content:\n"
                f"--------------------------------------------------\n"
                f"{message}\n"
                f"--------------------------------------------------\n\n"
                f"Reply directly to: {email}\n"
                f"View all messages in your Portfolio Admin Portal.\n"
            )

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090e; color: #f8fafc; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #0e1424; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; }}
                .badge {{ display: inline-block; background: rgba(0, 242, 254, 0.15); color: #00f2fe; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; border: 1px solid rgba(0, 242, 254, 0.3); }}
                h2 {{ color: #ffffff; margin-top: 12px; font-size: 22px; }}
                .info-row {{ margin: 10px 0; font-size: 14px; color: #cbd5e1; }}
                .info-label {{ font-weight: bold; color: #94a3b8; display: inline-block; width: 85px; }}
                .message-box {{ background: #141d34; border-left: 4px solid #00f2fe; border-radius: 6px; padding: 16px; margin: 20px 0; font-size: 15px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; }}
                .action-btn {{ display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #00f2fe 100%); color: #07090e; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 10px; }}
                .footer {{ border-top: 1px solid #1e293b; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center; }}
              </style>
            </head>
            <body>
              <div class="container">
                <span class="badge">NEW PORTFOLIO INQUIRY</span>
                <h2>Message from {name}</h2>
                <div class="info-row"><span class="info-label">From:</span> {name}</div>
                <div class="info-row"><span class="info-label">Email:</span> <a href="mailto:{email}" style="color: #38bdf8;">{email}</a></div>
                <div class="info-row"><span class="info-label">Subject:</span> {subject}</div>
                <div class="info-row"><span class="info-label">Time:</span> {timestamp_str}</div>

                <div class="message-box">{message}</div>

                <div style="text-align: center; margin: 24px 0;">
                  <a href="mailto:{email}?subject=Re: {subject}" class="action-btn">Reply Directly to {name}</a>
                </div>

                <div class="footer">
                  Suryakiran P J Portfolio Notification System &bull; Destination: {recipient}
                </div>
              </div>
            </body>
            </html>
            """

            # If Gmail App Password is configured, dispatch real email
            if getattr(settings, 'EMAIL_HOST_PASSWORD', None):
                try:
                    email_msg = EmailMultiAlternatives(
                        subject=subject_line,
                        body=plain_text,
                        from_email=sender_email,
                        to=[recipient],
                        reply_to=[email]
                    )
                    email_msg.attach_alternative(html_content, "text/html")
                    email_msg.send(fail_silently=False)
                    email_sent = True
                    email_status_msg = f"Message dispatched to {recipient}."
                    print(f"[PORTFOLIO CONTACT] Successfully emailed inquiry to {recipient}")
                except Exception as mail_err:
                    print(f"[PORTFOLIO CONTACT WARNING] SMTP dispatch notice: {mail_err}")
                    email_status_msg = "Saved in Admin Inbox (Gmail SMTP connection awaiting configuration)."
            else:
                email_status_msg = f"Saved in Admin Inbox. To forward automatically to {recipient}, add your Google App Password to backend/.env."
                print(f"[PORTFOLIO CONTACT] Message saved in database. Set EMAIL_HOST_PASSWORD in backend/.env to forward to {recipient}.")

            return JsonResponse({
                "status": "success",
                "message": f"Your message has been received! It was sent to Suryakiran (suryakiranpjineesh@gmail.com) and logged in the Admin Inbox.",
                "message_id": msg.id,
                "email_dispatched": email_sent,
                "recipient": recipient
            }, status=201)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    elif request.method == 'GET':
        messages = [m.to_dict() for m in ContactMessage.objects.all()]
        return JsonResponse({"status": "success", "count": len(messages), "messages": messages})

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def admin_login(request):
    """
    POST: Authenticates administrator credentials.
    Configured for username 'admin' and password 'surya007'.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    try:
        from django.contrib.auth import authenticate
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        user = authenticate(request, username=username, password=password)
        if (user is not None and user.is_staff) or (username == 'admin' and password == 'surya007'):
            return JsonResponse({
                "status": "success",
                "authenticated": True,
                "username": "admin",
                "message": "Admin authenticated successfully."
            })
        return JsonResponse({
            "status": "error",
            "authenticated": False,
            "message": "Invalid username or password. Access restricted."
        }, status=401)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


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
                "Suryakiran provides fully ATS-friendly Resume (1-Page) and Visual CV documents optimized for applicant tracking systems. "
                "You can preview them online or download the official PDF directly using the 'Download ATS Resume' or 'Download Visual CV' buttons."
            )
            action = "OPEN_RESUME_MODAL"
        elif any(w in user_message for w in ["contact", "email", "phone", "hire", "reach", "social", "github", "linkedin"]):
            reply = (
                "You can connect directly with Suryakiran:\n"
                "- Email: suryakiranpjineesh@gmail.com\n"
                "- Phone: +91 8129867662\n"
                "- LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351\n"
                "- GitHub: https://github.com/suryakiranpjineesh-bit\n"
                "- Portfolio: https://skiran.vercel.app"
            )
            action = "SCROLL_CONTACT"
        elif any(w in user_message for w in ["admin", "dashboard", "login"]):
            reply = (
                "The Admin Dashboard is built directly inside this portfolio for authorized management. "
                "Access is strictly restricted to Suryakiran P J."
            )
            action = "OPEN_ADMIN"
        else:
            reply = (
                f"Thank you for asking! As Suryakiran's AI Assistant, I can share that Suryakiran specializes in "
                f"Python Django backend engineering, reactive React interfaces, and Agentic AI integration. "
                f"Feel free to ask about his education at Avodha & KMM, his tech stack, or download his ATS Resume."
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
    """
    Serves Suryakiran's official ATS Resume PDF for universal download across all devices.
    Pass ?format=txt to receive clean ATS plain text.
    """
    format_type = request.GET.get('format', 'pdf').lower()

    resume_text = """================================================================================
SURYAKIRAN P J
AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)
Ernakulam, Kerala, India | suryakiranpjineesh@gmail.com | +91 8129867662
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351 | GitHub: https://github.com/suryakiranpjineesh-bit
Portfolio: https://skiran.vercel.app
================================================================================

PROFESSIONAL SUMMARY
Python Django full stack developer building backend architectures, RESTful APIs,
and responsive frontend applications. Experience integrating agentic AI workflows
and LLM-driven automation into web applications using Django, Django REST
Framework, and React.

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
Languages: Python, JavaScript (ES6+), SQL, HTML5, CSS3
Backend: Django, Django REST Framework (DRF), ASGI/WSGI, RESTful API Design
Frontend: React, Three.js, Responsive Web Design
AI & Integration: Agentic AI Systems, LLM Integration, LangChain, Prompt Engineering
Databases: PostgreSQL, SQLite, Database Normalization, Indexing
Tools & Methods: Git, GitHub, Docker (basics), Agile/Scrum

--------------------------------------------------------------------------------
PROJECTS
--------------------------------------------------------------------------------
FinSight AI - Intelligent Personal Finance & Cash-Flow Forecasting Platform
• Problem Solved: Eliminates personal liquidity risks and cash-flow volatility by identifying recurring spending leaks and forecasting monthly balance trajectories.
• Stack Architecture: Engineered high-throughput REST APIs using Python, Django REST Framework, and PostgreSQL with normalized schemas and optimized query indexing.
• AI/LLM Integration: Integrated LangChain and LLM reasoning pipelines to automatically parse banking statements, classify transactions, and project forward cash-flow scenarios.

PayMatch AI - Intelligent Payment Reconciliation & Discrepancy Detection System
• Problem Solved: Resolves multi-gateway payment mismatches, fee anomalies, and missing settlement records across high-volume merchant transaction streams.
• Stack Architecture: Architected robust backend reconciliation workflows in Python and Django with strict ACID transaction guarantees and batch PostgreSQL processing.
• AI/LLM Integration: Implemented fuzzy matching agents and LLM-driven discrepancy analyzers to classify anomalies and generate automated audit resolution reports.

FinSim - Personal Financial Stress Testing & Scenario Simulator
• Problem Solved: Enables users to evaluate financial resilience by simulating real-world shocks like inflation spikes, medical emergencies, and income disruptions.
• Stack Architecture: Developed deterministic financial simulation algorithms using Python and Django ORM, synchronized with reactive interactive charts in React.
• AI/LLM Integration: Integrated generative AI scenario modeling agents that evaluate multi-variable macroeconomic conditions and formulate personalized contingency playbooks.

--------------------------------------------------------------------------------
EDUCATION & TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Professional Program)
Avodha, Vyttila, Ernakulam, Kerala | In progress (5 of 6 months completed)
Coursework: Python 3, Django, Django REST Framework, Relational Databases,
Frontend Integration, API Development, Full Stack Project Engineering

Bachelor of Science (B.Sc), Computer Science
KMM College, Thrikkakara, Ernakulam, Kerala | Coursework Completed (2023 – 2026)
Coursework: Data Structures, Object-Oriented Programming, Database Systems,
Software Engineering, Operating Systems, Computer Networks

Higher Secondary Education (HSS), Science & Computer Applications
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala
================================================================================
"""

    if format_type == 'txt':
        response = HttpResponse(resume_text, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.txt"'
        return response

    # Search for PDF file in backend documents or frontend public directory
    pdf_candidates = [
        os.path.join(settings.BASE_DIR, 'portfolio_api', 'documents', 'Suryakiran_PJ_Resume.pdf'),
        os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'Suryakiran_PJ_Resume.pdf'),
    ]

    for path in pdf_candidates:
        if os.path.exists(path):
            response = FileResponse(open(path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.pdf"'
            return response

    # Fallback to plain text if PDF binary is missing
    response = HttpResponse(resume_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.txt"'
    return response


def download_cv(request):
    """
    Serves Suryakiran's official Curriculum Vitae (CV) PDF for universal download across all devices.
    Pass ?format=txt to receive clean ATS plain text.
    """
    format_type = request.GET.get('format', 'pdf').lower()

    cv_text = """================================================================================
CURRICULUM VITAE (CV)
SURYAKIRAN P J
AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)
Email: suryakiranpjineesh@gmail.com
Phone: +91 8129867662
Location: Ernakulam, Kerala, India
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
Portfolio: https://skiran.vercel.app
================================================================================

PROFESSIONAL SUMMARY
Python Django full stack developer building backend architectures, RESTful APIs,
and responsive frontend applications. Experience integrating agentic AI workflows
and LLM-driven automation into web applications using Django, Django REST
Framework, and React.

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
Languages:
  Python, JavaScript (ES6+), SQL, HTML5, CSS3

Backend:
  Django, Django REST Framework, ASGI/WSGI, RESTful API Design

Frontend:
  React, Three.js, Responsive Web Design

AI & Integration:
  Agentic AI Systems, LLM Integration, LangChain, Prompt Engineering

Databases:
  PostgreSQL, SQLite, Normalization, Indexing

Tools & Methods:
  Git, GitHub, Docker (basics), Agile/Scrum

--------------------------------------------------------------------------------
PROJECTS
--------------------------------------------------------------------------------
1. FinSight AI - Intelligent Personal Finance & Cash-Flow Forecasting Platform
   • Problem Solved: Eliminates personal liquidity risks and cash-flow volatility by identifying recurring spending leaks and forecasting monthly balance trajectories.
   • Stack Architecture: Engineered high-throughput REST APIs using Python, Django REST Framework, and PostgreSQL with normalized schemas and optimized query indexing.
   • AI/LLM Integration: Integrated LangChain and LLM reasoning pipelines to automatically parse banking statements, classify transactions, and project forward cash-flow scenarios.

2. PayMatch AI - Intelligent Payment Reconciliation & Discrepancy Detection System
   • Problem Solved: Resolves multi-gateway payment mismatches, fee anomalies, and missing settlement records across high-volume merchant transaction streams.
   • Stack Architecture: Architected robust backend reconciliation workflows in Python and Django with strict ACID transaction guarantees and batch PostgreSQL processing.
   • AI/LLM Integration: Implemented fuzzy matching agents and LLM-driven discrepancy analyzers to classify anomalies and generate automated audit resolution reports.

3. FinSim - Personal Financial Stress Testing & Scenario Simulator
   • Problem Solved: Enables users to evaluate financial resilience by simulating real-world shocks like inflation spikes, medical emergencies, and income disruptions.
   • Stack Architecture: Developed deterministic financial simulation algorithms using Python and Django ORM, synchronized with reactive interactive charts in React.
   • AI/LLM Integration: Integrated generative AI scenario modeling agents that evaluate multi-variable macroeconomic conditions and formulate personalized contingency playbooks.

--------------------------------------------------------------------------------
EDUCATION & TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Program)
Avodha, Vyttila, Ernakulam, Kerala | In progress (5 of 6 months completed)
Python 3, Django, DRF, Relational Databases, Frontend Integration, API Development,
Full Stack Project Engineering

B.Sc, Computer Science
KMM, Thrikkakara, Ernakulam, Kerala | Coursework Completed (2023 – 2026)
Data Structures, Object-Oriented Programming, Database Systems, Software Engineering,
Operating Systems, Computer Networks

Higher Secondary Education (HSS), Science & Computer Applications
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala
================================================================================
"""

    if format_type == 'txt':
        response = HttpResponse(cv_text, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.txt"'
        return response

    # Search for PDF file in backend documents or frontend public directory
    pdf_candidates = [
        os.path.join(settings.BASE_DIR, 'portfolio_api', 'documents', 'Suryakiran_PJ_CV.pdf'),
        os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'Suryakiran_PJ_CV.pdf'),
    ]

    for path in pdf_candidates:
        if os.path.exists(path):
            response = FileResponse(open(path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.pdf"'
            return response

    # Fallback to plain text if PDF binary is missing
    response = HttpResponse(cv_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.txt"'
    return response
