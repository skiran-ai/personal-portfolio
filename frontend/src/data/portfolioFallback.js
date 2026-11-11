/**
 * Verified client-safe fallback data and deterministic sandbox mirror.
 * Ensures the portfolio remains 100% functional and interactive even when
 * hosted statically (e.g., Vercel) without the local Django backend running.
 */

export const FALLBACK_PROFILE = {
  name: "Suryakiran P J",
  role: "AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)",
  location: "Ernakulam, Kerala, India",
  availability: "Immediate • Open to Remote & Relocation (Kochi / Bengaluru / Hybrid)",
  email: "suryakiranpjineesh@gmail.com",
  phone: "+91 8129867662",
  portfolio: "https://skiran.vercel.app",
  socials: {
    github: "https://github.com/skiran-ai",
    linkedin: "https://www.linkedin.com/in/surya-kiran-967659351",
    email: "mailto:suryakiranpjineesh@gmail.com",
  },
  engineering_pillars: [
    {
      id: "backend",
      title: "Reliable Django & API Engineering",
      summary:
        "Designing normalized schemas, atomic workflow endpoints, explicit API error contracts, and signed token security in Python & DRF.",
    },
    {
      id: "ai",
      title: "Grounded Agentic AI Integration",
      summary:
        "Using Pydantic/JSON schemas and deterministic validation layers so LLMs drive real workflows instead of fragile free-form guesses.",
    },
    {
      id: "fde",
      title: "Forward-Deployed Ownership",
      summary:
        "Translating messy business problems into interactive React + Django systems with verifiable sandboxes and transparent telemetry.",
    },
  ],
  education: [
    {
      degree: "Python Django Full Stack Development (6-Month Intensive)",
      institution: "Avodha",
      location: "Vyttila, Ernakulam, Kerala",
      period: "Month 5 of 6 Completed",
      tier: "primary",
      highlight:
        "Python 3, Django, Django REST Framework (DRF), PostgreSQL/SQLite, Auth & API Security, Full-Stack Deployment.",
    },
    {
      degree: "B.Sc Computer Science",
      institution: "KMM College",
      location: "Thrikkakara, Ernakulam, Kerala",
      period: "Coursework Completed (2023 – 2026)",
      tier: "primary",
      highlight:
        "Data Structures & Algorithms, OOP, DBMS, Software Engineering, Operating Systems, Computer Networks.",
    },
    {
      degree: "Higher Secondary (HSS) — Computer Science",
      institution: "Sahodaran Memorial HSS",
      location: "Cherai, Ernakulam, Kerala",
      period: "Completed",
      tier: "secondary",
      highlight: "Computer Applications, Mathematics & Analytical Reasoning.",
    },
    {
      degree: "SSLC",
      institution: "Rama Varma Union High School",
      location: "Cherai, Ernakulam, Kerala",
      period: "Completed",
      tier: "secondary",
      highlight: "Secondary schooling with focus on Science & Mathematics.",
    },
  ],
  skill_matrix: [
    {
      category: "Python & Django Backend",
      skills: [
        {
          name: "Python 3.x",
          tier: "Core",
          evidence: ["FinSight AI", "PayMatch AI", "FinSim"],
          note: "Deterministic cash-flow logic, multi-pass reconciliation & simulation engines",
        },
        {
          name: "Django & DRF",
          tier: "Core",
          evidence: ["FinSight AI", "PayMatch AI", "Portfolio API"],
          note: "REST APIs, ORM optimization, HMAC-signed Bearer auth & migrations",
        },
        {
          name: "PostgreSQL & SQLite",
          tier: "Applied",
          evidence: ["FinSight AI", "PayMatch AI"],
          note: "Normalized ledger schemas, ACID transaction safety & query indexing",
        },
        {
          name: "API Security & Auth",
          tier: "Applied",
          evidence: ["Portfolio API", "PayMatch AI"],
          note: "Token signing, CORS scoping, HTML escaping & server-side validation",
        },
      ],
    },
    {
      category: "Agentic AI & LLM Systems",
      skills: [
        {
          name: "Gemini API & Structured Output",
          tier: "Core",
          evidence: ["Jarvis Agent", "FinSight AI"],
          note: "Pydantic schema-enforced Responses via google-genai Interactions API",
        },
        {
          name: "Tool-Calling & Action Agents",
          tier: "Applied",
          evidence: ["Jarvis Agent", "PayMatch AI"],
          note: "Intent-to-UI triggers, JD fit evaluation & anomaly triage",
        },
        {
          name: "Context Grounding & Guardrails",
          tier: "Applied",
          evidence: ["Jarvis Agent", "FinSim"],
          note: "Zero-hallucination context injection over verified DB records",
        },
        {
          name: "LangChain Workflows",
          tier: "Applied",
          evidence: ["FinSight AI"],
          note: "Automated transaction classification & statement parsing chains",
        },
      ],
    },
    {
      category: "Frontend & Interactive UI",
      skills: [
        {
          name: "React 19 & Hooks",
          tier: "Core",
          evidence: ["Portfolio UI", "FinSim"],
          note: "Modular component state, command palette & resilient fallback UI",
        },
        {
          name: "JavaScript (ES6+) & Vite",
          tier: "Core",
          evidence: ["Portfolio UI", "FinSight AI"],
          note: "Fast bundling, interactive sandboxes & live telemetry badges",
        },
        {
          name: "Tailwind CSS & Accessible UI",
          tier: "Applied",
          evidence: ["Portfolio UI"],
          note: "Responsive layouts, clean contrast & reduced-motion compliance",
        },
        {
          name: "Three.js / WebGL",
          tier: "Applied",
          evidence: ["Portfolio UI", "FinSim"],
          note: "Lightweight background depth with automatic 2D Canvas fallback",
        },
      ],
    },
    {
      category: "DevOps & Engineering Craft",
      skills: [
        {
          name: "Git & GitHub",
          tier: "Core",
          evidence: ["Portfolio API", "FinSight AI"],
          note: "Clean diffs, branch history & environment hygiene",
        },
        {
          name: "API Testing & Verification",
          tier: "Applied",
          evidence: ["PayMatch AI", "Portfolio API"],
          note: "Automated Django TestCase suites covering auth, sandboxes & validation",
        },
        {
          name: "Docker Fundamentals",
          tier: "Applied",
          evidence: ["PayMatch AI", "FinSim"],
          note: "Containerized local/staging service parity",
        },
        {
          name: "Deployment & Diagnostics",
          tier: "Applied",
          evidence: ["Portfolio API"],
          note: "Health checks, latency reporting, Vercel + Django split setup",
        },
      ],
    },
  ],
};

export const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "FinSight AI",
    tagline: "Cash-Flow Leak Detector & 90-Day Liquidity Forecaster",
    description:
      "Intelligent personal finance and cash-flow forecasting platform combining deterministic Python leak detection with LLM-assisted transaction categorization.",
    problem_statement:
      "Individuals often miss recurring subscription leaks and end-of-month liquidity shortfalls across messy uncategorized transaction histories.",
    architecture_summary:
      "React Client -> Django REST API -> Deterministic Leak & Burn-Rate Engine + Gemini/LangChain Classifier -> PostgreSQL Ledger",
    engineering_tradeoffs:
      "Kept all arithmetic, burn-rate, and 3-month projections deterministic in Python while confining AI to fuzzy merchant classification — preventing LLM math hallucinations.",
    api_contract_sample:
      "POST /api/sandbox/finsight/ -> { monthly_income, current_balance, transactions[] } => { summary, leaks[], forecast_3m[] }",
    sandbox_slug: "finsight",
    technologies: ["Python", "Django", "DRF", "LangChain", "PostgreSQL", "React"],
    github_url: "https://github.com/skiran-ai",
    has_exact_repo: false,
    live_url: "",
    featured: true,
  },
  {
    id: 2,
    title: "PayMatch AI",
    tagline: "Multi-Pass Payment Reconciliation & Fee Anomaly Engine",
    description:
      "Automated payment reconciliation and discrepancy detection engine identifying gateway fee anomalies, retry suffixes, and missing ledger settlements.",
    problem_statement:
      "Merchant payment streams suffer from silent gateway fee overcharges, settlement delays, and retry-suffix reference mismatches against internal ledgers.",
    architecture_summary:
      "Gateway Settlement Feed -> Django Multi-Pass Matcher (Exact Ref -> Fee-Delta Tolerance -> Fuzzy Similarity) -> Discrepancy Audit Output",
    engineering_tradeoffs:
      "Runs exact-ID matching before tolerance-bounded fuzzy matching inside atomic DB units so duplicate transaction amounts never false-match.",
    api_contract_sample:
      "POST /api/sandbox/paymatch/ -> { fee_tolerance, gateway_records[], ledger_records[] } => { counts, total_discrepancy_amount, records[] }",
    sandbox_slug: "paymatch",
    technologies: ["Python", "Django DRF", "PostgreSQL", "Fuzzy Matching", "Docker", "REST APIs"],
    github_url: "https://github.com/skiran-ai",
    has_exact_repo: false,
    live_url: "",
    featured: true,
  },
  {
    id: 3,
    title: "FinSim",
    tagline: "Macroeconomic Shock & Personal Runway Stress Simulator",
    description:
      "Deterministic financial stress-testing simulator modeling inflation spikes, income drops, and emergency shocks across a multi-month horizon.",
    problem_statement:
      "Static monthly budgets break down under real-world shocks like inflation spikes, medical emergencies, or temporary income drops.",
    architecture_summary:
      "Interactive Shock Sliders (React) -> Stateless Django Simulation Endpoint -> Monthly Compounding Trajectory & Runway Verdict",
    engineering_tradeoffs:
      "Implemented compounding inflation and shock deductions as a stateless, sub-15ms computation so users can stress-test scenarios interactively with zero DB lock contention.",
    api_contract_sample:
      "POST /api/sandbox/finsim/ -> { liquid_savings, monthly_income, monthly_expenses, inflation_pct, income_drop_pct, emergency_shock } => { summary, trajectory[] }",
    sandbox_slug: "finsim",
    technologies: ["Python", "Django", "React", "Simulation Modeling", "REST APIs", "Tailwind CSS"],
    github_url: "https://github.com/skiran-ai",
    has_exact_repo: false,
    live_url: "",
    featured: true,
  },
];

export const FALLBACK_GITHUB_SUMMARY = {
  source: "github_fallback",
  username: "skiran-ai",
  profile_url: "https://github.com/skiran-ai",
  public_repos: 1,
  last_push_ago: "recent",
  repos: [
    {
      name: "personal-portfolio",
      full_name: "skiran-ai/personal-portfolio",
      url: "https://github.com/skiran-ai/personal-portfolio",
      description: "React 19 + Django REST + Gemini AI portfolio with executable FinTech sandboxes.",
      language: "JavaScript",
      stars: 0,
      pushed_ago: "recent",
    },
  ],
};

export const SANDBOX_DEFAULT_INPUTS = {
  finsight: {
    monthly_income: 75000,
    current_balance: 120000,
    transactions: [
      { date: "2026-10-02", merchant: "Rent Transfer", amount: 18000, category: "Housing" },
      { date: "2026-10-04", merchant: "Cloud Hosting VPS", amount: 1499, category: "Subscriptions" },
      { date: "2026-10-05", merchant: "AI Dev Tools Pro", amount: 1650, category: "Subscriptions" },
      { date: "2026-10-08", merchant: "Swiggy Instamart", amount: 4200, category: "Food" },
      { date: "2026-10-12", merchant: "Streaming Bundle", amount: 799, category: "Subscriptions" },
      { date: "2026-10-19", merchant: "Cloud Hosting VPS", amount: 1499, category: "Subscriptions" },
      { date: "2026-10-22", merchant: "Dining & Coffee", amount: 5400, category: "Food" },
      { date: "2026-10-27", merchant: "Electricity & Fiber", amount: 2850, category: "Utilities" },
    ],
  },
  paymatch: {
    fee_tolerance: 2.0,
    gateway_records: [
      { id: "GW-901", ref: "ORD-2026-8812", gross: 4500, fee: 90, net: 4410, status: "settled" },
      { id: "GW-902", ref: "ORD-2026-8813", gross: 12000, fee: 360, net: 11640, status: "settled" },
      { id: "GW-903", ref: "ORD-2026-8814-RETRY", gross: 3200, fee: 64, net: 3136, status: "settled" },
      { id: "GW-904", ref: "ORD-2026-8815", gross: 7800, fee: 156, net: 7644, status: "pending" },
      { id: "GW-905", ref: "ORD-2026-8816", gross: 2500, fee: 50, net: 2450, status: "settled" },
    ],
    ledger_records: [
      { id: "LD-101", ref: "ORD-2026-8812", expected_net: 4410, recorded_fee: 90 },
      { id: "LD-102", ref: "ORD-2026-8813", expected_net: 11760, recorded_fee: 240 },
      { id: "LD-103", ref: "ORD-2026-8814", expected_net: 3136, recorded_fee: 64 },
      { id: "LD-104", ref: "ORD-2026-8815", expected_net: 7644, recorded_fee: 156 },
    ],
  },
  finsim: {
    liquid_savings: 240000,
    monthly_income: 75000,
    monthly_expenses: 46000,
    inflation_pct: 9,
    income_drop_pct: 35,
    emergency_shock: 60000,
    horizon_months: 12,
  },
};

function similarityRatio(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.startsWith(shorter)) return shorter.length / longer.length;
  let matches = 0;
  const minLen = shorter.length;
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++;
  }
  return (2 * matches) / (a.length + b.length);
}

/**
 * Mirrors backend/portfolio_api/sandboxes.py when the Django API is offline (e.g. static Vercel).
 */
export function runFallbackSandbox(slug, payload) {
  const start = performance.now();

  if (slug === "finsight") {
    const data = { ...SANDBOX_DEFAULT_INPUTS.finsight, ...(payload || {}) };
    const income = Math.max(0, Number(data.monthly_income) || 0);
    const balance = Number(data.current_balance) || 0;
    const txs = data.transactions || [];
    const byCategory = {};
    const merchantMap = {};
    let totalSpend = 0;

    txs.forEach((tx) => {
      const amount = Math.max(0, Number(tx.amount) || 0);
      const cat = tx.category || "Other";
      const merchant = tx.merchant || "Unknown";
      totalSpend += amount;
      byCategory[cat] = (byCategory[cat] || 0) + amount;
      const key = merchant.toLowerCase();
      merchantMap[key] = merchantMap[key] || [];
      merchantMap[key].push({ merchant, amount });
    });

    const leaks = [];
    Object.entries(merchantMap).forEach(([key, items]) => {
      if (items.length >= 2) {
        leaks.push({
          merchant: items[0].merchant,
          occurrences: items.length,
          total_impact: items.reduce((s, x) => s + x.amount, 0),
          reason: "Duplicate or multi-cycle charge detected in same billing window",
        });
      } else if (/(subscription|streaming|bundle|cloud|pro)/.test(key)) {
        leaks.push({
          merchant: items[0].merchant,
          occurrences: 1,
          total_impact: items[0].amount,
          reason: "Recurring discretionary SaaS/subscription commitment",
        });
      }
    });

    const net = income - totalSpend;
    const savingsRate = income > 0 ? Number(((net / income) * 100).toFixed(1)) : 0;
    const forecast_3m = [1, 2, 3].map((idx) => ({
      month: `Month +${idx}`,
      projected_balance: Number((balance + net * idx).toFixed(2)),
      net_delta: Number(net.toFixed(2)),
    }));

    return {
      status: "success",
      sandbox: "finsight",
      engine: "Edge Local Fallback (Mirrors Django Logic)",
      execution_ms: Number((performance.now() - start).toFixed(2)),
      summary: {
        monthly_income: income,
        total_spend: totalSpend,
        net_monthly_cashflow: net,
        savings_rate_pct: savingsRate,
        risk_level: savingsRate >= 25 ? "LOW" : savingsRate >= 5 ? "MODERATE" : "HIGH",
      },
      leaks,
      category_breakdown: Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => ({
          category,
          amount,
          share_pct: totalSpend ? Number(((amount / totalSpend) * 100).toFixed(1)) : 0,
        })),
      forecast_3m,
    };
  }

  if (slug === "paymatch") {
    const data = { ...SANDBOX_DEFAULT_INPUTS.paymatch, ...(payload || {}) };
    const tolerance = Math.max(0, Number(data.fee_tolerance) || 2);
    const gateway = data.gateway_records || [];
    const ledger = data.ledger_records || [];
    const used = new Set();
    const counts = { MATCHED: 0, FEE_ANOMALY: 0, FUZZY_MATCHED: 0, DELAYED_SETTLEMENT: 0, MISSING_IN_LEDGER: 0 };
    let discrepancy = 0;

    const records = gateway.map((gw) => {
      let match = ledger.find((l) => l.ref === gw.ref);
      let method = "exact_ref";
      let sim = 1;

      if (!match) {
        let bestScore = 0;
        ledger.forEach((l) => {
          if (used.has(l.id)) return;
          const s = similarityRatio(gw.ref, l.ref);
          if (s > bestScore && s >= 0.72) {
            bestScore = s;
            match = l;
          }
        });
        if (match) {
          method = "fuzzy_ref";
          sim = Number(bestScore.toFixed(2));
        }
      }

      if (!match) {
        counts.MISSING_IN_LEDGER += 1;
        discrepancy += Number(gw.net) || 0;
        return {
          gateway_id: gw.id,
          ref: gw.ref,
          status: "MISSING_IN_LEDGER",
          match_method: "none",
          delta: gw.net,
          note: "Settled at gateway but absent from internal ledger.",
        };
      }

      used.add(match.id);
      const netDelta = Number((gw.net - match.expected_net).toFixed(2));
      const feeDelta = Number((gw.fee - match.recorded_fee).toFixed(2));
      let status = "MATCHED";
      let note = "Exact reference & net settlement verified.";

      if (gw.status !== "settled") {
        status = "DELAYED_SETTLEMENT";
        note = `Ledger expects ${match.expected_net}, gateway settlement still '${gw.status}'.`;
      } else if (Math.abs(netDelta) > tolerance || Math.abs(feeDelta) > tolerance) {
        status = "FEE_ANOMALY";
        discrepancy += Math.abs(netDelta);
        note = `Fee mismatch of ${feeDelta >= 0 ? "+" : ""}${feeDelta} (Gateway ${gw.fee} vs Ledger ${match.recorded_fee}).`;
      } else if (method === "fuzzy_ref") {
        status = "FUZZY_MATCHED";
        note = `Matched retry reference '${gw.ref}' -> '${match.ref}' (${Math.round(sim * 100)}% similarity).`;
      }

      counts[status] += 1;
      return { gateway_id: gw.id, ledger_id: match.id, ref: gw.ref, status, match_method: method, similarity: sim, delta: netDelta, note };
    });

    return {
      status: "success",
      sandbox: "paymatch",
      engine: "Edge Local Fallback (Mirrors Django Logic)",
      execution_ms: Number((performance.now() - start).toFixed(2)),
      counts,
      total_discrepancy_amount: Number(discrepancy.toFixed(2)),
      records,
    };
  }

  // finsim
  const data = { ...SANDBOX_DEFAULT_INPUTS.finsim, ...(payload || {}) };
  const savings = Math.max(0, Number(data.liquid_savings) || 0);
  const income = Math.max(0, Number(data.monthly_income) || 0);
  const expenses = Math.max(0, Number(data.monthly_expenses) || 0);
  const inflationPct = Math.max(0, Math.min(50, Number(data.inflation_pct) || 0));
  const dropPct = Math.max(0, Math.min(100, Number(data.income_drop_pct) || 0));
  const shock = Math.max(0, Number(data.emergency_shock) || 0);
  const horizon = Math.max(3, Math.min(24, Number(data.horizon_months) || 12));

  const stressedIncome = income * (1 - dropPct / 100);
  const inflFactor = 1 + inflationPct / 100 / 12;
  let baseBal = savings;
  let stressedBal = savings - shock;
  let currentExp = expenses;
  let firstDeficit = null;
  const trajectory = [];

  for (let m = 1; m <= horizon; m++) {
    currentExp *= inflFactor;
    baseBal += income - expenses;
    stressedBal += stressedIncome - currentExp;
    if (stressedBal < 0 && firstDeficit === null) firstDeficit = m;
    trajectory.push({
      month: m,
      baseline_balance: Number(baseBal.toFixed(2)),
      stressed_balance: Number(stressedBal.toFixed(2)),
      monthly_expense_inflated: Number(currentExp.toFixed(2)),
    });
  }

  return {
    status: "success",
    sandbox: "finsim",
    engine: "Edge Local Fallback (Mirrors Django Logic)",
    execution_ms: Number((performance.now() - start).toFixed(2)),
    summary: {
      stressed_monthly_income: Number(stressedIncome.toFixed(2)),
      initial_post_shock_reserve: Number((savings - shock).toFixed(2)),
      ending_stressed_balance: trajectory[trajectory.length - 1].stressed_balance,
      runway_months: firstDeficit ? firstDeficit - 1 : horizon,
      verdict:
        firstDeficit === null && stressedBal > expenses * 2
          ? "RESILIENT"
          : firstDeficit === null
          ? "FRAGILE"
          : `CRITICAL (Depletes at Month ${firstDeficit})`,
    },
    trajectory,
  };
}

/**
 * Grounded edge Q&A fallback when the Django + Gemini backend is not attached
 * (e.g., standalone static Vercel deployment without VITE_API_BASE).
 */
export function runFallbackJarvisChat(message, profile = FALLBACK_PROFILE, projects = FALLBACK_PROJECTS) {
  const q = (message || "").toLowerCase();
  const list = Array.isArray(projects) && projects.length ? projects : FALLBACK_PROJECTS;

  if (/(paymatch|reconcil|ledger|gateway|fee)/.test(q)) {
    const p = list.find((item) => item.sandbox_slug === "paymatch") || list[1] || list[0];
    return {
      status: "success",
      mode: "edge_grounded",
      reply: `${p.title} (${p.tagline}): ${p.architecture_summary}. Trade-off: ${p.engineering_tradeoffs} Launching the live PayMatch sandbox now so you can adjust fee tolerance and test mismatches.`,
      action: "OPEN_SANDBOX_PAYMATCH",
      suggested_followups: ["Show FinSight AI architecture", "Check role fit for Django Backend"],
    };
  }

  if (/(finsight|cash|flow|leak|forecast)/.test(q)) {
    const p = list.find((item) => item.sandbox_slug === "finsight") || list[0];
    return {
      status: "success",
      mode: "edge_grounded",
      reply: `${p.title} (${p.tagline}): ${p.architecture_summary}. Trade-off: ${p.engineering_tradeoffs} Opening the FinSight sandbox so you can add sample charges and verify 90-day projections.`,
      action: "OPEN_SANDBOX_FINSIGHT",
      suggested_followups: ["How does PayMatch handle fuzzy IDs?", "Open Suryakiran's ATS Resume"],
    };
  }

  if (/(finsim|stress|shock|runway|inflation|simulat)/.test(q)) {
    const p = list.find((item) => item.sandbox_slug === "finsim") || list[2] || list[0];
    return {
      status: "success",
      mode: "edge_grounded",
      reply: `${p.title} (${p.tagline}): ${p.architecture_summary}. Trade-off: ${p.engineering_tradeoffs} Opening FinSim so you can test inflation spikes and emergency shocks interactively.`,
      action: "OPEN_SANDBOX_FINSIM",
      suggested_followups: ["Inspect backend trade-offs", "What is Suryakiran's availability?"],
    };
  }

  if (/(resume|cv|pdf|ats|download)/.test(q)) {
    return {
      status: "success",
      mode: "edge_grounded",
      reply: "Opening Suryakiran's ATS Resume & CV viewer now. You can toggle between Balanced Full Stack, Backend / Django Focus, and AI Integration Focus.",
      action: "OPEN_RESUME",
      suggested_followups: ["Tell me about his Django experience", "When can he join?"],
    };
  }

  if (/(hire|contact|email|phone|call|schedule|availab|join|locat|relocat|kochi|bengaluru)/.test(q)) {
    return {
      status: "success",
      mode: "edge_grounded",
      reply: `${profile.name} is based in ${profile.location} and is ${profile.availability}. Reach out directly at ${profile.email} or ${profile.phone}, or use the Recruiter Fast-Track slot builder in Contact.`,
      action: "SCROLL_CONTACT",
      suggested_followups: ["Open ATS Resume", "Explore FinSight AI sandbox"],
    };
  }

  if (/(education|degree|college|avodha|bsc|b\.sc|study|course)/.test(q)) {
    return {
      status: "success",
      mode: "edge_grounded",
      reply: "Suryakiran completed B.Sc Computer Science coursework (2023–2026) at KMM College, Thrikkakara, and is in Month 5 of 6 of Avodha's Python Django Full Stack Development intensive (Ernakulam).",
      action: "NONE",
      suggested_followups: ["Test live FinSight sandbox", "Check Backend / Django projects"],
    };
  }

  if (/(django|python|backend|ai|gemini|langchain|stack|skill|tech|project)/.test(q)) {
    return {
      status: "success",
      mode: "edge_grounded",
      reply: "Core stack: Python 3.x, Django & Django REST Framework (DRF), PostgreSQL/SQLite, Google Gemini Interactions API (schema-enforced JSON), React 19, and Vite — demonstrated across FinSight AI, PayMatch AI, and FinSim with executable sandboxes.",
      action: "NONE",
      suggested_followups: ["Launch FinSight AI sandbox", "Launch PayMatch AI sandbox", "Check JD Fit tab"],
    };
  }

  return {
    status: "success",
    mode: "edge_grounded",
    reply: `${profile.name} is a ${profile.role}. Ask about FinSight AI, PayMatch AI, FinSim, his Django + Gemini stack, ATS Resume, or switch to the JD Fit Analyzer tab above to score a job description.`,
    action: "NONE",
    suggested_followups: ["Why Django + Gemini?", "Run PayMatch AI sandbox", "Check availability & contact"],
  };
}

/**
 * Deterministic grounded JD Fit scorer for static/edge hosting when Django API is offline.
 */
export function runFallbackJdMatch(jdText, profile = FALLBACK_PROFILE, projects = FALLBACK_PROJECTS) {
  const jd = (jdText || "").toLowerCase();
  const checks = [
    { label: "Python 3.x", test: /\bpython\b/, weight: 16, proof: "FinSight AI, PayMatch AI & FinSim engines" },
    { label: "Django / DRF", test: /\bdjango|drf|django rest\b/, weight: 18, proof: "Portfolio API, FinSight AI & PayMatch AI" },
    { label: "REST APIs", test: /\brest|api|endpoint|backend|microservice\b/, weight: 12, proof: "Deterministic JSON endpoints & error contracts" },
    { label: "React / Frontend", test: /\breact|frontend|vite|javascript|typescript|ui\b/, weight: 12, proof: "React 19 portfolio, sandboxes & command palette" },
    { label: "SQL / PostgreSQL", test: /\bsql|postgres|postgresql|sqlite|database|orm|acid\b/, weight: 12, proof: "Normalized ledgers & ACID reconciliation" },
    { label: "AI / LLM Integration", test: /\bai\b|\bllm|gemini|openai|agent|langchain|rag|prompt|schema\b/, weight: 12, proof: "Gemini schema-grounded outputs & LangChain flows" },
    { label: "Git & Testing", test: /\bgit|github|test|unit test|pytest|ci\b/, weight: 8, proof: "Django TestCase verification & Git workflow" },
    { label: "Docker / Deployment", test: /\bdocker|deploy|vercel|linux|cloud\b/, weight: 5, proof: "Containerized parity & Vercel + Django split setup" },
    { label: "FinTech / Data Modeling", test: /\bfintech|payment|ledger|reconcil|forecast|analytics\b/, weight: 5, proof: "PayMatch, FinSight & FinSim domain engines" },
  ];

  const matched = [];
  const unmet = [];
  let earned = 0;
  let possible = 0;

  checks.forEach((c) => {
    if (c.test.test(jd)) {
      possible += c.weight;
      earned += c.weight;
      matched.push(`${c.label} (${c.proof})`);
    }
  });

  if (/\bkubernetes|k8s\b/.test(jd)) {
    possible += 8;
    unmet.push("Kubernetes orchestration (Docker fundamentals applied; production K8s not claimed)");
  }
  if (/\baws|terraform|kafka\b/.test(jd)) {
    possible += 6;
    unmet.push("AWS/Kafka/Terraform enterprise ops (experienced with Vercel & Render/Railway patterns)");
  }
  if (/\bnext\.?js\b/.test(jd) && !/\breact\b/.test(jd)) {
    possible += 6;
    unmet.push("Next.js SSR specifics (uses React 19 + Vite SPA currently)");
  }

  let score = 74;
  if (possible > 0) {
    score = Math.min(96, Math.max(58, Math.round((earned / possible) * 92)));
  }

  if (matched.length === 0) {
    matched.push("Python 3.x & Django REST APIs", "React 19 interactive web systems", "Structured AI integration (Gemini / Pydantic-style schemas)");
    score = 72;
  }

  const tier = score >= 82 ? "Strong Match" : score >= 68 ? "Good Match" : "Partial Match";
  const recProjects = (Array.isArray(projects) && projects.length ? projects : FALLBACK_PROJECTS)
    .slice(0, 3)
    .map((p) => p.title);

  return {
    status: "success",
    mode: "edge_grounded",
    match_score_pct: score,
    match_tier: tier,
    matched_skills: matched,
    gap_or_learning_note: unmet.length
      ? unmet.join("; ")
      : "No core skill gaps identified across Python/Django, REST APIs, React UI, and structured AI workflows.",
    recommended_projects: recProjects,
    summary_pitch: `${profile.name} aligns strongly (${score}%) via verifiable Python/Django backend engines, React 19 UI systems, and schema-grounded AI workflows — immediately ready for Kochi, Bengaluru, or Remote teams.`,
  };
}
