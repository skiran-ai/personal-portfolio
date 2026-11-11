"""Single source of truth for Suryakiran P J's verified engineering profile and defaults."""

PROFILE_INFO = {
    "name": "Suryakiran P J",
    "role": "AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)",
    "location": "Ernakulam, Kerala, India",
    "availability": "Immediate • Open to Remote & Relocation (Kochi / Bengaluru / Hybrid)",
    "email": "suryakiranpjineesh@gmail.com",
    "phone": "+91 8129867662",
    "portfolio": "https://skiran.vercel.app",
    "socials": {
        "github": "https://github.com/skiran-ai",
        "linkedin": "https://www.linkedin.com/in/surya-kiran-967659351",
        "email": "mailto:suryakiranpjineesh@gmail.com",
    },
    "engineering_pillars": [
        {
            "id": "backend",
            "title": "Reliable Django & API Engineering",
            "summary": "Designing normalized schemas, atomic financial/workflow endpoints, explicit error contracts, and Token/Session security in Python & DRF.",
        },
        {
            "id": "ai",
            "title": "Grounded Agentic AI Integration",
            "summary": "Using structured JSON schemas, tool-calling, and deterministic validation layers so LLMs execute real workflows instead of fragile prompt guesses.",
        },
        {
            "id": "fde",
            "title": "Forward-Deployed Speed & Ownership",
            "summary": "Translating ambiguous business pain points into testable React + Django prototypes with interactive sandboxes and observable telemetry.",
        },
    ],
    "education": [
        {
            "degree": "Python Django Full Stack Development (6-Month Intensive)",
            "institution": "Avodha",
            "location": "Vyttila, Ernakulam, Kerala",
            "period": "Month 5 of 6 Completed",
            "tier": "primary",
            "highlight": "Python 3, Django, Django REST Framework (DRF), PostgreSQL/SQLite, Auth & API Security, Full-Stack Deployment.",
        },
        {
            "degree": "B.Sc Computer Science",
            "institution": "KMM College",
            "location": "Thrikkakara, Ernakulam, Kerala",
            "period": "Coursework Completed (2023 – 2026)",
            "tier": "primary",
            "highlight": "Data Structures & Algorithms, OOP, DBMS, Software Engineering, Operating Systems, Computer Networks.",
        },
        {
            "degree": "Higher Secondary (HSS) — Computer Science",
            "institution": "Sahodaran Memorial HSS",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Completed",
            "tier": "secondary",
            "highlight": "Computer Applications, Mathematics & Analytical Reasoning.",
        },
        {
            "degree": "SSLC",
            "institution": "Rama Varma Union High School",
            "location": "Cherai, Ernakulam, Kerala",
            "period": "Completed",
            "tier": "secondary",
            "highlight": "Secondary schooling with focus on Science & Mathematics.",
        },
    ],
    # Evidence-based skills (no fake percentage bars)
    "skill_matrix": [
        {
            "category": "Python & Django Backend",
            "skills": [
                {"name": "Python 3.x", "tier": "Core", "evidence": ["FinSight AI", "PayMatch AI", "FinSim"], "note": "Deterministic logic, data pipelines, simulation engines"},
                {"name": "Django & DRF", "tier": "Core", "evidence": ["FinSight AI", "PayMatch AI", "Portfolio API"], "note": "REST APIs, ORM optimization, signed token auth"},
                {"name": "PostgreSQL & SQLite", "tier": "Applied", "evidence": ["FinSight AI", "PayMatch AI"], "note": "Normalized schemas, ACID transactions, indexing"},
                {"name": "API Security & Auth", "tier": "Applied", "evidence": ["Portfolio API", "PayMatch AI"], "note": "Bearer signing, CORS scoping, input validation"},
            ],
        },
        {
            "category": "Agentic AI & LLM Systems",
            "skills": [
                {"name": "Gemini API & Structured Output", "tier": "Core", "evidence": ["Jarvis Agent", "FinSight AI"], "note": "Pydantic schema-enforced LLM responses"},
                {"name": "Tool-Calling & Action Agents", "tier": "Applied", "evidence": ["Jarvis Agent", "PayMatch AI"], "note": "Intent-to-UI actions & automated triage"},
                {"name": "Prompt & Context Grounding", "tier": "Applied", "evidence": ["Jarvis Agent", "FinSim"], "note": "Zero-hallucination retrieval over verified data"},
                {"name": "LangChain Workflows", "tier": "Applied", "evidence": ["FinSight AI"], "note": "Statement parsing & expense classification chains"},
            ],
        },
        {
            "category": "Frontend & Interactive UI",
            "skills": [
                {"name": "React 19 & Hooks", "tier": "Core", "evidence": ["Portfolio UI", "FinSim"], "note": "Modular state architecture & API fallbacks"},
                {"name": "JavaScript (ES6+) & Vite", "tier": "Core", "evidence": ["Portfolio UI", "FinSight AI"], "note": "Fast bundling, responsive telemetry & command UI"},
                {"name": "Tailwind CSS & Glass UI", "tier": "Applied", "evidence": ["Portfolio UI"], "note": "Accessible layouts & reduced-motion support"},
                {"name": "Three.js / WebGL", "tier": "Applied", "evidence": ["Portfolio UI", "FinSim"], "note": "Lightweight 3D depth with 2D fallback"},
            ],
        },
        {
            "category": "DevOps & Engineering Craft",
            "skills": [
                {"name": "Git & GitHub", "tier": "Core", "evidence": ["Portfolio API", "FinSight AI"], "note": "Branching, clean diffs, repository management"},
                {"name": "REST Testing & Debugging", "tier": "Applied", "evidence": ["PayMatch AI", "Portfolio API"], "note": "Django TestCase & endpoint contract checks"},
                {"name": "Docker Fundamentals", "tier": "Applied", "evidence": ["PayMatch AI", "FinSim"], "note": "Containerized service reproducibility"},
                {"name": "Linux CLI & Deployment", "tier": "Applied", "evidence": ["Portfolio API"], "note": "Env config, CORS/reverse proxy setup"},
            ],
        },
    ],
}

PROJECT_METADATA_DEFAULTS = {
    "finsight": {
        "tagline": "Cash-Flow Leak Detector & 90-Day Liquidity Forecaster",
        "problem_statement": "Individuals struggle to spot recurring subscription creep and end-of-month balance shortfalls across uncategorized bank statements.",
        "architecture_summary": "React Client -> Django REST API -> Deterministic Leak & Burn-Rate Engine + Gemini/LangChain Classifier -> PostgreSQL Ledger",
        "engineering_tradeoffs": "Kept cash-flow math & burn-rate projections deterministic in Python while confining LLM usage to fuzzy merchant categorization — eliminating arithmetic hallucinations.",
        "api_contract_sample": "POST /api/sandbox/finsight/ -> { monthly_income, transactions[] } => { net_cashflow, leaks[], forecast_3m[] }",
        "sandbox_slug": "finsight",
    },
    "paymatch": {
        "tagline": "ACID-Safe Payment Reconciliation & Fee Anomaly Engine",
        "problem_statement": "Multi-gateway merchant streams suffer from settlement delays, silent gateway fee mismatches, and missing internal ledger entries.",
        "architecture_summary": "Gateway CSV/Webhook -> Django Reconciliation Pipeline (Exact ID -> Fee-Delta -> Fuzzy Reference) -> Audit Discrepancy Report",
        "engineering_tradeoffs": "Used multi-pass matching (exact ID first, then tolerance-bounded fuzzy reference via SequenceMatcher) inside atomic transactions to avoid false-positive matches on duplicate amounts.",
        "api_contract_sample": "POST /api/sandbox/paymatch/ -> { gateway_records[], ledger_records[] } => { matched, fee_anomalies, missing_in_ledger[] }",
        "sandbox_slug": "paymatch",
    },
    "finsim": {
        "tagline": "Macroeconomic Shock & Personal Runway Stress Simulator",
        "problem_statement": "Static budgets break during inflation spikes, sudden medical costs, or temporary income drops because they lack time-series shock modeling.",
        "architecture_summary": "Scenario Sliders (React) -> Django Deterministic Runway Engine -> Month-by-Month Shock Trajectory & Contingency Plan",
        "engineering_tradeoffs": "Modeled compounding monthly inflation and shock events as pure stateless computations so simulation runs stay under 15ms without hitting DB locks.",
        "api_contract_sample": "POST /api/sandbox/finsim/ -> { savings, income, expenses, inflation_pct, income_drop_pct, emergency_shock } => { runway_months, trajectory[] }",
        "sandbox_slug": "finsim",
    },
}


def infer_sandbox_slug(title: str) -> str:
    lower = (title or "").lower()
    if "finsight" in lower:
        return "finsight"
    if "paymatch" in lower:
        return "paymatch"
    if "finsim" in lower:
        return "finsim"
    return ""
