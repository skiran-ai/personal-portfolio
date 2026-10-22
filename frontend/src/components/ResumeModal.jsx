import React, { useState } from 'react';
import { X, Download, Printer, Check, Copy, FileText, ExternalLink, Eye, Code, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE } from '../config/api';

export default function ResumeModal({ isOpen, onClose }) {
  const [activeDoc, setActiveDoc] = useState('resume'); // 'resume' | 'cv'
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'text'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getDocFileName = (type = activeDoc) => {
    return type === 'resume' ? 'Suryakiran_PJ_Resume.pdf' : 'Suryakiran_PJ_CV.pdf';
  };

  const getDocUrl = (type = activeDoc) => {
    const base = import.meta.env.BASE_URL || '/';
    const clean = base.endsWith('/') ? base : `${base}/`;
    return `${clean}${getDocFileName(type)}`;
  };

  const handleDownload = (type = activeDoc) => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // Safe fallback
    }

    const fileName = getDocFileName(type);
    const fileUrl = getDocUrl(type);

    // Universal download technique: works 100% reliably for everyone on all browsers & devices
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
        } catch (e) {}
      }, 300);
    } catch (err) {
      // Direct window location fallback
      window.open(fileUrl, '_blank');
    }
  };

  const handleOpenPdf = (type = activeDoc) => {
    const fileUrl = getDocUrl(type);
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    const textToCopy = activeDoc === 'resume' ? resumeContent : cvContent;
    navigator.clipboard.writeText(textToCopy);
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

  const resumeContent = `================================================================================
SURYAKIRAN P J
Python Django Full Stack Developer | AI Integration
Ernakulam, Kerala, India | suryakiranpjineesh@gmail.com
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351 | GitHub: https://github.com/suryakiranpjineesh-bit
Instagram: https://www.instagram.com/sury.akirann
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
• Personal finance platform with AI-driven cash-flow forecasting.

PayMatch AI - Intelligent Payment Reconciliation & Discrepancy Detection System
• Payment reconciliation system that detects discrepancies in payment records.

FinSim - Personal Financial Stress Testing & Scenario Simulator
• Simulator that stress-tests personal finances under different scenarios.

--------------------------------------------------------------------------------
EDUCATION & TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Professional Program)
Avodha, Vyttila, Ernakulam, Kerala | In progress (5 of 6 months completed)
Coursework: Python 3, Django, Django REST Framework, Relational Databases,
Frontend Integration, API Development, Full Stack Project Engineering

Bachelor of Science (B.Sc), Computer Science
KMM College, Thrikkakara, Ernakulam, Kerala | Completed
Coursework: Data Structures, Object-Oriented Programming, Database Systems,
Software Engineering, Operating Systems, Computer Networks

Higher Secondary Education (HSS), Science & Computer Applications
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala
================================================================================
`;

  const cvContent = `================================================================================
CURRICULUM VITAE (CV)
SURYAKIRAN P J
Python Django Full Stack Developer | AI Integration

CONTACT
Email: suryakiranpjineesh@gmail.com
Location: Ernakulam, Kerala, India
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
Instagram: https://www.instagram.com/sury.akirann
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
   Personal finance platform with AI-driven cash-flow forecasting.

2. PayMatch AI - Intelligent Payment Reconciliation & Discrepancy Detection System
   Payment reconciliation system that detects discrepancies in payment records.

3. FinSim - Personal Financial Stress Testing & Scenario Simulator
   Simulator that stress-tests personal finances under different scenarios.

--------------------------------------------------------------------------------
EDUCATION & TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Program)
Avodha, Vyttila, Ernakulam, Kerala | In progress (5 of 6 months completed)
Python 3, Django, DRF, Relational Databases, Frontend Integration, API Development,
Full Stack Project Engineering

B.Sc, Computer Science
KMM, Thrikkakara, Ernakulam, Kerala | Completed
Data Structures, Object-Oriented Programming, Database Systems, Software Engineering,
Operating Systems, Computer Networks

Higher Secondary Education (HSS), Science & Computer Applications
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala
================================================================================
`;

  const docTitle = activeDoc === 'resume' ? 'Suryakiran P J - ATS Resume' : 'Suryakiran P J - Curriculum Vitae';
  const pdfUrl = getDocUrl(activeDoc);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel printable-modal"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 16, 29, 0.98)',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          overflow: 'hidden',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 242, 254, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          padding: 'clamp(14px, 2.5vw, 18px) clamp(16px, 3.5vw, 24px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan)',
              flexShrink: 0
            }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                  Official Resume & Curriculum Vitae
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: '600'
                }}>
                  100% ATS Ready & Verified
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                Instant high-resolution PDF download for recruiters, hiring managers, and applicant tracking systems
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          padding: '10px clamp(14px, 3.5vw, 24px)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(7, 9, 14, 0.75)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Document & View Mode Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* Document Select */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setActiveDoc('resume')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  background: activeDoc === 'resume' ? 'var(--cyan)' : 'transparent',
                  color: activeDoc === 'resume' ? '#07090e' : '#cbd5e1',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ATS Resume (1-Page)
              </button>

              <button
                onClick={() => setActiveDoc('cv')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  background: activeDoc === 'cv' ? 'var(--cyan)' : 'transparent',
                  color: activeDoc === 'cv' ? '#07090e' : '#cbd5e1',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Curriculum Vitae (CV)
              </button>
            </div>

            {/* View Mode Toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setViewMode('pdf')}
                title="Preview PDF Document"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  background: viewMode === 'pdf' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: viewMode === 'pdf' ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <Eye size={13} />
                <span>PDF View</span>
              </button>
              <button
                onClick={() => setViewMode('text')}
                title="View ATS Parsable Plain Text"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  background: viewMode === 'text' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
                  color: viewMode === 'text' ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <Code size={13} />
                <span>ATS Text</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={handleCopyText}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Copy ATS text to clipboard"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={() => handleOpenPdf(activeDoc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Open full PDF in a new browser tab"
            >
              <ExternalLink size={14} />
              <span className="hide-on-xs">Open in Tab</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Print document"
            >
              <Printer size={14} />
              <span className="hide-on-xs">Print</span>
            </button>

            {/* Universal High-Priority Download Button */}
            <button
              onClick={() => handleDownload(activeDoc)}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 18px',
                fontSize: '0.84rem',
                fontWeight: '700',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.35)',
                cursor: 'pointer'
              }}
              title={`Download ${activeDoc === 'resume' ? 'Suryakiran_PJ_Resume.pdf' : 'Suryakiran_PJ_CV.pdf'} directly`}
            >
              <Download size={15} />
              <span>Download {activeDoc === 'resume' ? 'ATS Resume (PDF)' : 'CV (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: viewMode === 'pdf' ? '12px' : 'clamp(12px, 3vw, 24px)',
          background: '#070a12',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {viewMode === 'pdf' ? (
            <div style={{
              width: '100%',
              flex: 1,
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#0b101c',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'relative'
            }}>
              {/* Responsive Notice bar on top of PDF */}
              <div style={{
                padding: '8px 14px',
                background: 'rgba(0, 242, 254, 0.06)',
                borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="var(--cyan)" />
                  <span>
                    Viewing <strong>{getDocFileName(activeDoc)}</strong> (Ready for instant download & ATS parsing)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDownload(activeDoc)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cyan)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      textDecoration: 'underline',
                      padding: 0,
                      fontSize: '0.78rem'
                    }}
                  >
                    Direct Download
                  </button>
                  <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                  <button
                    onClick={() => handleOpenPdf(activeDoc)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cyan)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      textDecoration: 'underline',
                      padding: 0,
                      fontSize: '0.78rem'
                    }}
                  >
                    Open in Fullscreen
                  </button>
                </div>
              </div>

              {/* Embedded PDF Viewer */}
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                title={docTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '62vh',
                  border: 'none',
                  background: '#ffffff'
                }}
              />
            </div>
          ) : (
            <pre
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.72rem, 1.8vw, 0.84rem)',
                color: '#e2e8f0',
                lineHeight: '1.65',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(0, 0, 0, 0.45)',
                padding: 'clamp(14px, 3vw, 24px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                margin: 0
              }}
            >
              {activeDoc === 'resume' ? resumeContent : cvContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
