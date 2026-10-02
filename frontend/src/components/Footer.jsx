import React from 'react';
import { Mail, Heart, Sparkles, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export default function Footer({ onOpenAdmin, onOpenResume }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.95)',
      padding: '48px 24px 32px 24px',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              SURYAKIRAN <span style={{ color: 'var(--cyan)' }}>P J</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Software Engineer | AI Integrated Python Django Full Stack Developer
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>About & Education</a>
            <a href="#skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>Tech Stack</a>
            <a href="#projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>Projects</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>Contact</a>
            <button
              onClick={onOpenResume}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              ATS Resume
            </button>
            <button
              onClick={onOpenAdmin}
              style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Terminal size={14} />
              <span>Admin Console</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://github.com/suryakiranpjineesh-bit" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="GitHub">
              <GithubIcon size={18} />
            </a>
            <a href="https://www.linkedin.com/in/surya-kiran-967659351?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="LinkedIn">
              <LinkedinIcon size={18} />
            </a>
            <a href="https://www.instagram.com/jstt.kiran?igsh=aG83M255aG1wZTho" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="mailto:suryakiranpjineesh@gmail.com" style={{ color: 'var(--text-secondary)' }} title="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Suryakiran P J. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Engineered with React 19, Python Django 6, Three.js 3D WebGL & Jarvis AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
