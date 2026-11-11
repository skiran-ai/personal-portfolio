"""Live GitHub activity fetcher with in-memory TTL cache and graceful fallback."""

from datetime import datetime, timezone
import json
import time
import urllib.request

GITHUB_USERNAME = "skiran-ai"
CACHE_TTL_SECONDS = 600  # 10 minutes
_CACHE = {"timestamp": 0.0, "data": None}


def _format_relative_time(iso_str: str) -> str:
    if not iso_str:
        return "recently"
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        delta = max(0, int((datetime.now(timezone.utc) - dt).total_seconds()))
        if delta < 60:
            return f"{delta}s ago"
        if delta < 3600:
            return f"{delta // 60}m ago"
        if delta < 86400:
            return f"{delta // 3600}h ago"
        return f"{delta // 86400}d ago"
    except Exception:
        return "recently"


def _fetch_json(url: str, timeout: float = 4.0):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "suryakiran-portfolio-telemetry",
            "Accept": "application/vnd.github+json",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_github_summary(force_refresh: bool = False) -> dict:
    """Return cached public GitHub repos & push telemetry for @skiran-ai."""
    now = time.time()
    if not force_refresh and _CACHE["data"] is not None and (now - _CACHE["timestamp"]) < CACHE_TTL_SECONDS:
        return {**_CACHE["data"], "cached": True}

    try:
        user_data = _fetch_json(f"https://api.github.com/users/{GITHUB_USERNAME}")
        repos_raw = _fetch_json(f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=6")
        events_raw = _fetch_json(f"https://api.github.com/users/{GITHUB_USERNAME}/events/public?per_page=5")

        repos = [
            {
                "name": r.get("name"),
                "full_name": r.get("full_name"),
                "url": r.get("html_url"),
                "description": r.get("description") or "Full-stack Python/Django & React engineering repository.",
                "language": r.get("language") or "JavaScript",
                "stars": r.get("stargazers_count", 0),
                "pushed_at": r.get("pushed_at"),
                "pushed_ago": _format_relative_time(r.get("pushed_at")),
            }
            for r in repos_raw
            if not r.get("fork")
        ]

        latest_push_iso = None
        if events_raw:
            for ev in events_raw:
                if ev.get("type") == "PushEvent":
                    latest_push_iso = ev.get("created_at")
                    break
        if not latest_push_iso and repos:
            latest_push_iso = repos[0].get("pushed_at")

        payload = {
            "source": "github_live",
            "username": user_data.get("login", GITHUB_USERNAME),
            "profile_url": user_data.get("html_url", f"https://github.com/{GITHUB_USERNAME}"),
            "public_repos": user_data.get("public_repos", len(repos)),
            "last_pushed_at": latest_push_iso,
            "last_push_ago": _format_relative_time(latest_push_iso) if latest_push_iso else "active",
            "repos": repos,
            "recent_events_count": len(events_raw) if isinstance(events_raw, list) else 0,
        }
        _CACHE["data"] = payload
        _CACHE["timestamp"] = now
        return {**payload, "cached": False}
    except Exception:
        fallback = _CACHE["data"] or {
            "source": "github_fallback",
            "username": GITHUB_USERNAME,
            "profile_url": f"https://github.com/{GITHUB_USERNAME}",
            "public_repos": 1,
            "last_pushed_at": None,
            "last_push_ago": "verified",
            "repos": [
                {
                    "name": "personal-portfolio",
                    "full_name": f"{GITHUB_USERNAME}/personal-portfolio",
                    "url": f"https://github.com/{GITHUB_USERNAME}/personal-portfolio",
                    "description": "React 19 + Django REST + Gemini AI portfolio with executable FinTech sandboxes.",
                    "language": "JavaScript",
                    "stars": 0,
                    "pushed_ago": "recent",
                }
            ],
            "recent_events_count": 0,
        }
        return {**fallback, "cached": True}
