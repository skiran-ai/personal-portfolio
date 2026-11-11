import React, { useState, useEffect } from 'react';
import { Bot, FileText, Menu, X, Command } from 'lucide-react';

export default function Navbar({
  onOpenResume,
  onToggleJarvis,
  onOpenCommandPalette,
  isJarvisSpeaking = false,
  apiHealth = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

          if (mobileMenuOpen || currentScrollY <= 60) {
            setIsNavHidden(false);
          } else if (Math.abs(currentScrollY - lastScrollY) > 10) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsNavHidden(true);
            } else if (currentScrollY < lastScrollY) {
              setIsNavHidden(false);
            }
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const backendOnline = apiHealth?.status === 'ok';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3.5vw, 32px)',
        width: '100%',
        transform: isNavHidden ? 'translateY(-120%)' : 'translateY(0)',
        transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
    >
      <div
        className="liquid-glass liquid-glass-border container-shell"
        style={{
          borderRadius: '9999px',
          padding: 'clamp(8px, 1.5vw, 11px) clamp(14px, 2.5vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        {/* Brand */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(0, 242, 254, 0.45)',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
              flexShrink: 0,
            }}
          >
            <img
              src="/suryakiran.jpg"
              alt="Suryakiran P J"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '1.02rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SURYAKIRAN</span>
              <span style={{ color: 'var(--cyan)' }}>P J</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: backendOnline ? '#10b981' : '#38bdf8',
                  boxShadow: backendOnline ? '0 0 6px #10b981' : '0 0 6px #38bdf8',
                  display: 'inline-block',
                }}
              />
              <span>Full Stack &amp; AI Engineer</span>
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <a href="#about" className="nav-link-item">Engineering &amp; Edu</a>
          <a href="#skills" className="nav-link-item">Evidence Stack</a>
          <a href="#projects" className="nav-link-item">Projects &amp; Sandboxes</a>
          <a href="#contact" className="nav-link-item">Contact</a>
        </nav>

        {/* Actions (Public-only, zero Admin clutter) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Ctrl+K)"
            className="hide-on-small"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: '600',
            }}
          >
            <Command size={13} />
            <span>Ctrl+K</span>
          </button>

          <button
            onClick={onToggleJarvis}
            title="Chat with Jarvis AI or Run JD Fit Analyzer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 14px',
              borderRadius: '9999px',
              background: isJarvisSpeaking ? 'rgba(0, 242, 254, 0.18)' : 'rgba(168, 85, 247, 0.12)',
              border: isJarvisSpeaking ? '1px solid var(--cyan)' : '1px solid rgba(168, 85, 247, 0.35)',
              color: isJarvisSpeaking ? 'var(--cyan)' : '#c084fc',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: '600',
              transition: 'all 0.25s ease',
            }}
          >
            <Bot size={15} />
            <span>Jarvis AI</span>
            {isJarvisSpeaking && (
              <span style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: '2px' }}>
                <span className="sound-bar" style={{ height: '10px' }} />
                <span className="sound-bar" style={{ height: '14px' }} />
                <span className="sound-bar" style={{ height: '8px' }} />
              </span>
            )}
          </button>

          <button
            onClick={onOpenResume}
            title="View & Download ATS Resume / CV"
            className="btn-secondary nav-resume-btn"
            style={{
              padding: '7px 15px',
              fontSize: '0.84rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={14} />
            <span className="hide-on-small">ATS Resume</span>
          </button>

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
              height: '38px',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}>
            Engineering &amp; Education
          </a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}>
            Evidence Stack
          </a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}>
            Projects &amp; Sandboxes
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', padding: '6px 0' }}>
            Contact
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenResume(); }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', borderRadius: '12px' }}
            >
              <FileText size={16} />
              <span>ATS Resume &amp; CV</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCommandPalette(); }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', borderRadius: '12px' }}
            >
              <Command size={16} />
              <span>Command Palette</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-link-item {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.87rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link-item:hover { color: #fff; }
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 959px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 560px) {
          .nav-resume-btn { display: none !important; }
        }
        @media (max-width: 720px) {
          .hide-on-small { display: none !important; }
        }
      `}</style>
    </header>
  );
}
