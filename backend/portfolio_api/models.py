from urllib.parse import urlparse
from django.db import models
from .portfolio_data import PROJECT_METADATA_DEFAULTS, infer_sandbox_slug


def _is_specific_repo_url(url: str) -> bool:
    """Return True only when a GitHub URL points to an actual repository path (/user/repo)."""
    if not url:
        return False
    parsed = urlparse(url.strip())
    parts = [p for p in parsed.path.split('/') if p]
    return len(parts) >= 2


class Project(models.Model):
    """
    Project model storing Suryakiran's real projects managed via Admin Console.
    Includes architecture, trade-offs, and interactive sandbox identifiers for verifiable proof.
    """

    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=240, blank=True, default='')
    description = models.TextField()
    problem_statement = models.TextField(blank=True, default='')
    architecture_summary = models.TextField(blank=True, default='')
    engineering_tradeoffs = models.TextField(blank=True, default='')
    api_contract_sample = models.TextField(blank=True, default='')
    sandbox_slug = models.CharField(max_length=64, blank=True, default='')
    technologies = models.CharField(
        max_length=250,
        help_text="Comma-separated tech stack (e.g. Django, Python, React)",
    )
    github_url = models.URLField(blank=True, default='')
    live_url = models.URLField(blank=True, default='')
    image_url = models.URLField(blank=True, default='')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-created_at']

    def __str__(self):
        return self.title

    def to_dict(self):
        slug = self.sandbox_slug or infer_sandbox_slug(self.title)
        defaults = PROJECT_METADATA_DEFAULTS.get(slug, {})
        return {
            'id': self.id,
            'title': self.title,
            'tagline': self.tagline or defaults.get('tagline', ''),
            'description': self.description,
            'problem_statement': self.problem_statement or defaults.get('problem_statement', self.description),
            'architecture_summary': self.architecture_summary or defaults.get('architecture_summary', ''),
            'engineering_tradeoffs': self.engineering_tradeoffs or defaults.get('engineering_tradeoffs', ''),
            'api_contract_sample': self.api_contract_sample or defaults.get('api_contract_sample', ''),
            'sandbox_slug': slug,
            'technologies': [tech.strip() for tech in self.technologies.split(',') if tech.strip()],
            'github_url': self.github_url,
            'has_exact_repo': _is_specific_repo_url(self.github_url),
            'live_url': self.live_url,
            'image_url': self.image_url,
            'featured': self.featured,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
        }


class ContactMessage(models.Model):
    """Stores inquiries sent by recruiters, clients, or visitors through the contact form."""

    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True, default='')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email}"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
        }


class PortfolioEvent(models.Model):
    """
    Privacy-friendly anonymous telemetry events (no IP addresses, no cookies, no PII).
    Used inside the authenticated Admin Console Analytics tab.
    """

    ALLOWED_TYPES = {
        'resume_download',
        'cv_download',
        'sandbox_finsight',
        'sandbox_paymatch',
        'sandbox_finsim',
        'jarvis_chat',
        'jd_match_run',
    }

    event_type = models.CharField(max_length=64, db_index=True)
    metadata = models.CharField(max_length=160, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type} ({self.created_at:%Y-%m-%d %H:%M})"

