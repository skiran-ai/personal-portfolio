import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, AlertCircle, MapPin, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import confetti from 'canvas-confetti';
import useScrollReveal from '../hooks/useScrollReveal';
import { API_BASE } from '../config/api';

export default function Contact() {
  const [revealRef, isVisible] = useScrollReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('suryakiranpjineesh@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('8129867662');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.status === 'success') {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch (e) {
          // Safe fallback for canvas-restricted browsers
        }
        setLastSent({ ...formData });
        setStatus({
          type: 'success',
          message: data.message || 'Your message has been received! It was sent to Suryakiran (suryakiranpjineesh@gmail.com) and logged in the Admin Inbox.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to deliver message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Could not reach backend API. You can also send directly via Gmail below.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)', position: 'relative', zIndex: 10 }}>
      <div
        ref={revealRef}
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
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
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            marginBottom: '12px'
          }}>
            <Mail size={15} color="var(--cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--cyan)' }}>GET IN TOUCH</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Let's Build Something <span className="gradient-text-cyan">Extraordinary</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.98rem' }}>
            Whether discussing high-scale Django architectures, AI agent workflows, or engineering opportunities, I'm ready to collaborate.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)'
        }}>
          {/* Direct Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>
                Contact Coordinates
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <a
                      href="mailto:suryakiranpjineesh@gmail.com"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'var(--text-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                        <Mail size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct Gmail</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#fff', wordBreak: 'break-all' }}>suryakiranpjineesh@gmail.com</div>
                      </div>
                    </a>

                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      title="Copy email to clipboard"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: copiedEmail ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        border: copiedEmail ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                        color: copiedEmail ? '#34d399' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=suryakiranpjineesh@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        color: 'var(--cyan)',
                        textDecoration: 'none',
                        background: 'rgba(0, 242, 254, 0.08)',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Launch in Gmail Web</span>
                    </a>
                  </div>
                </div>

                {/* Phone / Mobile */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <a
                    href="tel:8129867662"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mobile Number</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#fff' }}>+91 8129867662</div>
                    </div>
                  </a>

                  <button
                    onClick={handleCopyPhone}
                    type="button"
                    title="Copy phone number"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: copiedPhone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: copiedPhone ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                      color: copiedPhone ? '#34d399' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#fff' }}>Ernakulam, Kerala, India</div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', fontWeight: '600' }}>
                  Professional Channels
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a
                    href="https://github.com/suryakiranpjineesh-bit"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/surya-kiran-967659351?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    <LinkedinIcon size={16} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>
              Send Direct Message
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recruiter or Collaborator"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer Opportunity / Project Inquiry"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details regarding your opportunity or inquiry..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {status && (
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: status.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
                  color: status.type === 'success' ? '#34d399' : '#f87171',
                  fontSize: '0.88rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{status.message}</span>
                  </div>

                  {lastSent && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=suryakiranpjineesh@gmail.com&su=${encodeURIComponent(lastSent.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(lastSent.message)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(0, 242, 254, 0.15)',
                          border: '1px solid var(--cyan)',
                          color: 'var(--cyan)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Open Pre-filled in Gmail Web</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ padding: '14px', marginTop: '6px', cursor: 'pointer' }}
              >
                <Send size={16} />
                <span>{loading ? 'Transmitting...' : 'Dispatch Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
