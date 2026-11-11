import React from 'react';
import { Mail, Phone, Command } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onOpenResume, onOpenCommandPalette, apiHealth }) {
  const isOnline = apiHealth?.status === 'ok';

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 8, 13, 0.94)',
        padding: 'clamp(32px, 5vw, 48px) clamp(16px, 4vw, 40px) 28px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container-shell">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              SURYAKIRAN <span style={{ color: 'var(--cyan)' }}>P J</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              AI-Integrated Full Stack &amp; Forward Deployed Engineer (Python / Django)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.86rem' }}>Engineering</a>
            <a href="#skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.86rem' }}>Evidence Stack</a>
            <a href="#projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.86rem' }}>Sandboxes</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.86rem' }}>Contact</a>
            <button onClick={onOpenResume} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
              ATS Resume
            </button>
            <button onClick={onOpenCommandPalette} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Command size={13} /> Ctrl+K
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://github.com/skiran-ai" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="GitHub (@skiran-ai)">
              <GithubIcon size={18} />
            </a>
            <a href="https://www.linkedin.com/in/surya-kiran-967659351" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="LinkedIn">
              <LinkedinIcon size={18} />
            </a>
            <a href="tel:+918129867662" style={{ color: 'var(--text-secondary)' }} title="Call +91 8129867662">
              <Phone size={18} />
            </a>
            <a href="mailto:suryakiranpjineesh@gmail.com" style={{ color: 'var(--text-secondary)' }} title="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>© {CURRENT_YEAR} Suryakiran P J. Built with React 19, Django REST &amp; Gemini API.</div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isOnline ? '#10b981' : '#38bdf8',
              }}
            />
            {isOnline ? (
              <span>
                Django API Online • {apiHealth.latency_ms}ms • Jarvis:{' '}
                {apiHealth.jarvis_mode === 'gemini_live' ? `Gemini (${apiHealth.gemini_model})` : 'Grounded Local'}
                {apiHealth.github_last_push ? ` • GitHub Push: ${apiHealth.github_last_push}` : ''}
              </span>
            ) : (
              <span>Edge Fallback Mode (Static Demo Active)</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
