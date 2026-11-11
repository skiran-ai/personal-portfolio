import React, { useState } from 'react';
import { Search, Play, FileText, Bot, Mail, Lock, X, ArrowRight, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenSandbox,
  onOpenJarvis,
  onOpenResume,
  onOpenAdmin,
}) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleClose = () => {
    setQuery('');
    setSelectedIdx(0);
    onClose();
  };

  if (!isOpen) return null;

  const actions = [
    {
      id: 'sandbox-finsight',
      label: 'Launch FinSight AI Live Sandbox',
      hint: 'Cash-flow leak detector & 90-day projection chart',
      icon: Play,
      run: () => onOpenSandbox('finsight'),
    },
    {
      id: 'sandbox-paymatch',
      label: 'Launch PayMatch AI Live Sandbox',
      hint: 'Gateway vs ledger multi-pass reconciliation',
      icon: Play,
      run: () => onOpenSandbox('paymatch'),
    },
    {
      id: 'sandbox-finsim',
      label: 'Launch FinSim Stress Simulator',
      hint: 'Macroeconomic shock & runway SVG chart',
      icon: Play,
      run: () => onOpenSandbox('finsim'),
    },
    {
      id: 'jarvis-jd',
      label: 'Analyze Job Description Fit (Jarvis Gemini)',
      hint: 'Paste a JD for honest skills, evidence & gap analysis',
      icon: Bot,
      run: () => onOpenJarvis('jd'),
    },
    {
      id: 'resume',
      label: 'Open Role-Tailored ATS Resume & CV',
      hint: 'Toggle Balanced / Backend Django / AI Focus',
      icon: FileText,
      run: () => onOpenResume(),
    },
    {
      id: 'github',
      label: 'Open GitHub Profile (@skiran-ai)',
      hint: 'https://github.com/skiran-ai',
      icon: ExternalLink,
      run: () => window.open('https://github.com/skiran-ai', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'whatsapp',
      label: 'Quick WhatsApp Recruiter Chat',
      hint: '+91 8129867662',
      icon: MessageCircle,
      run: () =>
        window.open(
          'https://wa.me/918129867662?text=' + encodeURIComponent('Hi Suryakiran, saw your engineering portfolio and would like to discuss a role.'),
          '_blank',
          'noopener,noreferrer'
        ),
    },
    {
      id: 'copy-email',
      label: copiedEmail ? 'Copied: suryakiranpjineesh@gmail.com' : 'Copy Email Address',
      hint: 'suryakiranpjineesh@gmail.com',
      icon: copiedEmail ? Check : Copy,
      run: () => {
        navigator.clipboard?.writeText('suryakiranpjineesh@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 1500);
      },
      keepOpen: true,
    },
    {
      id: 'jump-contact',
      label: 'Book Interview Slot / Fast-Track Contact',
      hint: '#contact',
      icon: Mail,
      run: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      id: 'admin',
      label: 'Open Private Admin Console',
      hint: 'Protected project, inbox & analytics management',
      icon: Lock,
      run: () => onOpenAdmin(),
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.hint.toLowerCase().includes(query.toLowerCase())
  );

  const safeIdx = Math.min(selectedIdx, Math.max(0, filtered.length - 1));

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter' && filtered[safeIdx]) {
      e.preventDefault();
      const chosen = filtered[safeIdx];
      chosen.run();
      if (!chosen.keepOpen) handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '590px',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 16, 29, 0.98)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '18px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Search size={18} color="var(--cyan)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or use ↑ ↓ Enter..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.94rem',
            }}
          />
          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: 'min(400px, 60dvh)', overflowY: 'auto', padding: '8px' }}>
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            const active = idx === safeIdx;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setSelectedIdx(idx)}
                onClick={() => {
                  item.run();
                  if (!item.keepOpen) handleClose();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  background: active ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                  border: active ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={16} color="var(--cyan)" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.hint}</div>
                  </div>
                </div>
                <ArrowRight size={14} color={active ? 'var(--cyan)' : 'var(--text-muted)'} />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              No matching commands.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
