import json
from django.test import Client, TestCase, override_settings
from .models import ContactMessage, Project


class PortfolioSecurityAndSandboxTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.project = Project.objects.create(
            title="PayMatch AI",
            description="Reconciliation engine",
            technologies="Python, Django DRF, PostgreSQL",
            github_url="https://github.com/suryakiranpjineesh-bit",
            featured=True,
        )

    def test_protected_endpoints_reject_unauthenticated_requests(self):
        self.assertEqual(
            self.client.post(
                "/api/projects/",
                data=json.dumps({"title": "X", "description": "Y"}),
                content_type="application/json",
            ).status_code,
            401,
        )
        self.assertEqual(
            self.client.delete(f"/api/projects/{self.project.id}/").status_code,
            401,
        )
        self.assertEqual(self.client.get("/api/contact/").status_code, 401)

    @override_settings(PORTFOLIO_ADMIN_USERNAME='testadmin', PORTFOLIO_ADMIN_PASSWORD='test-only-password')
    def test_admin_login_token_grants_access_to_projects_and_inbox(self):
        login_res = self.client.post(
            "/api/auth/login/",
            data=json.dumps({"username": "testadmin", "password": "test-only-password"}),
            content_type="application/json",
        )
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["token"]
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

        create_res = self.client.post(
            "/api/projects/",
            data=json.dumps({
                "title": "New Verified Project",
                "description": "Built cleanly",
                "technologies": "Python, Django",
                "github_url": "https://github.com/suryakiranpjineesh-bit/verified-repo",
            }),
            content_type="application/json",
            **headers,
        )
        self.assertEqual(create_res.status_code, 201)
        self.assertTrue(create_res.json()["project"]["has_exact_repo"])
        self.assertEqual(self.client.get("/api/contact/", **headers).status_code, 200)

    def test_project_has_exact_repo_false_for_profile_root(self):
        res = self.client.get("/api/projects/")
        self.assertEqual(res.status_code, 200)
        proj = res.json()["projects"][0]
        self.assertFalse(proj["has_exact_repo"])
        self.assertEqual(proj["sandbox_slug"], "paymatch")

    def test_sandboxes_return_structured_deterministic_results(self):
        fs = self.client.post("/api/sandbox/finsight/", data="{}", content_type="application/json")
        self.assertEqual(fs.status_code, 200)
        self.assertIn("leaks", fs.json())

        pm = self.client.post("/api/sandbox/paymatch/", data="{}", content_type="application/json")
        self.assertEqual(pm.status_code, 200)
        self.assertGreaterEqual(pm.json()["counts"]["FEE_ANOMALY"], 1)

        sim = self.client.post(
            "/api/sandbox/finsim/",
            data=json.dumps({"liquid_savings": 100000, "monthly_income": 50000, "monthly_expenses": 45000, "income_drop_pct": 50, "emergency_shock": 30000}),
            content_type="application/json",
        )
        self.assertEqual(sim.status_code, 200)
        self.assertEqual(len(sim.json()["trajectory"]), 12)

    @override_settings(GEMINI_API_KEY='')
    def test_jarvis_jd_match_and_health_endpoints(self):
        health = self.client.get("/api/health/")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json()["database"], "connected")

        jd = self.client.post(
            "/api/jarvis/jd-match/",
            data=json.dumps({"job_description": "Looking for a Python Django REST Framework and React developer with PostgreSQL and AI integration skills."}),
            content_type="application/json",
        )
        self.assertEqual(jd.status_code, 200)
        self.assertIn("match_score", jd.json())
        self.assertIn("honest_gaps", jd.json())

        chat = self.client.post(
            "/api/jarvis/chat/",
            data=json.dumps({"message": "Explain PayMatch AI trade-offs"}),
            content_type="application/json",
        )
        self.assertEqual(chat.status_code, 200)
        self.assertEqual(chat.json()["action"], "SCROLL_PROJECTS")
        self.assertIn("PayMatch AI", chat.json()["reply"])

    def test_contact_validation_rejects_bad_email_and_saves_valid(self):
        bad = self.client.post(
            "/api/contact/",
            data=json.dumps({"name": "Alice", "email": "not-an-email", "message": "Hi"}),
            content_type="application/json",
        )
        self.assertEqual(bad.status_code, 400)

        good = self.client.post(
            "/api/contact/",
            data=json.dumps({"name": "Recruiter", "email": "hr@example.com", "message": "Interview invite"}),
            content_type="application/json",
        )
        self.assertEqual(good.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

    @override_settings(PORTFOLIO_ADMIN_USERNAME='testadmin', PORTFOLIO_ADMIN_PASSWORD='test-only-password')
    def test_analytics_requires_auth_and_tracks_events(self):
        self.assertEqual(self.client.get("/api/analytics/summary/").status_code, 401)
        self.client.post("/api/sandbox/finsight/", data="{}", content_type="application/json")
        track = self.client.post(
            "/api/analytics/track/",
            data=json.dumps({"event_type": "resume_download", "metadata": "backend"}),
            content_type="application/json",
        )
        self.assertEqual(track.status_code, 200)

        login_res = self.client.post(
            "/api/auth/login/",
            data=json.dumps({"username": "testadmin", "password": "test-only-password"}),
            content_type="application/json",
        )
        token = login_res.json()["token"]
        summary = self.client.get("/api/analytics/summary/", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(summary.json()["counts"]["sandbox_finsight"], 1)
        self.assertEqual(summary.json()["counts"]["resume_download"], 1)

    def test_github_summary_endpoint_returns_valid_structure(self):
        res = self.client.get("/api/github/summary/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["username"], "skiran-ai")
        self.assertIn("repos", res.json())
