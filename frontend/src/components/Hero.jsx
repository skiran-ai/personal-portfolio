import React, { useState } from 'react';
import { Volume2, VolumeX, Bot, ArrowRight, Download, Mail, Phone, Sparkles, ChevronDown, MapPin, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import Python3DLogo from './Python3DLogo';

export default function Hero({
  onOpenResume,
  onOpenJarvis,
  isJarvisSpeaking,
  onPlayJarvisVoice,
  onStopJarvisVoice,
}) {
  const [photoTilt, setPhotoTilt] = useState({ x: 0, y: 0 });

  const handlePhotoMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setPhotoTilt({ x, y });
  };

  const handlePhotoMouseLeave = () => {
    setPhotoTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: 'calc(100dvh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(42px, 7vh, 88px) clamp(16px, 4vw, 40px) clamp(40px, 6vh, 72px)',
      }}
    >
      <div className="container-shell">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
            alignItems: 'center',
            gap: 'clamp(32px, 5vw, 72px)',
          }}
        >
          {/* Left Column */}
          <div>
            <div className="section-index-pill" style={{ marginBottom: '20px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>FDE // PYTHON · DJANGO · AGENTIC AI</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.35rem, 5vw, 4.35rem)',
                fontWeight: '800',
                lineHeight: '1.06',
                marginBottom: '16px',
                color: '#ffffff',
              }}
            >
              Engineering{' '}
              <span className="font-serif-accent" style={{ color: 'var(--cyan)', fontSize: '1.08em' }}>
                verifiable
              </span>
              <br />
              <span className="gradient-text-cyan">Suryakiran P J</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.9vw, 1.3rem)',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '14px',
                lineHeight: '1.4',
              }}
            >
              Python, Django REST Framework &amp;{' '}
              <span style={{ color: 'var(--cyan)' }}>Schema-Grounded AI Systems</span>
            </p>

            <p
              style={{
                fontSize: '0.98rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                maxWidth: '580px',
                marginBottom: '22px',
              }}
            >
              I build deterministic Django backends, reactive React interfaces, and structured Gemini AI workflows you can
              test directly inside this portfolio — no static mockups, no unverifiable buzzwords.
            </p>

            {/* Recruiter Quick-Facts Strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '26px',
              }}
            >
              <span className="tech-pill tech-pill-emerald">
                <CheckCircle2 size={13} />
                Available Immediately
              </span>
              <span className="tech-pill">
                <MapPin size={13} />
                Ernakulam • Remote / Relocation Ready
              </span>
            </div>

            {/* Opt-In Jarvis Agent Bar (NEVER auto-plays audio on page load) */}
            <div
              className="liquid-glass liquid-glass-border"
              style={{
                borderRadius: '18px',
                padding: '14px clamp(12px, 3vw, 18px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={21} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Jarvis AI Representative
                    {isJarvisSpeaking && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--cyan)',
                          background: 'rgba(0, 242, 254, 0.12)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 242, 254, 0.3)',
                        }}
                      >
                        Speaking
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Paste a Job Description to check fit, or click Audio Brief (opt-in)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onOpenJarvis('jd')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 13px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.16)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#e9d5ff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                  }}
                >
                  <Sparkles size={14} />
                  <span>Analyze JD Fit</span>
                </button>

                <button
                  onClick={isJarvisSpeaking ? onStopJarvisVoice : onPlayJarvisVoice}
                  title="Optional voice brief (only plays when clicked)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 13px',
                    borderRadius: '10px',
                    background: isJarvisSpeaking ? 'rgba(239, 68, 68, 0.18)' : 'rgba(0, 242, 254, 0.12)',
                    border: isJarvisSpeaking ? '1px solid #ef4444' : '1px solid rgba(0, 242, 254, 0.45)',
                    color: isJarvisSpeaking ? '#f87171' : 'var(--cyan)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                  }}
                >
                  {isJarvisSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isJarvisSpeaking ? 'Stop Audio' : 'Audio Brief'}</span>
                </button>
              </div>
            </div>

            {/* Public Action Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
              <a href="#projects" className="btn-primary">
                <span>Try Live Project Sandboxes</span>
                <ArrowRight size={17} />
              </a>

              <button onClick={onOpenResume} className="btn-secondary">
                <Download size={17} />
                <span>ATS Resume &amp; CV</span>
              </button>

              <a href="#contact" className="btn-secondary">
                <Mail size={17} />
                <span>Contact</span>
              </a>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '500' }}>Channels:</span>
              <a href="https://github.com/skiran-ai" target="_blank" rel="noreferrer" title="GitHub Profile (@skiran-ai)" className="hero-social-btn">
                <GithubIcon size={18} />
              </a>
              <a href="https://www.linkedin.com/in/surya-kiran-967659351" target="_blank" rel="noreferrer" title="LinkedIn Profile" className="hero-social-btn">
                <LinkedinIcon size={18} />
              </a>
              <a href="tel:+918129867662" title="Call +91 8129867662" className="hero-social-btn">
                <Phone size={18} />
              </a>
              <a href="mailto:suryakiranpjineesh@gmail.com" title="Email Suryakiran" className="hero-social-btn">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
            <div
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 'clamp(280px, 28vw, 370px)',
                height: 'clamp(320px, 34vw, 430px)',
                perspective: '1000px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 9, 14, 0.95) 100%)',
                  border: '1.5px solid rgba(0, 242, 254, 0.35)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  transform: `rotateY(${photoTilt.x}deg) rotateX(${photoTilt.y}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <img
                  src="/suryakiran.jpg"
                  alt="Suryakiran P J"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />

                <div
                  className="liquid-glass"
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Suryakiran P J</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--cyan)' }}>Python • Django • AI Systems</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>Open to Work</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="liquid-glass liquid-glass-border"
              style={{
                width: '100%',
                maxWidth: 'clamp(280px, 28vw, 370px)',
                borderRadius: '20px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-mono-tag" style={{ fontSize: '0.68rem', color: 'var(--cyan)', fontWeight: '700' }}>
                  BACKEND &amp; AI RUNTIME
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff', margin: '3px 0' }}>
                  Python 3 + Django
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  DRF APIs, Deterministic Engines &amp; Gemini Agents
                </div>
              </div>

              <div style={{ width: 'clamp(88px, 22vw, 114px)', height: 'clamp(88px, 22vw, 114px)', flexShrink: 0 }}>
                <Python3DLogo />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
          <a
            href="#about"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Explore Architecture &amp; Proof
            </span>
            <ChevronDown size={18} style={{ animation: 'chevronBounce 1.5s ease-in-out infinite', color: 'var(--cyan)' }} />
          </a>
        </div>
      </div>

      <style>{`
        .hero-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .hero-social-btn:hover {
          color: var(--cyan);
          border-color: var(--cyan);
        }
      `}</style>
    </section>
  );
}
