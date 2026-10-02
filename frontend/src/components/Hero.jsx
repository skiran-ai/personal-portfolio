import React, { useState } from 'react';
import { Volume2, VolumeX, Bot, ArrowRight, Download, Mail, Sparkles, ShieldCheck, Terminal, Layers, ChevronDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';
import Python3DLogo from './Python3DLogo';

export default function Hero({
  onOpenAdmin,
  onOpenResume,
  onToggleJarvis,
  isJarvisSpeaking,
  onPlayJarvisVoice,
  onStopJarvisVoice,
  timeGreeting = "Greetings"
}) {
  const [photoTilt, setPhotoTilt] = useState({ x: 0, y: 0 });

  const handlePhotoMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setPhotoTilt({ x, y });
  };

  const handlePhotoMouseLeave = () => {
    setPhotoTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(90px, 12vh, 120px) clamp(16px, 4vw, 24px) clamp(40px, 6vh, 80px) clamp(16px, 4vw, 24px)'
      }}
    >
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          alignItems: 'center',
          gap: 'clamp(32px, 5vw, 60px)'
        }}>
          {/* Left Column: Text & Hero Action */}
          <div>
            {/* Status Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '24px',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              marginBottom: '20px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--cyan)', letterSpacing: '0.04em' }}>
                AI INTEGRATED FULL STACK ENGINEER
              </span>
            </div>

            {/* Name */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Hi, I'm <br />
              <span className="gradient-text-cyan">Suryakiran P J</span>
            </h1>

            {/* Role & Bio */}
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              fontWeight: '600',
              color: '#94a3b8',
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Software Engineer{' '}
              <span style={{ color: 'var(--cyan)' }}>
                (AI Integrated Python Django Full Stack Developer)
              </span>
            </p>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              maxWidth: '540px',
              marginBottom: '28px'
            }}>
              Architecting production-ready backend systems with Python & Django, crafting reactive
              3D interfaces, and embedding autonomous Agentic AI to supercharge digital experiences.
            </p>

            {/* Jarvis Hero Voice Controller */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '16px',
              padding: '12px clamp(12px, 3vw, 20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '32px',
              boxShadow: '0 8px 30px rgba(0, 242, 254, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Jarvis AI Voice Assistant
                    {isJarvisSpeaking ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--cyan)',
                        background: 'rgba(0, 242, 254, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 242, 254, 0.3)'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse 1s infinite' }}></span>
                        Speaking Hero Section
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• Auto-Plays on Load</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {isJarvisSpeaking
                      ? `Narrating intro ("${timeGreeting}")...`
                      : `Greets with "${timeGreeting}" & introduces Suryakiran automatically`}
                  </div>
                </div>
              </div>

              {/* Play / Stop Button */}
              <button
                onClick={isJarvisSpeaking ? onStopJarvisVoice : onPlayJarvisVoice}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: isJarvisSpeaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 242, 254, 0.15)',
                  border: isJarvisSpeaking ? '1px solid #ef4444' : '1px solid var(--cyan)',
                  color: isJarvisSpeaking ? '#f87171' : 'var(--cyan)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {isJarvisSpeaking ? (
                  <>
                    <VolumeX size={16} />
                    <span>Mute</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    <span>Read Hero</span>
                  </>
                )}
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              <a href="#projects" className="btn-primary">
                <span>View Projects</span>
                <ArrowRight size={17} />
              </a>

              <button onClick={onOpenAdmin} className="btn-secondary btn-admin">
                <Terminal size={17} />
                <span>Admin Dashboard</span>
              </button>

              <button onClick={onOpenResume} className="btn-secondary">
                <Download size={17} />
                <span>ATS Resume & CV</span>
              </button>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Connect:</span>
              <a
                href="https://github.com/suryakiranpjineesh-bit"
                target="_blank"
                rel="noreferrer"
                title="GitHub Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--cyan)'; e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <GithubIcon size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/surya-kiran-967659351?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = '#38bdf8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <LinkedinIcon size={18} />
              </a>

              <a
                href="https://www.instagram.com/jstt.kiran?igsh=aG83M255aG1wZTho"
                target="_blank"
                rel="noreferrer"
                title="Instagram Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.borderColor = '#f43f5e'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href="mailto:suryakiranpjineesh@gmail.com"
                title="Send Email"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: 3D Holographic Portrait + 3D Python Core Symbol */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative' }}>
            <div
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '320px',
                height: 'min(380px, 85vw)',
                perspective: '1000px',
                cursor: 'pointer'
              }}
            >
              {/* Outer Cyber Neon Ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-15px',
                  borderRadius: '32px',
                  background: 'conic-gradient(from 180deg at 50% 50%, #00f2fe 0deg, #a855f7 180deg, #00f2fe 360deg)',
                  opacity: 0.6,
                  filter: 'blur(20px)',
                  animation: 'pulseGlow 4s ease-in-out infinite',
                  zIndex: 1
                }}
              />

              {/* Holographic 3D Tilting Card with Suryakiran's Real Photo */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 9, 14, 0.95) 100%)',
                  border: '2px solid rgba(0, 242, 254, 0.4)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  transform: `rotateY(${photoTilt.x}deg) rotateX(${photoTilt.y}deg)`,
                  transition: 'transform 0.15s ease-out',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
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
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />

                {/* Cyber HUD Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    padding: '12px 16px',
                    background: 'rgba(7, 9, 14, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Suryakiran P J</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--cyan)' }}>Django & AI Full Stack</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Python Symbol Animation Showcase Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.88) 0%, rgba(7, 9, 14, 0.95) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                borderRadius: '20px',
                padding: '12px 16px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                position: 'relative',
                zIndex: 3
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: '700', letterSpacing: '0.06em' }}>
                  CORE STACK ENGINE
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff', margin: '3px 0' }}>
                  Python 3D Core
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Django Backend Architecture & Autonomous AI Agents
                </div>
              </div>

              {/* Interactive 3D Python Logo */}
              <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                <Python3DLogo />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Animation Cue */}
        <div
          style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <a
            href="#about"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            title="Scroll down to explore education and experience"
          >
            {/* Cyber Mouse Shape */}
            <div
              style={{
                width: '24px',
                height: '38px',
                borderRadius: '14px',
                border: '2px solid rgba(0, 242, 254, 0.45)',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '8px',
                  borderRadius: '2px',
                  background: 'var(--cyan)',
                  marginTop: '6px',
                  animation: 'scrollWheel 1.6s ease-in-out infinite'
                }}
              />
            </div>

            <span style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Scroll To Explore
            </span>

            <ChevronDown size={18} style={{ animation: 'chevronBounce 1.5s ease-in-out infinite', color: 'var(--cyan)' }} />
          </a>
        </div>
      </div>
    </section>
  );
}
