from django.db import models

class Project(models.Model):
    """
    Project model storing Suryakiran's real projects managed via Admin Dashboard.
    No dummy/fake projects are seeded. Real projects are added through the Admin Console.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=250, help_text="Comma-separated tech stack (e.g. Django, Python, React)")
    github_url = models.URLField(blank=True, default='')
    live_url = models.URLField(blank=True, default='')
    image_url = models.URLField(blank=True, default='')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'technologies': [tech.strip() for tech in self.technologies.split(',') if tech.strip()],
            'github_url': self.github_url,
            'live_url': self.live_url,
            'image_url': self.image_url,
            'featured': self.featured,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
        }


class ContactMessage(models.Model):
    """
    Stores inquiries sent by recruiters, clients, or visitors through the contact form.
    Viewable directly inside the embedded portfolio Admin Dashboard.
    """
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
