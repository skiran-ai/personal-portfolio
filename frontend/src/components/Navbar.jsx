import React, { useState } from 'react';
import { Bot, FileText, Lock, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({
  onOpenAdmin,
  onOpenResume,
  onToggleJarvis,
  isJarvisSpeaking = false
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 20px',
        width: '100%'
      }}
    >
      <div
        className="liquid-glass liquid-glass-border"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          borderRadius: '9999px',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(0, 242, 254, 0.45)',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)',
              flexShrink: 0
            }}
          >
            <img
              src="/suryakiran.jpg"
              alt="Suryakiran P J"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top'
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SURYAKIRAN</span>
              <span style={{ color: 'var(--cyan)' }}>P J</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }}></span>
              <span>Full Stack & AI Engineer</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px'
          }}
          className="desktop-nav"
        >
          <a
            href="#about"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Education & About
          </a>
          <a
            href="#skills"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Tech Stack
          </a>
          <a
            href="#projects"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Projects
          </a>
          <a
            href="#contact"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Contact
          </a>
        </nav>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Jarvis AI Voice Trigger */}
          <button
            onClick={onToggleJarvis}
            title="Chat with Jarvis AI"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '9999px',
              background: isJarvisSpeaking
                ? 'rgba(0, 242, 254, 0.18)'
                : 'rgba(168, 85, 247, 0.12)',
              border: isJarvisSpeaking
                ? '1px solid var(--cyan)'
                : '1px solid rgba(168, 85, 247, 0.35)',
              color: isJarvisSpeaking ? 'var(--cyan)' : '#c084fc',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.25s ease',
              boxShadow: isJarvisSpeaking ? '0 0 15px rgba(0, 242, 254, 0.3)' : 'none'
            }}
          >
            <Bot size={16} />
            <span>Jarvis AI</span>
            {isJarvisSpeaking && (
              <span style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: '2px' }}>
                <span className="sound-bar" style={{ height: '10px' }}></span>
                <span className="sound-bar" style={{ height: '14px' }}></span>
                <span className="sound-bar" style={{ height: '8px' }}></span>
              </span>
            )}
          </button>

          {/* ATS Resume Button */}
          <button
            onClick={onOpenResume}
            title="View & Download ATS Resume / CV"
            className="btn-secondary nav-resume-btn"
            style={{
              padding: '7px 16px',
              fontSize: '0.85rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} />
            <span className="hide-on-small">ATS Resume</span>
          </button>

          {/* In-Portfolio Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title="Open Embedded Admin Portal"
            className="btn-admin nav-admin-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={14} />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              color: '#fff',
              cursor: 'pointer',
              width: '38px',
              height: '38px'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="liquid-glass"
          style={{
            marginTop: '12px',
            padding: '20px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}
          >
            Education & About
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}
          >
            Tech Stack
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}
          >
            Contact
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenResume(); }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', borderRadius: '12px' }}
            >
              <FileText size={16} />
              <span>ATS Resume & CV</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="btn-admin"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Lock size={16} />
              <span>Launch Admin Portal</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 959px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 768px) {
          .nav-admin-btn { display: none !important; }
        }
        @media (max-width: 560px) {
          .nav-resume-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-on-small { display: none !important; }
        }
      `}</style>
    </header>
  );
}
