import React, { useState } from 'react';
import { X, Download, Printer, Check, Copy, FileText, ExternalLink, Eye, Code, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE } from '../config/api';

const FOCUS_PRESETS = {
  balanced: {
    label: 'Balanced Full Stack',
    summary:
      'AI-Integrated Full Stack & Forward Deployed Engineer building deterministic Python/Django REST APIs, reactive React UIs, and schema-grounded Gemini AI systems.',
    skillsOrder: [
      'Languages: Python 3.x, JavaScript (ES6+), SQL, HTML5, CSS3',
      'Backend: Django, Django REST Framework (DRF), Signed Auth, REST API Design',
      'AI & Integration: Google Gemini API (Structured JSON), Agentic Workflows, LangChain',
      'Frontend: React 19, Vite, Three.js / WebGL, Responsive UI',
      'Databases & Tools: PostgreSQL, SQLite, ACID Transactions, Git/GitHub, Docker (basics)',
    ],
  },
  backend: {
    label: 'Backend / Django Focus',
    summary:
      'Python & Django Backend Engineer focused on normalized relational modeling (PostgreSQL/SQLite), ACID-safe multi-pass reconciliation pipelines, HMAC token auth, and sub-15ms REST endpoints.',
    skillsOrder: [
      'Backend Core: Python 3.x, Django 6, Django REST Framework (DRF), ORM Optimization',
      'Data Integrity: PostgreSQL, SQLite, ACID Transactions, Query Indexing, Normalization',
      'Security & APIs: Signed Bearer Auth, Input Validation, CORS Scoping, Django TestCase',
      'Integrations & Frontend: Gemini API Structured Outputs, React 19, Docker (basics), Git/GitHub',
    ],
  },
  ai: {
    label: 'AI Integration Focus',
    summary:
      'Agentic AI & Full Stack Engineer combining Google Gemini Interactions API + Pydantic schema enforcement with deterministic Python guardrails to prevent LLM arithmetic or factual hallucinations.',
    skillsOrder: [
      'AI Systems: Google Gemini API (gemini-3.5-flash-lite / 3.8-flash), Structured JSON, Context Grounding',
      'Agent Workflows: JD Fit Evaluation, Action-Triggered UI Routing, LangChain Classification',
      'Backend Guardrails: Python 3.x, Django DRF, Deterministic Financial Simulation & Reconciliation',
      'Frontend & Data: React 19 Interactive Sandboxes, PostgreSQL, SQLite, Git/GitHub',
    ],
  },
};

export default function ResumeModal({ isOpen, onClose }) {
  const [activeDoc, setActiveDoc] = useState('resume'); // 'resume' | 'cv'
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'text'
  const [roleFocus, setRoleFocus] = useState('balanced'); // 'balanced' | 'backend' | 'ai'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getDocFileName = (type = activeDoc) =>
    type === 'resume' ? 'Suryakiran_PJ_Resume.pdf' : 'Suryakiran_PJ_CV.pdf';

  const getDocUrl = (type = activeDoc) => {
    const base = import.meta.env.BASE_URL || '/';
    const clean = base.endsWith('/') ? base : `${base}/`;
    return `${clean}${getDocFileName(type)}`;
  };

  const trackDownload = (type) => {
    fetch(`${API_BASE}/analytics/track/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: type === 'resume' ? 'resume_download' : 'cv_download',
        metadata: roleFocus,
      }),
    }).catch(() => {});
  };

  const handleDownload = (type = activeDoc) => {
    trackDownload(type);
    try {
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
    } catch {
      // Safe fallback
    }

    const fileName = getDocFileName(type);
    const fileUrl = getDocUrl(type);

    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch {
          // Removed
        }
      }, 300);
    } catch {
      window.open(fileUrl, '_blank');
    }
  };

  const handleOpenPdf = (type = activeDoc) => {
    window.open(getDocUrl(type), '_blank', 'noopener,noreferrer');
  };

  const preset = FOCUS_PRESETS[roleFocus] || FOCUS_PRESETS.balanced;

  const buildTailoredText = (isCv) => {
    const headerTitle = isCv ? 'CURRICULUM VITAE (CV)\n' : '';
    return `================================================================================
${headerTitle}SURYAKIRAN P J (${preset.label})
AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django)
Ernakulam, Kerala, India | suryakiranpjineesh@gmail.com | +91 8129867662
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/skiran-ai | Portfolio: https://skiran.vercel.app
================================================================================

PROFESSIONAL SUMMARY (${preset.label.toUpperCase()})
${preset.summary}

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
${preset.skillsOrder.join('\n')}

--------------------------------------------------------------------------------
PROJECTS (WITH LIVE SANDBOXES IN PORTFOLIO)
--------------------------------------------------------------------------------
1. FinSight AI — Cash-Flow Leak Detector & 90-Day Liquidity Forecaster
   • Eliminates personal liquidity surprises by detecting duplicate/recurring spend leaks.
   • Architecture: Python, Django DRF, deterministic forecast math + AI merchant tagging.

2. PayMatch AI — Multi-Pass Payment Reconciliation & Fee Anomaly Engine
   • Resolves gateway fee mismatches, retry suffix IDs, and missing ledger settlements.
   • Architecture: Python, Django, ACID transactions, exact-ID + fuzzy matching pipeline.

3. FinSim — Macroeconomic Shock & Personal Runway Stress Simulator
   • Models inflation spikes, income drops, and emergency costs in sub-15ms stateless runs.
   • Architecture: Python, Django, React interactive SVG runway trajectory.

--------------------------------------------------------------------------------
EDUCATION & TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Intensive Program)
Avodha, Vyttila, Ernakulam, Kerala | Month 5 of 6 Completed

Bachelor of Science (B.Sc), Computer Science
KMM College, Thrikkakara, Ernakulam, Kerala | Coursework Completed (2023 – 2026)
${isCv ? '\nHigher Secondary (HSS) — Sahodaran Memorial HSS, Cherai\nSSLC — Rama Varma Union High School, Cherai\n' : ''}================================================================================`;
  };

  const activeText = buildTailoredText(activeDoc === 'cv');

  const handleCopyText = () => {
    navigator.clipboard?.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (viewMode === 'pdf') {
      handleOpenPdf(activeDoc);
    } else {
      window.print();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel printable-modal"
        style={{
          width: '100%',
          maxWidth: '940px',
          maxHeight: '94dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 16, 29, 0.98)',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          overflow: 'hidden',
          border: '1px solid rgba(0, 242, 254, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: 'clamp(14px, 2.5vw, 18px) clamp(16px, 3.5vw, 24px)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
              <FileText size={21} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.16rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                Role-Tailored ATS Resume &amp; CV
              </h2>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Switch between Balanced, Backend Django, or AI Focus — or download the official PDF.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: '10px clamp(14px, 3vw, 22px)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(7, 9, 14, 0.78)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* Doc Select */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              {[
                { key: 'resume', label: 'ATS Resume' },
                { key: 'cv', label: 'Full CV' },
              ].map((d) => (
                <button
                  key={d.key}
                  onClick={() => setActiveDoc(d.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    background: activeDoc === d.key ? 'var(--cyan)' : 'transparent',
                    color: activeDoc === d.key ? '#07090e' : '#cbd5e1',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('pdf')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '7px',
                  background: viewMode === 'pdf' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: viewMode === 'pdf' ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <Eye size={13} /> PDF
              </button>
              <button
                onClick={() => setViewMode('text')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '7px',
                  background: viewMode === 'text' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: viewMode === 'text' ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <Code size={13} /> Role-Tailored ATS Text
              </button>
            </div>

            {/* Role Focus Toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(168, 85, 247, 0.08)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
              {[
                { key: 'balanced', label: 'Balanced' },
                { key: 'backend', label: 'Backend / Django' },
                { key: 'ai', label: 'AI Focus' },
              ].map((rf) => (
                <button
                  key={rf.key}
                  onClick={() => {
                    setRoleFocus(rf.key);
                    setViewMode('text');
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '7px',
                    background: roleFocus === rf.key ? 'rgba(168, 85, 247, 0.35)' : 'transparent',
                    color: roleFocus === rf.key ? '#fff' : '#cbd5e1',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={handleCopyText} className="btn-secondary" style={{ padding: '7px 11px', fontSize: '0.78rem' }}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy ATS'}</span>
            </button>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '7px 11px', fontSize: '0.78rem' }}>
              <Printer size={14} /> Print
            </button>
            <button onClick={() => handleDownload(activeDoc)} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: viewMode === 'pdf' ? '12px' : 'clamp(12px, 3vw, 22px)', background: '#070a12', display: 'flex', flexDirection: 'column' }}>
          {viewMode === 'pdf' ? (
            <div style={{ width: '100%', flex: 1, minHeight: 'min(58dvh, 520px)', display: 'flex', flexDirection: 'column', background: '#0b101c', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ padding: '8px 14px', background: 'rgba(0, 242, 254, 0.06)', borderBottom: '1px solid rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="var(--cyan)" />
                  Viewing <strong>{getDocFileName(activeDoc)}</strong> (Switch to &quot;Role-Tailored ATS Text&quot; for Backend vs AI focus)
                </span>
                <button onClick={() => handleOpenPdf(activeDoc)} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} /> Open Tab
                </button>
              </div>
              <iframe
                src={`${getDocUrl(activeDoc)}#toolbar=1&navpanes=0&view=FitH`}
                title={activeDoc === 'resume' ? 'ATS Resume' : 'Curriculum Vitae'}
                style={{ width: '100%', height: '100%', minHeight: 'min(60dvh, 560px)', border: 'none', background: '#ffffff' }}
              />
            </div>
          ) : (
            <pre
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.72rem, 1.7vw, 0.84rem)',
                color: '#e2e8f0',
                lineHeight: '1.65',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(0, 0, 0, 0.45)',
                padding: 'clamp(14px, 3vw, 22px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                margin: 0,
              }}
            >
              {activeText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
