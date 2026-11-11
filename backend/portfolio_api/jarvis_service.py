"""
Jarvis Agentic AI service powered by Google Gemini (google-genai Interactions API)
with Pydantic-enforced structured outputs and an honest grounded fallback when
GEMINI_API_KEY is not configured.
"""

import json
import re
from typing import List
from django.conf import settings
from pydantic import BaseModel, Field
from .portfolio_data import PROFILE_INFO

GEMINI_MODEL = "gemini-3.5-flash-lite"

ALLOWED_ACTIONS = {
    "NONE",
    "SCROLL_ABOUT",
    "SCROLL_SKILLS",
    "SCROLL_PROJECTS",
    "SCROLL_CONTACT",
    "OPEN_RESUME",
    "OPEN_SANDBOX_FINSIGHT",
    "OPEN_SANDBOX_PAYMATCH",
    "OPEN_SANDBOX_FINSIM",
}


class JarvisChatOutput(BaseModel):
    reply: str = Field(description="Clear, concise, factual answer grounded strictly in Suryakiran's verified profile and projects.")
    action: str = Field(
        description=(
            "Optional UI action. Must be exactly one of: NONE, SCROLL_ABOUT, SCROLL_SKILLS, "
            "SCROLL_PROJECTS, SCROLL_CONTACT, OPEN_RESUME, OPEN_SANDBOX_FINSIGHT, "
            "OPEN_SANDBOX_PAYMATCH, OPEN_SANDBOX_FINSIM."
        )
    )
    suggested_followups: List[str] = Field(description="Up to 3 short follow-up questions.")


class JDMatchOutput(BaseModel):
    match_score: int = Field(ge=0, le=100, description="Realistic fit score from 0 to 100 based strictly on verified evidence.")
    verdict: str = Field(description="One-sentence hiring verdict summarizing fit.")
    matched_skills: List[str] = Field(description="Skills in the JD directly backed by Suryakiran's projects or coursework.")
    project_evidence: List[str] = Field(description="Specific projects/components from Suryakiran's portfolio proving readiness.")
    honest_gaps: List[str] = Field(description="Requirements in the JD not yet proven in production or requiring ramp-up.")
    interview_questions: List[str] = Field(description="Up to 3 targeted technical interview questions a hiring manager can ask Suryakiran.")


def _build_grounding_context(projects: list[dict]) -> str:
    compact_projects = [
        {
            "title": p.get("title"),
            "tagline": p.get("tagline"),
            "problem_statement": p.get("problem_statement"),
            "architecture_summary": p.get("architecture_summary"),
            "engineering_tradeoffs": p.get("engineering_tradeoffs"),
            "technologies": p.get("technologies"),
            "sandbox_slug": p.get("sandbox_slug"),
            "has_exact_repo": p.get("has_exact_repo"),
            "github_url": p.get("github_url"),
            "live_url": p.get("live_url"),
        }
        for p in projects
    ]
    grounding = {
        "profile": PROFILE_INFO,
        "live_projects": compact_projects,
    }
    return json.dumps(grounding, indent=2)


def _get_gemini_client():
    api_key = getattr(settings, "GEMINI_API_KEY", "").strip()
    if not api_key:
        return None
    from google import genai
    return genai.Client(api_key=api_key)


def _fallback_chat(user_message: str, projects: list[dict]) -> dict:
    """Honest deterministic retrieval fallback when GEMINI_API_KEY is not configured."""
    q = user_message.lower()
    tokens = set(re.findall(r"[a-z0-9]+", q))

    if any(k in tokens for k in ("sandbox", "demo", "try", "test")):
        if "paymatch" in tokens or "reconcil" in q:
            return {
                "reply": "Opening the PayMatch AI live reconciliation sandbox so you can test gateway vs ledger discrepancy detection directly against the Django backend.",
                "action": "OPEN_SANDBOX_PAYMATCH",
                "suggested_followups": ["Explain PayMatch trade-offs", "Open FinSight AI sandbox", "Analyze a Job Description"],
                "mode": "grounded_local",
            }
        if "finsim" in tokens or "stress" in tokens or "simulat" in q:
            return {
                "reply": "Launching the FinSim macroeconomic stress simulator. Adjust inflation, income shock, and emergency expenses to compute runway.",
                "action": "OPEN_SANDBOX_FINSIM",
                "suggested_followups": ["How does FinSim calculate runway?", "Open PayMatch AI sandbox", "View ATS Resume"],
                "mode": "grounded_local",
            }
        return {
            "reply": "Launching the FinSight AI live cash-flow analyzer sandbox powered by the Django backend.",
            "action": "OPEN_SANDBOX_FINSIGHT",
            "suggested_followups": ["Test PayMatch AI sandbox", "Test FinSim sandbox", "Explain FinSight architecture"],
            "mode": "grounded_local",
        }

    if any(w in tokens for w in ("resume", "cv", "pdf")) or "download" in q:
        return {
            "reply": "Opening Suryakiran's ATS Resume and Curriculum Vitae viewer. You can inspect the plain-text ATS layout or download the PDF directly.",
            "action": "OPEN_RESUME",
            "suggested_followups": ["Analyze fit for a Job Description", "What are his core Django skills?", "How can I contact him?"],
            "mode": "grounded_local",
        }

    if projects and (
        any(w in tokens for w in ("project", "projects", "finsight", "paymatch", "finsim", "architecture", "tradeoff", "tradeoffs"))
        or "trade-off" in q
    ):
        best = max(
            projects,
            key=lambda p: len(tokens & set(re.findall(r"[a-z0-9]+", json.dumps(p).lower()))),
        )
        return {
            "reply": (
                f"{best['title']} — {best.get('tagline', '')}\n"
                f"• Problem: {best.get('problem_statement', best.get('description'))}\n"
                f"• Trade-off: {best.get('engineering_tradeoffs') or 'See the Under-the-Hood inspector on the project card.'}\n"
                f"Tip: Add GEMINI_API_KEY in backend/.env to enable open-ended Gemini 3.8 Flash ({GEMINI_MODEL}) technical Q&A."
            ),
            "action": "SCROLL_PROJECTS",
            "suggested_followups": ["Launch interactive sandbox", "Analyze fit against a JD", "Open ATS Resume"],
            "mode": "grounded_local",
        }

    if any(w in q for w in ("contact", "email", "phone", "hire", "reach", "location", "available")):
        return {
            "reply": (
                f"Suryakiran P J is based in {PROFILE_INFO['location']} ({PROFILE_INFO['availability']}).\n"
                f"• Email: {PROFILE_INFO['email']}\n"
                f"• Phone: {PROFILE_INFO['phone']}\n"
                f"• LinkedIn: {PROFILE_INFO['socials']['linkedin']}"
            ),
            "action": "SCROLL_CONTACT",
            "suggested_followups": ["Open ATS Resume", "Paste a JD to check fit", "Explore live project sandboxes"],
            "mode": "grounded_local",
        }

    if any(w in q for w in ("education", "degree", "college", "avodha", "kmm", "study")):
        edu_lines = "\n".join(
            f"• {e['degree']} — {e['institution']} ({e['period']})"
            for e in PROFILE_INFO["education"]
            if e.get("tier") == "primary"
        )
        return {
            "reply": f"Suryakiran's core technical & academic credentials:\n{edu_lines}",
            "action": "SCROLL_ABOUT",
            "suggested_followups": ["Show his project evidence", "What is his engineering approach?", "Open ATS Resume"],
            "mode": "grounded_local",
        }

    if any(w in tokens for w in ("skill", "skills", "stack", "tech", "python", "django", "react", "ai", "gemini", "postgres", "postgresql")):
        return {
            "reply": (
                "Suryakiran focuses on Python 3, Django & DRF backends, PostgreSQL/SQLite modeling, React 19 frontends, "
                "and schema-grounded Gemini/LangChain AI integrations. Check the Evidence-Based Tech Stack section to jump straight to project proof."
            ),
            "action": "SCROLL_SKILLS",
            "suggested_followups": ["Try FinSight AI sandbox", "Try PayMatch AI sandbox", "Run a JD Match check"],
            "mode": "grounded_local",
        }

    return {
        "reply": (
            "I am running in grounded local retrieval mode (GEMINI_API_KEY is not configured in backend/.env yet). "
            "I can still navigate you to Suryakiran's live project sandboxes (FinSight AI, PayMatch AI, FinSim), "
            "evidence-backed skills, ATS Resume, or run a deterministic JD overlap analysis in the JD Fit tab."
        ),
        "action": "NONE",
        "suggested_followups": ["Open FinSight AI sandbox", "What is his Django & AI stack?", "Open ATS Resume"],
        "mode": "grounded_local",
    }


def _fallback_jd_match(job_description: str, projects: list[dict]) -> dict:
    """Honest keyword & evidence overlap analyzer when GEMINI_API_KEY is unavailable."""
    jd_lower = job_description.lower()
    evidence_catalog = [
        ("Python", "FinSight AI / PayMatch AI / FinSim (Backend engines & simulation logic)"),
        ("Django", "Portfolio API / FinSight AI / PayMatch AI (REST APIs, ORM, signed auth)"),
        ("REST", "Django REST Framework endpoints & explicit API contracts"),
        ("PostgreSQL", "Normalized schemas & reconciliation batch pipelines"),
        ("SQLite", "Local relational persistence & Django ORM migrations"),
        ("React", "Modular React 19 portfolio SPA & interactive sandbox UI"),
        ("JavaScript", "ES6+ frontend state management & API fallback architecture"),
        ("LangChain", "FinSight AI transaction parsing & categorization chains"),
        ("AI", "Jarvis structured output agent & FinSight/PayMatch classification"),
        ("LLM", "Structured JSON schema grounding & deterministic verification"),
        ("Docker", "Containerization fundamentals for reproducible environments"),
        ("Git", "Versioned development workflow on GitHub"),
    ]
    matched = []
    project_evidence = []
    for kw, proof in evidence_catalog:
        if kw.lower() in jd_lower:
            matched.append(kw)
            project_evidence.append(f"{kw}: {proof}")

    common_gaps = []
    for gap_kw, label in [
        ("kubernetes", "Production Kubernetes orchestration"),
        ("aws", "Multi-region AWS cloud infrastructure at scale"),
        ("graphql", "GraphQL schema federation"),
        ("5+ years", "Senior 5+ years industry tenure (Entry-level / B.Sc 2026 + Avodha 6-mo intensive)"),
        ("3+ years", "3+ years formal production experience"),
        ("typescript", "Large-scale TypeScript codebases"),
    ]:
        if gap_kw in jd_lower:
            common_gaps.append(label)

    if not common_gaps:
        common_gaps.append("Formal multi-year enterprise tenure (strong academic CS + intensive full-stack portfolio projects instead).")

    score = min(92, max(45, 50 + len(matched) * 6 - len(common_gaps) * 5))
    return {
        "match_score": score,
        "verdict": f"Grounded local analysis: {len(matched)} core stack overlaps verified across Suryakiran's Django & AI projects (configure GEMINI_API_KEY for deep LLM reasoning).",
        "matched_skills": matched or ["Python", "Django", "React", "REST APIs"],
        "project_evidence": project_evidence or [f"{p['title']}: {', '.join(p.get('technologies', []))}" for p in projects[:3]],
        "honest_gaps": common_gaps,
        "interview_questions": [
            "How did you prevent false-positive fuzzy matches in PayMatch AI when duplicate amounts appear?",
            "Why did you keep cash-flow arithmetic deterministic in Python instead of relying on an LLM in FinSight AI?",
            "How did you secure Django admin mutations without exposing secrets in the React client?",
        ],
        "mode": "grounded_local",
    }


def chat_with_jarvis(user_message: str, projects: list[dict], history: list[dict] | None = None) -> dict:
    """Process a visitor question with Gemini 3.8 Flash structured output or honest grounded fallback."""
    client = _get_gemini_client()
    if client is None:
        return _fallback_chat(user_message, projects)

    grounding = _build_grounding_context(projects)
    system_instruction = (
        "You are Jarvis, the technical engineering representative for Suryakiran P J's portfolio.\n"
        "STRICT HONESTY RULES:\n"
        "1. Answer ONLY from the verified JSON context provided below. Never invent years of experience, employers, metrics, or unverified links.\n"
        "2. If asked about live repos when has_exact_repo is false, honestly explain that the project showcases a live interactive sandbox and architecture breakdown here, while exact repo URLs are being published.\n"
        "3. Keep answers crisp, concrete, and engineering-focused.\n"
        "4. Choose the best UI `action` only when helpful (otherwise 'NONE').\n\n"
        f"VERIFIED PORTFOLIO CONTEXT:\n{grounding}"
    )

    convo_parts = []
    if history:
        for item in history[-6:]:
            role = "Visitor" if item.get("sender") == "user" else "Jarvis"
            text = str(item.get("text", "")).strip()
            if text:
                convo_parts.append(f"{role}: {text}")
    convo_parts.append(f"Visitor: {user_message}")
    prompt_input = "\n".join(convo_parts)

    try:
        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            system_instruction=system_instruction,
            input=prompt_input,
            generation_config={"thinking_level": "minimal"},
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": JarvisChatOutput.model_json_schema(),
            },
            store=False,
            timeout=18.0,
        )
        parsed = JarvisChatOutput.model_validate_json(interaction.output_text)
        result = parsed.model_dump()
        if result.get("action") not in ALLOWED_ACTIONS:
            result["action"] = "NONE"
        result["suggested_followups"] = (result.get("suggested_followups") or [])[:3]
        result["mode"] = "gemini_live"
        result["model"] = GEMINI_MODEL
        return result
    except Exception as exc:
        fallback = _fallback_chat(user_message, projects)
        fallback["gemini_notice"] = f"Live Gemini call fell back safely ({type(exc).__name__})."
        return fallback


def analyze_jd_match(job_description: str, projects: list[dict]) -> dict:
    """Evaluate how well Suryakiran matches a pasted Job Description with honest gaps."""
    client = _get_gemini_client()
    if client is None:
        return _fallback_jd_match(job_description, projects)

    grounding = _build_grounding_context(projects)
    system_instruction = (
        "You are an objective technical hiring evaluator assessing Suryakiran P J against a recruiter's Job Description.\n"
        "STRICT RULES:\n"
        "1. Score honestly (0-100) using ONLY the verified profile & projects below.\n"
        "2. Never exaggerate experience or claim production experience he does not have.\n"
        "3. Explicitly call out honest gaps (e.g., if JD asks for 5+ years, AWS EKS, or Go, state it transparently while noting transferable Python/Django strengths).\n"
        "4. Cite concrete projects (FinSight AI, PayMatch AI, FinSim, Portfolio API) as evidence.\n\n"
        f"VERIFIED CANDIDATE CONTEXT:\n{grounding}"
    )

    try:
        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            system_instruction=system_instruction,
            input=f"Evaluate candidate fit for this Job Description:\n\n{job_description[:6000]}",
            generation_config={"thinking_level": "low"},
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": JDMatchOutput.model_json_schema(),
            },
            store=False,
            timeout=22.0,
        )
        parsed = JDMatchOutput.model_validate_json(interaction.output_text)
        result = parsed.model_dump()
        result["mode"] = "gemini_live"
        result["model"] = GEMINI_MODEL
        return result
    except Exception as exc:
        fallback = _fallback_jd_match(job_description, projects)
        fallback["gemini_notice"] = f"Live Gemini call fell back safely ({type(exc).__name__})."
        return fallback
