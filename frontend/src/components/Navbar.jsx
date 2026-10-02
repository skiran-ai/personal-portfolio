import React, { useState, useEffect } from 'react';
import { Bot, FileText, Lock, Menu, X, Sparkles, Terminal } from 'lucide-react';

export default function Navbar({ onOpenAdmin, onOpenResume, onToggleJarvis, isJarvisSpeaking }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down
          setVisible(false);
        } else if (lastScrollY - currentScrollY > 6) {
          // Scrolling up
          setVisible(true);
        }
      } else {
        // At or near top of the page
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-bottom 0.3s ease',
        background: scrolled ? 'rgba(7, 9, 14, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        padding: '16px 24px'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07090e',
            fontWeight: '800',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}>
            SK
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#fff' }}>
              SURYAKIRAN <span style={{ color: 'var(--cyan)' }}>P J</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Full Stack & AI Engineer
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Education & About
          </a>
          <a href="#skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Tech Stack
          </a>
          <a href="#projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Projects
          </a>
          <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Contact
          </a>
        </nav>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Jarvis AI Button */}
          <button
            onClick={onToggleJarvis}
            title="Chat with Jarvis AI"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '24px',
              background: isJarvisSpeaking ? 'rgba(0, 242, 254, 0.2)' : 'rgba(168, 85, 247, 0.12)',
              border: isJarvisSpeaking ? '1px solid var(--cyan)' : '1px solid rgba(168, 85, 247, 0.35)',
              color: isJarvisSpeaking ? 'var(--cyan)' : '#c084fc',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            <Bot size={16} />
            <span>Jarvis AI</span>
            {isJarvisSpeaking && (
              <span style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                <span className="sound-bar" style={{ height: '10px' }}></span>
                <span className="sound-bar" style={{ height: '14px' }}></span>
                <span className="sound-bar" style={{ height: '8px' }}></span>
              </span>
            )}
          </button>

          {/* ATS Resume Button */}
          <button
            onClick={onOpenResume}
            title="View & Download ATS Resume"
            className="btn-secondary nav-resume-btn"
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}
          >
            <FileText size={15} />
            <span className="hide-on-small">ATS Resume</span>
          </button>

          {/* In-Portfolio Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title="Open Embedded Admin Dashboard"
            className="btn-admin nav-admin-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={14} />
            <span>Admin Portal</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '8px'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '16px',
          padding: '20px',
          background: 'rgba(13, 19, 34, 0.98)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '6px 0' }}
          >
            Education & About
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '6px 0' }}
          >
            Tech Stack
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '6px 0' }}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '6px 0' }}
          >
            Contact
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenResume(); }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
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
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 768px) {
          .nav-admin-btn { display: none !important; }
        }
        @media (max-width: 540px) {
          .nav-resume-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-on-small { display: none !important; }
        }
      `}</style>
    </header>
  );
}
