import html
import hmac
import json
import os
import time
from django.conf import settings
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.db import connection
from django.db.models import Count
from django.http import FileResponse, HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .auth_utils import issue_admin_token, require_admin
from .github_service import get_github_summary
from .jarvis_service import GEMINI_MODEL, analyze_jd_match, chat_with_jarvis
from .models import ContactMessage, PortfolioEvent, Project
from .portfolio_data import PROFILE_INFO
from .sandboxes import SANDBOX_HANDLERS


def _parse_json_body(request):
    if not request.body:
        return {}
    return json.loads(request.body.decode('utf-8'))


def _record_event(event_type: str, metadata: str = ''):
    """Best-effort anonymous counter logging; never breaks primary request flow."""
    if event_type not in PortfolioEvent.ALLOWED_TYPES:
        return
    try:
        PortfolioEvent.objects.create(event_type=event_type, metadata=(metadata or '')[:160])
    except Exception:
        pass


def health_check(request):
    """Live API telemetry endpoint reporting DB connectivity, Gemini status, and GitHub push."""
    started = time.perf_counter()
    db_ok = False
    project_count = 0
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        project_count = Project.objects.count()
        db_ok = True
    except Exception:
        db_ok = False

    gemini_live = bool(getattr(settings, 'GEMINI_API_KEY', '').strip())
    gh = get_github_summary()
    return JsonResponse({
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "unavailable",
        "projects_count": project_count,
        "jarvis_mode": "gemini_live" if gemini_live else "grounded_local",
        "gemini_model": GEMINI_MODEL if gemini_live else None,
        "github_username": gh.get("username"),
        "github_last_push": gh.get("last_push_ago"),
        "latency_ms": round((time.perf_counter() - started) * 1000, 2),
    })


def github_summary(request):
    """GET: Public cached GitHub repos and recent push telemetry for @skiran-ai."""
    force = request.GET.get('refresh', '').lower() == 'true'
    return JsonResponse({"status": "success", **get_github_summary(force_refresh=force)})


def get_profile(request):
    """Returns official profile, evidence-based skill matrix, and education."""
    return JsonResponse({"status": "success", "profile": PROFILE_INFO})


@csrf_exempt
def admin_login(request):
    """
    POST: Authenticates administrator credentials and returns a signed Bearer token.
    Never embeds or validates credentials on the client side.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    try:
        data = _parse_json_body(request)
        username = str(data.get('username', '')).strip()
        password = str(data.get('password', ''))

        user = authenticate(request, username=username, password=password)
        env_user = getattr(settings, 'PORTFOLIO_ADMIN_USERNAME', '')
        env_pass = getattr(settings, 'PORTFOLIO_ADMIN_PASSWORD', '')

        env_match = (
            bool(env_user)
            and bool(env_pass)
            and hmac.compare_digest(username, env_user)
            and hmac.compare_digest(password, env_pass)
        )

        if (user is not None and user.is_staff) or env_match:
            token = issue_admin_token(username)
            return JsonResponse({
                "status": "success",
                "authenticated": True,
                "username": username,
                "token": token,
                "message": "Admin authenticated successfully.",
            })

        return JsonResponse({
            "status": "error",
            "authenticated": False,
            "message": "Invalid username or password. Access restricted.",
        }, status=401)
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@require_admin
def admin_verify(request):
    """GET: Verifies an existing Bearer token."""
    return JsonResponse({
        "status": "success",
        "authenticated": True,
        "username": getattr(request, 'admin_username', 'admin'),
    })


@csrf_exempt
def projects_list(request):
    """
    GET: Public list of verified projects.
    POST: Admin-only creation of a project.
    """
    if request.method == 'GET':
        projects = [p.to_dict() for p in Project.objects.all()]
        return JsonResponse({"status": "success", "count": len(projects), "projects": projects})

    if request.method == 'POST':
        return _create_project_protected(request)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@require_admin
def _create_project_protected(request):
    try:
        data = _parse_json_body(request)
        title = str(data.get('title', '')).strip()
        description = str(data.get('description', '')).strip()
        technologies = str(data.get('technologies', '')).strip()

        if not title or not description:
            return JsonResponse({"status": "error", "message": "Title and description are required"}, status=400)

        project = Project.objects.create(
            title=title,
            tagline=str(data.get('tagline', '')).strip(),
            description=description,
            problem_statement=str(data.get('problem_statement', '')).strip(),
            architecture_summary=str(data.get('architecture_summary', '')).strip(),
            engineering_tradeoffs=str(data.get('engineering_tradeoffs', '')).strip(),
            api_contract_sample=str(data.get('api_contract_sample', '')).strip(),
            sandbox_slug=str(data.get('sandbox_slug', '')).strip().lower(),
            technologies=technologies,
            github_url=str(data.get('github_url', '')).strip(),
            live_url=str(data.get('live_url', '')).strip(),
            image_url=str(data.get('image_url', '')).strip(),
            featured=bool(data.get('featured', False)),
        )
        return JsonResponse(
            {"status": "success", "message": "Project created successfully", "project": project.to_dict()},
            status=201,
        )
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@csrf_exempt
@require_admin
def project_detail(request, pk):
    """Admin-only PUT/DELETE for a project by ID."""
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Project not found"}, status=404)

    if request.method == 'DELETE':
        project.delete()
        return JsonResponse({"status": "success", "message": "Project deleted successfully"})

    if request.method == 'PUT':
        try:
            data = _parse_json_body(request)
            updatable_str_fields = (
                'title',
                'tagline',
                'description',
                'problem_statement',
                'architecture_summary',
                'engineering_tradeoffs',
                'api_contract_sample',
                'sandbox_slug',
                'technologies',
                'github_url',
                'live_url',
                'image_url',
            )
            for field in updatable_str_fields:
                if field in data:
                    val = str(data[field] or '').strip()
                    setattr(project, field, val.lower() if field == 'sandbox_slug' else val)

            if 'featured' in data:
                project.featured = bool(data['featured'])

            if not project.title or not project.description:
                return JsonResponse({"status": "error", "message": "Title and description cannot be empty"}, status=400)

            project.save()
            return JsonResponse({"status": "success", "message": "Project updated", "project": project.to_dict()})
        except Exception as exc:
            return JsonResponse({"status": "error", "message": str(exc)}, status=400)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@csrf_exempt
def contact_messages(request):
    """
    POST: Public visitor contact inquiry stored in SQLite/Postgres + dispatched via Gmail SMTP.
    GET: Admin-only retrieval of inbox messages.
    """
    if request.method == 'POST':
        try:
            data = _parse_json_body(request)
            name = str(data.get('name', '')).strip()
            email = str(data.get('email', '')).strip()
            subject = str(data.get('subject', '')).strip() or 'Portfolio Inquiry'
            message = str(data.get('message', '')).strip()

            if not name or not email or not message:
                return JsonResponse({"status": "error", "message": "Name, email, and message are required"}, status=400)

            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"status": "error", "message": "Please enter a valid email address"}, status=400)

            msg = ContactMessage.objects.create(
                name=name[:150],
                email=email,
                subject=subject[:200],
                message=message,
            )

            recipient = getattr(settings, 'PORTFOLIO_RECIPIENT_EMAIL', 'suryakiranpjineesh@gmail.com')
            sender_email = getattr(settings, 'DEFAULT_FROM_EMAIL', recipient)
            email_sent = False

            timestamp_str = timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')
            safe_name = html.escape(name)
            safe_email = html.escape(email)
            safe_subject = html.escape(subject)
            safe_message = html.escape(message)

            subject_line = f"[Portfolio Contact] {name}: {subject}"
            plain_text = (
                f"New contact message from your Portfolio\n\n"
                f"Sender: {name}\n"
                f"Email: {email}\n"
                f"Subject: {subject}\n"
                f"Received At: {timestamp_str}\n\n"
                f"Message:\n{message}\n"
            )

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#07090e; color:#f8fafc; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background:#0e1424; border:1px solid #1e293b; border-radius:12px; padding:24px;">
                <h2 style="margin-top:0;">Message from {safe_name}</h2>
                <p><strong>Email:</strong> {safe_email}</p>
                <p><strong>Subject:</strong> {safe_subject}</p>
                <p><strong>Time:</strong> {timestamp_str}</p>
                <div style="background:#141d34; border-left:4px solid #38bdf8; padding:14px; border-radius:6px; white-space:pre-wrap;">{safe_message}</div>
              </div>
            </body>
            </html>
            """

            if getattr(settings, 'EMAIL_HOST_PASSWORD', None):
                try:
                    email_msg = EmailMultiAlternatives(
                        subject=subject_line,
                        body=plain_text,
                        from_email=sender_email,
                        to=[recipient],
                        reply_to=[email],
                    )
                    email_msg.attach_alternative(html_content, "text/html")
                    email_msg.send(fail_silently=False)
                    email_sent = True
                except Exception as mail_err:
                    print(f"[PORTFOLIO CONTACT WARNING] SMTP dispatch error: {mail_err}")

            return JsonResponse({
                "status": "success",
                "message": "Your message was logged in the Admin Inbox"
                + (f" and dispatched to {recipient}." if email_sent else "."),
                "message_id": msg.id,
                "email_dispatched": email_sent,
            }, status=201)
        except Exception as exc:
            return JsonResponse({"status": "error", "message": str(exc)}, status=400)

    if request.method == 'GET':
        return _list_messages_protected(request)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)


@require_admin
def _list_messages_protected(request):
    messages = [m.to_dict() for m in ContactMessage.objects.all()]
    return JsonResponse({"status": "success", "count": len(messages), "messages": messages})


@csrf_exempt
@require_admin
def contact_message_detail(request, pk):
    """Admin-only DELETE for an inbox message."""
    if request.method != 'DELETE':
        return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)
    try:
        msg = ContactMessage.objects.get(pk=pk)
        msg.delete()
        return JsonResponse({"status": "success", "message": "Message deleted"})
    except ContactMessage.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Message not found"}, status=404)


@csrf_exempt
def jarvis_chat(request):
    """POST: Grounded Agentic AI chat via Gemini API (or transparent local fallback)."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    try:
        data = _parse_json_body(request)
        user_message = str(data.get('message', '')).strip()
        history = data.get('history') or []

        if not user_message:
            return JsonResponse({"status": "error", "message": "Message is empty"}, status=400)

        projects = [p.to_dict() for p in Project.objects.all()]
        result = chat_with_jarvis(user_message, projects, history=history)
        _record_event('jarvis_chat', result.get('mode', ''))
        return JsonResponse({
            "status": "success",
            "assistant": "Jarvis",
            **result,
        })
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@csrf_exempt
def jarvis_jd_match(request):
    """POST: Evaluate Suryakiran's verified fit against a recruiter's Job Description."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    try:
        data = _parse_json_body(request)
        job_description = str(data.get('job_description', '')).strip()
        if len(job_description) < 20:
            return JsonResponse(
                {"status": "error", "message": "Please paste a job description (at least 20 characters)."},
                status=400,
            )

        projects = [p.to_dict() for p in Project.objects.all()]
        analysis = analyze_jd_match(job_description, projects)
        _record_event('jd_match_run', str(analysis.get('match_score', '')))
        return JsonResponse({
            "status": "success",
            **analysis,
        })
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@csrf_exempt
def run_project_sandbox(request, slug):
    """POST: Executes real Python backend sandbox simulations for finsight, paymatch, or finsim."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

    clean_slug = slug.lower()
    handler = SANDBOX_HANDLERS.get(clean_slug)
    if not handler:
        return JsonResponse({"status": "error", "message": f"Unknown sandbox '{slug}'"}, status=404)

    try:
        payload = _parse_json_body(request)
        output = handler(payload)
        _record_event(f'sandbox_{clean_slug}')
        return JsonResponse({
            "status": "success",
            "sandbox": clean_slug,
            **output,
        })
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@csrf_exempt
def track_analytics_event(request):
    """POST: Logs anonymous UI interactions (resume_download, cv_download) without PII."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "POST method required"}, status=405)
    try:
        data = _parse_json_body(request)
        event_type = str(data.get('event_type', '')).strip()
        metadata = str(data.get('metadata', '')).strip()
        if event_type not in PortfolioEvent.ALLOWED_TYPES:
            return JsonResponse({"status": "error", "message": "Unsupported event type"}, status=400)
        _record_event(event_type, metadata)
        return JsonResponse({"status": "success"})
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)


@require_admin
def analytics_summary(request):
    """GET: Admin-only aggregated portfolio engagement analytics."""
    counts_qs = PortfolioEvent.objects.values('event_type').annotate(total=Count('id'))
    counts = {row['event_type']: row['total'] for row in counts_qs}
    recent = [
        {
            "event_type": ev.event_type,
            "metadata": ev.metadata,
            "created_at": ev.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for ev in PortfolioEvent.objects.all()[:12]
    ]
    return JsonResponse({
        "status": "success",
        "counts": {
            "resume_download": counts.get('resume_download', 0),
            "cv_download": counts.get('cv_download', 0),
            "sandbox_finsight": counts.get('sandbox_finsight', 0),
            "sandbox_paymatch": counts.get('sandbox_paymatch', 0),
            "sandbox_finsim": counts.get('sandbox_finsim', 0),
            "jarvis_chat": counts.get('jarvis_chat', 0),
            "jd_match_run": counts.get('jd_match_run', 0),
        },
        "total_events": sum(counts.values()),
        "inquiries_count": ContactMessage.objects.count(),
        "recent_events": recent,
    })


def download_resume(request):
    """Serves Suryakiran's ATS Resume PDF or clean ATS plain text (?format=txt)."""
    _record_event('resume_download', request.GET.get('focus', 'default'))
    format_type = request.GET.get('format', 'pdf').lower()
    resume_text = _render_ats_text(is_cv=False)

    if format_type == 'txt':
        response = HttpResponse(resume_text, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.txt"'
        return response

    pdf_candidates = [
        os.path.join(settings.BASE_DIR, 'portfolio_api', 'documents', 'Suryakiran_PJ_Resume.pdf'),
        os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'Suryakiran_PJ_Resume.pdf'),
    ]
    for path in pdf_candidates:
        if os.path.exists(path):
            response = FileResponse(open(path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.pdf"'
            return response

    response = HttpResponse(resume_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_Resume.txt"'
    return response


def download_cv(request):
    """Serves Suryakiran's Curriculum Vitae PDF or clean plain text (?format=txt)."""
    _record_event('cv_download')
    format_type = request.GET.get('format', 'pdf').lower()
    cv_text = _render_ats_text(is_cv=True)

    if format_type == 'txt':
        response = HttpResponse(cv_text, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.txt"'
        return response

    pdf_candidates = [
        os.path.join(settings.BASE_DIR, 'portfolio_api', 'documents', 'Suryakiran_PJ_CV.pdf'),
        os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'Suryakiran_PJ_CV.pdf'),
    ]
    for path in pdf_candidates:
        if os.path.exists(path):
            response = FileResponse(open(path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.pdf"'
            return response

    response = HttpResponse(cv_text, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="Suryakiran_PJ_CV.txt"'
    return response


def _render_ats_text(is_cv: bool = False) -> str:
    header = "CURRICULUM VITAE (CV)\n" if is_cv else ""
    return (
        f"{header}SURYAKIRAN P J\n"
        f"{PROFILE_INFO['role']}\n"
        f"{PROFILE_INFO['location']} | {PROFILE_INFO['email']} | {PROFILE_INFO['phone']}\n"
        f"LinkedIn: {PROFILE_INFO['socials']['linkedin']} | GitHub: {PROFILE_INFO['socials']['github']}\n"
        f"Portfolio: {PROFILE_INFO['portfolio']}\n\n"
        "PROJECTS\n"
        "1. FinSight AI - Cash-Flow Leak Detector & 90-Day Liquidity Forecaster (Python, DRF, LangChain, PostgreSQL)\n"
        "2. PayMatch AI - Multi-Pass Payment Reconciliation & Fee Anomaly Engine (Python, Django DRF, PostgreSQL)\n"
        "3. FinSim - Macroeconomic Shock & Personal Runway Stress Simulator (Python, Django, React)\n\n"
        "EDUCATION\n"
        + "\n".join(f"- {e['degree']} | {e['institution']} ({e['period']})" for e in PROFILE_INFO['education'])
    )
