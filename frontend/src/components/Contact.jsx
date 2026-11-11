import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Briefcase,
  Clock,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import useScrollReveal from '../hooks/useScrollReveal';
import { API_BASE } from '../config/api';

export default function Contact({ onOpenJarvis }) {
  const [revealRef, isVisible] = useScrollReveal();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  // Instant Scheduling helper
  const [slotDate, setSlotDate] = useState('');
  const [slotWindow, setSlotWindow] = useState('10:30 AM – 12:30 PM IST');
  const [slotRole, setSlotRole] = useState('Python / Django Backend');

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('suryakiranpjineesh@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+918129867662');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1800);
  };

  const prefillInterviewSlot = () => {
    const datePart = slotDate || 'Next available business day';
    setFormData((prev) => ({
      ...prev,
      subject: `[Interview Slot Request] ${slotRole} — ${datePart}`,
      message:
        `Hi Suryakiran,\n\nWe'd like to schedule an introductory technical discussion for a ${slotRole} opportunity.\n` +
        `Preferred Slot: ${datePart} (${slotWindow})\n\nLooking forward to connecting!`,
    }));
  };

  const buildCalendarLink = () => {
    const title = encodeURIComponent(`Interview: Suryakiran P J (${slotRole})`);
    const details = encodeURIComponent(
      `Technical discussion with Suryakiran P J (Python / Django / AI Engineer).\nPhone: +91 8129867662\nPreferred Window: ${slotWindow}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=suryakiranpjineesh@gmail.com`;
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
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setLastSent({ ...formData });
        setStatus({ type: 'success', message: data.message || 'Message received!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to deliver message.' });
      }
    } catch {
      setLastSent({ ...formData });
      setStatus({
        type: 'error',
        message: 'Backend API is offline right now — click "Open Pre-filled in Gmail Web" below to send directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-pad">
      <div
        ref={revealRef}
        className="container-shell"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-index-pill">
            <Mail size={14} color="var(--cyan)" />
            <span>04 // RECRUITER FAST-TRACK &amp; SCHEDULING</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.75rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Let&apos;s <span className="font-serif-accent" style={{ color: 'var(--cyan)', fontSize: '1.12em' }}>Connect</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '0.96rem' }}>
            Direct coordinates, WhatsApp &amp; Google Calendar scheduling, plus instant JD Fit checking.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(22px, 4vw, 36px)' }}>
          {/* Fast-Track + Instant Scheduling Card */}
          <div className="glass-panel" style={{ padding: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: 0 }}>Recruiter Fast-Track</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                  <Clock size={12} /> AVAILABILITY
                </div>
                <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: '600', marginTop: '4px' }}>Immediate</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,242,254,0.07)', border: '1px solid rgba(0,242,254,0.22)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                  <Briefcase size={12} /> TARGET ROLES
                </div>
                <div style={{ fontSize: '0.84rem', color: '#fff', fontWeight: '600', marginTop: '4px' }}>Python / Django / AI / FDE</div>
              </div>
            </div>

            {/* Email & Phone Copy */}
            <div style={{ padding: '11px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email</div>
                <a href="mailto:suryakiranpjineesh@gmail.com" style={{ fontSize: '0.88rem', fontWeight: '600', color: '#fff', textDecoration: 'none', wordBreak: 'break-all' }}>
                  suryakiranpjineesh@gmail.com
                </a>
              </div>
              <button type="button" onClick={handleCopyEmail} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
                {copiedEmail ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ padding: '11px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Phone / WhatsApp</div>
                <a href="tel:+918129867662" style={{ fontSize: '0.88rem', fontWeight: '600', color: '#fff', textDecoration: 'none' }}>
                  +91 8129867662
                </a>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" onClick={handleCopyPhone} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
                  {copiedPhone ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://wa.me/918129867662?text=${encodeURIComponent('Hi Suryakiran, saw your portfolio and would like to schedule a quick interview call.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#34d399', borderColor: 'rgba(16,185,129,0.35)' }}
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Instant Interview Slot Scheduler */}
            <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.04)', border: '1px solid rgba(0, 242, 254, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Instant Interview Slot Builder
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))', gap: '8px' }}>
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="form-input"
                  style={{ padding: '7px 10px', fontSize: '0.78rem' }}
                />
                <select
                  value={slotWindow}
                  onChange={(e) => setSlotWindow(e.target.value)}
                  className="form-input"
                  style={{ padding: '7px 10px', fontSize: '0.78rem' }}
                >
                  <option>10:30 AM – 12:30 PM IST</option>
                  <option>02:30 PM – 05:00 PM IST</option>
                  <option>06:00 PM – 08:00 PM IST</option>
                </select>
              </div>
              <select
                value={slotRole}
                onChange={(e) => setSlotRole(e.target.value)}
                className="form-input"
                style={{ padding: '7px 10px', fontSize: '0.78rem' }}
              >
                <option>Python / Django Backend</option>
                <option>AI-Integrated Full Stack</option>
                <option>Forward Deployed Engineer</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={prefillInterviewSlot} className="btn-secondary" style={{ flex: 1, padding: '8px 10px', fontSize: '0.78rem' }}>
                  Pre-fill Request Form →
                </button>
                <a href={buildCalendarLink()} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, padding: '8px 10px', fontSize: '0.78rem' }}>
                  <Calendar size={13} /> Google Calendar
                </a>
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="#c084fc" />
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>Ernakulam, Kerala • Remote / Kochi / Bengaluru / Relocation</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="https://github.com/skiran-ai" target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                <GithubIcon size={15} /> GitHub (@skiran-ai)
              </a>
              <a href="https://www.linkedin.com/in/surya-kiran-967659351" target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}>
                <LinkedinIcon size={15} /> LinkedIn
              </a>
              <button type="button" onClick={() => onOpenJarvis?.('jd')} className="btn-secondary" style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem', borderColor: 'rgba(168,85,247,0.4)', color: '#e9d5ff' }}>
                Test JD Fit
              </button>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '18px' }}>Send Direct Inquiry</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Your Name *</label>
                  <input type="text" required placeholder="Recruiter or Hiring Manager" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Email Address *</label>
                  <input type="email" required placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Role / Subject</label>
                <input type="text" placeholder="Backend Python/Django Role or Collaboration" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="form-input" />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Message *</label>
                <textarea required rows={6} placeholder="Share interview details, role link, or inquiry..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="form-input" style={{ resize: 'vertical' }} />
              </div>

              {status && (
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: status.type === 'success' ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)', border: status.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444', color: status.type === 'success' ? '#34d399' : '#fca5a5', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{status.message}</span>
                  </div>
                  {lastSent && (
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=suryakiranpjineesh@gmail.com&su=${encodeURIComponent(lastSent.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(lastSent.message)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--cyan)', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} /> Open Pre-filled in Gmail Web
                    </a>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px' }}>
                <Send size={15} />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
