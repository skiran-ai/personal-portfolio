import React, { useState } from 'react';
import { X, Download, Printer, Check, Copy, FileText, Award, GraduationCap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function ResumeModal({ isOpen, onClose }) {
  const [activeDoc, setActiveDoc] = useState('resume'); // 'resume' | 'cv'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (type) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    // Direct endpoint download
    window.location.href = `${API_BASE}/${type}/download/`;
  };

  const handleCopyText = () => {
    const textToCopy = activeDoc === 'resume' ? resumeContent : cvContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const resumeContent = `================================================================================
SURYAKIRAN P J
Software Engineer | AI Integrated Python Django Full Stack Developer
Email: suryakiranpjineesh@gmail.com
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
Instagram: https://www.instagram.com/jstt.kiran
Location: Ernakulam, Kerala, India
================================================================================

PROFESSIONAL SUMMARY
Results-driven Software Engineer and AI-Integrated Python Django Full Stack Developer 
with extensive expertise in building scalable, secure backend architectures, RESTful APIs, 
and responsive frontend applications. Specialized in integrating Agentic AI workflows, 
LLM-driven automations, and modern web application development using Django and React.

--------------------------------------------------------------------------------
TECHNICAL SKILLS
--------------------------------------------------------------------------------
- Programming Languages: Python, JavaScript (ES6+), SQL, HTML5, CSS3
- Backend Frameworks: Django, Django REST Framework (DRF), ASGI/WSGI
- Frontend Technologies: React, Three.js (3D Graphics), Responsive Web Design
- AI & Integration: Agentic AI Systems, LLM Integration, LangChain, Prompt Engineering
- Databases: PostgreSQL, SQLite, Database Normalization & Indexing
- Tools & Methodologies: Git, GitHub, RESTful Architecture, Docker Basics, Agile/Scrum

--------------------------------------------------------------------------------
EDUCATION & PROFESSIONAL TRAINING
--------------------------------------------------------------------------------
Python Django Full Stack Development (6-Month Professional Program)
Avodha, Vyttila, Ernakulam, Kerala
- Status: Currently Pursuing (5 of 6 Months Completed • 1 Month Remaining)
- Core Curriculum: Python 3, Django, Django REST Framework (DRF), Relational Databases,
  Frontend Integration, API Development, and Full Stack Project Engineering.

Bachelor of Science (B.Sc) in Computer Science
KMM, Thrikkakara, Ernakulam, Kerala
- Status: Course Completed
- Key Coursework: Data Structures, Object-Oriented Programming, Database Systems, 
  Software Engineering, Operating Systems, Computer Networks.

Higher Secondary Education (HSS)
Sahodaran Memorial Higher Secondary School, Cherai, Ernakulam, Kerala
- Stream: Science & Computer Applications

Secondary School Leaving Certificate (SSLC)
Rama Varma Union High School, Cherai, Ernakulam, Kerala

--------------------------------------------------------------------------------
CORE COMPETENCIES & EXPERTISE
--------------------------------------------------------------------------------
- Full Stack Architecture: Engineering end-to-end web apps with Django REST backends and React frontends.
- Agentic AI Development: Designing autonomous AI agents with text and voice capabilities (e.g., Jarvis).
- Dynamic Content Management: Implementing real-time Admin Portals with live project orchestration.
- Clean Code Practices: Writing modular, well-documented, testable code adhering to PEP 8 standards.
================================================================================
`;

  const cvContent = `================================================================================
CURRICULUM VITAE (CV) - ATS COMPLIANT
SURYAKIRAN P J
Software Engineer | AI Integrated Python Django Full Stack Developer
Email: suryakiranpjineesh@gmail.com
Location: Ernakulam, Kerala, India
LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351
GitHub: https://github.com/suryakiranpjineesh-bit
================================================================================

1. OBJECTIVE
To leverage deep proficiency in Python, Django, React, and Agentic AI technologies 
to engineer resilient software solutions, intelligent automations, and enterprise-grade 
web platforms that drive technological innovation.

2. ACADEMIC & PROFESSIONAL CREDENTIALS
--------------------------------------------------------------------------------
- Python Django Full Stack Development (6-Month Professional Course)
  Institution: Avodha
  Location: Vyttila, Ernakulam, Kerala
  Status: Currently Pursuing (5 of 6 Months Completed • 1 Month Remaining)
  Focus: Advanced Python, Django Architecture, RESTful APIs, Database Engineering

- B.Sc Computer Science (Course Completed)
  Institution: KMM
  Location: Thrikkakara, Ernakulam, Kerala
  Focus: Core Computing, Software Architecture, System Design, Algorithms

- Higher Secondary School (HSS)
  Institution: Sahodaran Memorial Higher Secondary School
  Location: Cherai, Ernakulam, Kerala

- Secondary School Leaving Certificate (SSLC)
  Institution: Rama Varma Union High School
  Location: Cherai, Ernakulam, Kerala

3. TECHNICAL PROFICIENCIES
--------------------------------------------------------------------------------
- Languages: Python, JavaScript, SQL, HTML5, CSS3
- Backend Architecture: Django, Django REST Framework, ORM, API Security, CORS
- Modern Frontend: React, Three.js 3D WebGL, Component Design, State Management
- Artificial Intelligence: Agentic AI Agents, LLM Integrations, Speech Synthesis/Recognition
- Database Management: PostgreSQL, SQLite, Relational Schema Modeling
- Version Control: Git, GitHub workflow, branching and CI/CD basics

4. NOTABLE ENGINEERING ACHIEVEMENTS
--------------------------------------------------------------------------------
- Developed 3D Interactive Web Experience featuring Three.js particle simulations and 3D scrolling.
- Engineered Autonomous 'Jarvis' Agent with bilingual speech synthesis, voice recognition, and NLP intent resolution.
- Architected Real-time In-Portfolio Admin Dashboard for CRUD operations on dynamic software portfolios.

5. DECLARATION
I hereby affirm that the information provided above is authentic and complete to the best of my knowledge.

Suryakiran P J
================================================================================
`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel printable-modal"
        style={{
          width: '100%',
          maxWidth: '860px',
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
          padding: 'clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan)'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                ATS-Friendly Credentials
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                100% Parsable by Applicant Tracking Systems (Workday, Taleo, Greenhouse)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 3.5vw, 28px)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(7, 9, 14, 0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Document Toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveDoc('resume')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                background: activeDoc === 'resume' ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: activeDoc === 'resume' ? '#07090e' : '#fff',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              ATS Resume (1-Page)
            </button>

            <button
              onClick={() => setActiveDoc('cv')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                background: activeDoc === 'cv' ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: activeDoc === 'cv' ? '#07090e' : '#fff',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              ATS Curriculum Vitae (CV)
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopyText}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => handleDownload(activeDoc)}
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
            >
              <Download size={14} />
              <span>Download {activeDoc === 'resume' ? 'ATS Resume' : 'ATS CV'}</span>
            </button>
          </div>
        </div>

        {/* ATS Document Preview View */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(12px, 3vw, 24px) clamp(12px, 3vw, 28px)', background: '#0b101c' }}>
          <pre
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(0.72rem, 1.8vw, 0.85rem)',
              color: '#e2e8f0',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: 'clamp(14px, 3vw, 24px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {activeDoc === 'resume' ? resumeContent : cvContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
