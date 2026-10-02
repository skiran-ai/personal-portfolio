import React from 'react';
import { Layers, Database, Cpu, Globe, Terminal, CheckCircle2 } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Skills() {
  const [revealRef, isVisible] = useScrollReveal();
  const skillCategories = [
    {
      title: "Python & Django Backend",
      icon: Terminal,
      color: "var(--cyan)",
      skills: [
        "Python 3.x",
        "Django & ASGI/WSGI",
        "Django REST Framework (DRF)",
        "PostgreSQL & SQLite",
        "ORM Optimization",
        "Authentication & JWT",
        "CORS & API Security"
      ]
    },
    {
      title: "Agentic AI & Integrations",
      icon: Cpu,
      color: "#a855f7",
      skills: [
        "Agentic AI Architecture",
        "LLM API Integrations",
        "Speech AI (STT & TTS)",
        "Prompt Engineering",
        "LangChain & Tool Use",
        "Autonomous Assistants",
        "Context & Memory Management"
      ]
    },
    {
      title: "Frontend & 3D WebGL",
      icon: Globe,
      color: "#38bdf8",
      skills: [
        "React (Hooks & State)",
        "Three.js & WebGL",
        "JavaScript (ES6+)",
        "HTML5 & CSS3 Glassmorphism",
        "3D Scrolling & Parallax",
        "Responsive UI Architecture",
        "Vite & Modern Tooling"
      ]
    },
    {
      title: "Databases, DevOps & Tools",
      icon: Database,
      color: "#10b981",
      skills: [
        "Git & GitHub Versioning",
        "RESTful API Design",
        "Postman API Testing",
        "Docker Fundamentals",
        "Linux CLI & Scripting",
        "Database Normalization",
        "Production Deployment"
      ]
    }
  ];

  return (
    <section id="skills" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)', position: 'relative', zIndex: 10 }}>
      <div
        ref={revealRef}
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            marginBottom: '12px'
          }}>
            <Layers size={15} color="#c084fc" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#c084fc' }}>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Tech Stack & <span className="gradient-text-purple">Competencies</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.98rem' }}>
            A tailored engineering stack balancing enterprise Python/Django backends with dynamic React interfaces and Agentic AI.
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '24px'
        }}>
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = cat.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cat.color
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
                    {cat.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.skills.map((skillName, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = `${cat.color}40`;
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <CheckCircle2 size={16} color={cat.color} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {skillName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
